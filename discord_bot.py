import discord
from discord import app_commands
from discord.ext import commands
from datetime import datetime, timezone, timedelta
import pytz
import pymongo
import os
import random
import string
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
DISCORD_TOKEN = os.getenv('DISCORD_TOKEN') or 'MTUzNDk3MDI3NzYwNjMzMDQ2OA.GPQpaW.Iup_pkga4HOpjei3OwI7Bdz25LDp_JHU4nEaRk'
MONGODB_URI = "mongodb+srv://STARFlip:admin@rblxroll.yngfjf8.mongodb.net/bloxbash?retryWrites=true&w=majority&appName=rblxroll"
REWARD_PER_INVITE = 0.10  # $0.10 per invite
European_TZ = pytz.timezone('Europe/Bucharest')

# Intents
intents = discord.Intents.default()
intents.members = True
intents.invites = True
intents.message_content = True

bot = commands.Bot(command_prefix='!', intents=intents)

# MongoDB connection
mongo_client = None
db = None

def connect_mongodb():
    """Connect to MongoDB"""
    global mongo_client, db
    try:
        mongo_client = pymongo.MongoClient(MONGODB_URI)
        db = mongo_client['bloxbashh']
        print("Connected to MongoDB")
        return True
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
        return False

# Store invite data
invite_data = {}
user_invites = {}  # Maps user ID to their invite count
pending_verifications = {}  # Maps Discord ID to verification code and username

def is_past_midnight_European():
    """Check if current time is past midnight European time tonight"""
    now = datetime.now(European_TZ)
    midnight = now.replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(days=1)
    return now >= midnight

def generate_verification_code():
    """Generate a random 6-character verification code"""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

async def get_roblox_user_description(username):
    """Get user description from Roblox API"""
    try:
        # Search for user
        search_response = requests.get(
            f'https://users.roblox.com/v1/users/search?keyword={username}&limit=10'
        )
        search_data = search_response.json()

        if 'data' not in search_data or not search_data['data']:
            return None, "User not found"

        # Find exact match
        user_data = None
        for user in search_data['data']:
            if user['name'].lower() == username.lower():
                user_data = user
                break

        if not user_data:
            return None, "User not found"

        # Get user details including description
        user_response = requests.get(f"https://users.roblox.com/v1/users/{user_data['id']}")
        user_details = user_response.json()

        return user_details.get('description', ''), None

    except Exception as e:
        return None, f"Error fetching Roblox data: {e}"

@bot.event
async def on_ready():
    print(f'{bot.user.name} has connected to Discord!')
    
    # Connect to MongoDB
    if not connect_mongodb():
        print("Warning: MongoDB connection failed, rewards will not work")
    
    # Sync slash commands
    try:
        await bot.tree.sync()
        print("Slash commands synced")
    except Exception as e:
        print(f"Error syncing commands: {e}")
    
    # Initialize invite tracking for all servers
    for guild in bot.guilds:
        await initialize_guild_invites(guild)

async def initialize_guild_invites(guild):
    """Initialize invite tracking for a guild"""
    try:
        invites = await guild.invites()
        invite_data[guild.id] = {}
        for invite in invites:
            invite_data[guild.id][invite.code] = invite.uses
        print(f"Initialized {len(invites)} invites for guild {guild.name}")
    except Exception as e:
        print(f"Error initializing invites for {guild.name}: {e}")

@bot.event
async def on_guild_join(guild):
    """Handle bot joining a new guild"""
    await initialize_guild_invites(guild)

@bot.event
async def on_member_join(member):
    """Track when a member joins and identify who invited them"""
    if is_past_midnight_European():
        print("Invite tracking ended - past midnight European time")
        return
    
    try:
        guild = member.guild
        invites = await guild.invites()
        
        # Find which invite was used
        used_invite = None
        for invite in invites:
            if invite.code in invite_data.get(guild.id, {}):
                if invite.uses > invite_data[guild.id][invite.code]:
                    used_invite = invite
                    break
        
        if used_invite and used_invite.inviter:
            inviter_id = str(used_invite.inviter.id)
            
            # Update invite count
            if inviter_id not in user_invites:
                user_invites[inviter_id] = 0
            user_invites[inviter_id] += 1
            
            # Update stored invite data
            invite_data[guild.id][used_invite.code] = used_invite.uses
            
            print(f"{member.name} joined via invite from {used_invite.inviter.name}")
            print(f"Inviter {used_invite.inviter.name} now has {user_invites[inviter_id]} invites")
            
            # Try to reward the inviter
            await reward_inviter(inviter_id, guild)
            
    except Exception as e:
        print(f"Error tracking invite: {e}")

async def reward_inviter(discord_id, guild):
    """Reward the inviter with balance using MongoDB directly"""
    if not db:
        print("MongoDB not connected, cannot reward user")
        return
    
    try:
        # Find user by Discord ID in MongoDB
        users_collection = db['users']
        user = users_collection.find_one({'discordId': discord_id})
        
        if user:
            # Update user balance
            new_balance = (user.get('balance', 0) or 0) + REWARD_PER_INVITE
            users_collection.update_one(
                {'_id': user['_id']},
                {'$set': {'balance': new_balance}}
            )
            
            print(f"Successfully rewarded {user.get('username', discord_id)} with ${REWARD_PER_INVITE}")

            # Try to send DM to inviter
            try:
                inviter = await guild.fetch_member(int(discord_id))
                if inviter:
                    embed = discord.Embed(
                        title="🎉 Invite Reward!",
                        description=f"You've been rewarded ${REWARD_PER_INVITE} for inviting someone to the server!",
                        color=0x4CAF50
                    )
                    embed.add_field(name="New Balance", value=f"${new_balance:.2f}", inline=True)
                    embed.add_field(name="Reward Amount", value=f"${REWARD_PER_INVITE}", inline=True)
                    embed.set_footer(text="Keep inviting to earn more!")

                    await inviter.send(embed=embed)
            except Exception as e:
                print(f"Could not send DM to inviter: {e}")
        else:
            print(f"No user found with Discord ID {discord_id}")
            
    except Exception as e:
        print(f"Error rewarding inviter: {e}")

# Slash commands
@bot.tree.command(name="invites", description="Check your invite count and rewards")
async def invites_slash(interaction: discord.Interaction):
    """Check your invite count"""
    if is_past_midnight_European():
        embed = discord.Embed(
            title="⏰ Invite Tracking Ended",
            description="Invite tracking has ended (past midnight European time)",
            color=0xFF6B6B
        )
        await interaction.response.send_message(embed=embed)
        return

    user_id = str(interaction.user.id)
    count = user_invites.get(user_id, 0)
    total_reward = count * REWARD_PER_INVITE

    embed = discord.Embed(
        title="📊 Your Invite Stats",
        color=0x0276FF
    )
    embed.add_field(name="People Invited", value=str(count), inline=True)
    embed.add_field(name="Total Reward", value=f"${total_reward:.2f}", inline=True)
    embed.add_field(name="Reward Per Invite", value=f"${REWARD_PER_INVITE}", inline=True)
    embed.set_footer(text="Invite tracking ends at midnight European time")

    await interaction.response.send_message(embed=embed)

@bot.tree.command(name="link", description="Link your Discord account to your platform account")
async def link_slash(interaction: discord.Interaction, username: str):
    """Link Discord account to platform account with Roblox verification"""
    if not db:
        embed = discord.Embed(
            title="❌ Database Error",
            description="Database not connected",
            color=0xFF6B6B
        )
        await interaction.response.send_message(embed=embed)
        return

    try:
        users_collection = db['users']
        user = users_collection.find_one({'username': username})

        if not user:
            embed = discord.Embed(
                title="❌ User Not Found",
                description=f"User '{username}' not found on the platform",
                color=0xFF6B6B
            )
            await interaction.response.send_message(embed=embed)
            return

        # Generate verification code
        code = generate_verification_code()
        discord_id = str(interaction.user.id)

        # Store pending verification
        pending_verifications[discord_id] = {
            'code': code,
            'username': username,
            'timestamp': datetime.now()
        }

        embed = discord.Embed(
            title="🔐 Verification Required",
            description=f"To verify you own the Roblox account **{username}**, please add this code to your Roblox profile description:",
            color=0xFFA500
        )
        embed.add_field(name="Verification Code", value=f"**{code}**", inline=False)
        embed.add_field(name="Instructions", value="1. Go to your Roblox profile\n2. Click 'Edit Profile'\n3. Add the code to your About/Description\n4. Use /verify command when done", inline=False)
        embed.set_footer(text="This code expires in 10 minutes")

        await interaction.response.send_message(embed=embed)

    except Exception as e:
        embed = discord.Embed(
            title="❌ Error",
            description=f"Error starting verification: {e}",
            color=0xFF6B6B
        )
        await interaction.response.send_message(embed=embed)

@bot.tree.command(name="verify", description="Complete account verification after adding code to Roblox description")
async def verify_slash(interaction: discord.Interaction):
    """Verify the code in Roblox description"""
    if not db:
        embed = discord.Embed(
            title="❌ Database Error",
            description="Database not connected",
            color=0xFF6B6B
        )
        await interaction.response.send_message(embed=embed)
        return

    discord_id = str(interaction.user.id)

    if discord_id not in pending_verifications:
        embed = discord.Embed(
            title="❌ No Pending Verification",
            description="Please use /link <username> first to start the verification process",
            color=0xFF6B6B
        )
        await interaction.response.send_message(embed=embed)
        return

    verification = pending_verifications[discord_id]

    # Check if verification expired (10 minutes)
    if datetime.now() - verification['timestamp'] > timedelta(minutes=10):
        del pending_verifications[discord_id]
        embed = discord.Embed(
            title="❌ Verification Expired",
            description="Your verification code has expired. Please use /link again to get a new code",
            color=0xFF6B6B
        )
        await interaction.response.send_message(embed=embed)
        return

    username = verification['username']
    code = verification['code']

    # Get Roblox user description
    description, error = await get_roblox_user_description(username)

    if error:
        embed = discord.Embed(
            title="❌ Error",
            description=f"Error fetching Roblox data: {error}",
            color=0xFF6B6B
        )
        await interaction.response.send_message(embed=embed)
        return

    # Check if code is in description
    if code in description:
        # Verification successful - link the account
        try:
            users_collection = db['users']
            users_collection.update_one(
                {'username': username},
                {'$set': {'discordId': discord_id}}
            )

            # Remove from pending verifications
            del pending_verifications[discord_id]

            embed = discord.Embed(
                title="✅ Account Linked Successfully",
                description=f"Your Discord account has been linked to {username}",
                color=0x4CAF50
            )
            embed.add_field(name="Username", value=username, inline=True)
            embed.add_field(name="Discord ID", value=discord_id, inline=True)
            embed.set_footer(text="You can now earn rewards for invites!")

            await interaction.response.send_message(embed=embed)

        except Exception as e:
            embed = discord.Embed(
                title="❌ Error",
                description=f"Error linking account: {e}",
                color=0xFF6B6B
            )
            await interaction.response.send_message(embed=embed)
    else:
        embed = discord.Embed(
            title="❌ Verification Failed",
            description=f"Could not find the code '{code}' in your Roblox description",
            color=0xFF6B6B
        )
        embed.add_field(name="Your Description", value=description[:200] + "..." if len(description) > 200 else description, inline=False)
        embed.add_field(name="Expected Code", value=code, inline=True)
        embed.set_footer(text="Make sure you added the code exactly as shown and try again with /verify")

        await interaction.response.send_message(embed=embed)

@bot.tree.command(name="status", description="Check bot status and time remaining")
async def status_slash(interaction: discord.Interaction):
    """Check bot status and time remaining"""
    now = datetime.now(European_TZ)
    midnight = now.replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(days=1)
    time_remaining = midnight - now

    hours = int(time_remaining.total_seconds() // 3600)
    minutes = int((time_remaining.total_seconds() % 3600) // 60)

    embed = discord.Embed(
        title="⏰ Bot Status",
        color=0x0276FF
    )
    embed.add_field(name="Time Remaining", value=f"{hours}h {minutes}m", inline=True)
    embed.add_field(name="Reward Per Invite", value=f"${REWARD_PER_INVITE}", inline=True)
    embed.add_field(name="Timezone", value="European (European)", inline=True)
    embed.set_footer(text="Invite tracking ends at midnight European time")

    await interaction.response.send_message(embed=embed)

# Keep old commands for backward compatibility
@bot.command(name='invites')
async def check_invites(ctx):
    """Check your invite count"""
    if is_past_midnight_European():
        embed = discord.Embed(
            title="⏰ Invite Tracking Ended",
            description="Invite tracking has ended (past midnight European time)",
            color=0xFF6B6B
        )
        await ctx.send(embed=embed)
        return

    user_id = str(ctx.author.id)
    count = user_invites.get(user_id, 0)
    total_reward = count * REWARD_PER_INVITE

    embed = discord.Embed(
        title="📊 Your Invite Stats",
        color=0x0276FF
    )
    embed.add_field(name="People Invited", value=str(count), inline=True)
    embed.add_field(name="Total Reward", value=f"${total_reward:.2f}", inline=True)
    embed.add_field(name="Reward Per Invite", value=f"${REWARD_PER_INVITE}", inline=True)
    embed.set_footer(text="Invite tracking ends at midnight European time")

    await ctx.send(embed=embed)

@bot.command(name='link')
async def link_account(ctx, username: str):
    """Link Discord account to platform account with Roblox verification"""
    if not db:
        embed = discord.Embed(
            title="❌ Database Error",
            description="Database not connected",
            color=0xFF6B6B
        )
        await ctx.send(embed=embed)
        return

    try:
        users_collection = db['users']
        user = users_collection.find_one({'username': username})

        if not user:
            embed = discord.Embed(
                title="❌ User Not Found",
                description=f"User '{username}' not found on the platform",
                color=0xFF6B6B
            )
            await ctx.send(embed=embed)
            return

        # Generate verification code
        code = generate_verification_code()
        discord_id = str(ctx.author.id)

        # Store pending verification
        pending_verifications[discord_id] = {
            'code': code,
            'username': username,
            'timestamp': datetime.now()
        }

        embed = discord.Embed(
            title="🔐 Verification Required",
            description=f"To verify you own the Roblox account **{username}**, please add this code to your Roblox profile description:",
            color=0xFFA500
        )
        embed.add_field(name="Verification Code", value=f"**{code}**", inline=False)
        embed.add_field(name="Instructions", value="1. Go to your Roblox profile\n2. Click 'Edit Profile'\n3. Add the code to your About/Description\n4. Use !verify command when done", inline=False)
        embed.set_footer(text="This code expires in 10 minutes")

        await ctx.send(embed=embed)

    except Exception as e:
        embed = discord.Embed(
            title="❌ Error",
            description=f"Error starting verification: {e}",
            color=0xFF6B6B
        )
        await ctx.send(embed=embed)

@bot.command(name='verify')
async def verify_account(ctx):
    """Verify the code in Roblox description"""
    if not db:
        embed = discord.Embed(
            title="❌ Database Error",
            description="Database not connected",
            color=0xFF6B6B
        )
        await ctx.send(embed=embed)
        return

    discord_id = str(ctx.author.id)

    if discord_id not in pending_verifications:
        embed = discord.Embed(
            title="❌ No Pending Verification",
            description="Please use !link <username> first to start the verification process",
            color=0xFF6B6B
        )
        await ctx.send(embed=embed)
        return

    verification = pending_verifications[discord_id]

    # Check if verification expired (10 minutes)
    if datetime.now() - verification['timestamp'] > timedelta(minutes=10):
        del pending_verifications[discord_id]
        embed = discord.Embed(
            title="❌ Verification Expired",
            description="Your verification code has expired. Please use !link again to get a new code",
            color=0xFF6B6B
        )
        await ctx.send(embed=embed)
        return

    username = verification['username']
    code = verification['code']

    # Get Roblox user description
    description, error = await get_roblox_user_description(username)

    if error:
        embed = discord.Embed(
            title="❌ Error",
            description=f"Error fetching Roblox data: {error}",
            color=0xFF6B6B
        )
        await ctx.send(embed=embed)
        return

    # Check if code is in description
    if code in description:
        # Verification successful - link the account
        try:
            users_collection = db['users']
            users_collection.update_one(
                {'username': username},
                {'$set': {'discordId': discord_id}}
            )

            # Remove from pending verifications
            del pending_verifications[discord_id]

            embed = discord.Embed(
                title="✅ Account Linked Successfully",
                description=f"Your Discord account has been linked to {username}",
                color=0x4CAF50
            )
            embed.add_field(name="Username", value=username, inline=True)
            embed.add_field(name="Discord ID", value=discord_id, inline=True)
            embed.set_footer(text="You can now earn rewards for invites!")

            await ctx.send(embed=embed)

        except Exception as e:
            embed = discord.Embed(
                title="❌ Error",
                description=f"Error linking account: {e}",
                color=0xFF6B6B
            )
            await ctx.send(embed=embed)
    else:
        embed = discord.Embed(
            title="❌ Verification Failed",
            description=f"Could not find the code '{code}' in your Roblox description",
            color=0xFF6B6B
        )
        embed.add_field(name="Your Description", value=description[:200] + "..." if len(description) > 200 else description, inline=False)
        embed.add_field(name="Expected Code", value=code, inline=True)
        embed.set_footer(text="Make sure you added the code exactly as shown and try again with !verify")

        await ctx.send(embed=embed)

@bot.command(name='status')
async def check_status(ctx):
    """Check bot status and time remaining"""
    now = datetime.now(European_TZ)
    midnight = now.replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(days=1)
    time_remaining = midnight - now

    hours = int(time_remaining.total_seconds() // 3600)
    minutes = int((time_remaining.total_seconds() % 3600) // 60)

    embed = discord.Embed(
        title="⏰ Bot Status",
        color=0x0276FF
    )
    embed.add_field(name="Time Remaining", value=f"{hours}h {minutes}m", inline=True)
    embed.add_field(name="Reward Per Invite", value=f"${REWARD_PER_INVITE}", inline=True)
    embed.add_field(name="Timezone", value="European (European)", inline=True)
    embed.set_footer(text="Invite tracking ends at midnight European time")

    await ctx.send(embed=embed)

# Run the bot
if __name__ == '__main__':
    bot.run("MTUzNDk3MDI3NzYwNjMzMDQ2OA.GPQpaW.Iup_pkga4HOpjei3OwI7Bdz25LDp_JHU4nEaRk")
