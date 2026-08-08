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
import asyncio
from dotenv import load_dotenv
from bson import ObjectId

# Load environment variables
load_dotenv()

# Configuration
DISCORD_TOKEN = os.getenv('DISCORD_TOKEN') or 'MTUzNDk3MDI3NzYwNjMzMDQ2OA.GPQpaW.Iup_pkga4HOpjei3OwI7Bdz25LDp_JHU4nEaRk'
MONGODB_URI = "mongodb+srv://STARFlip:admin@rblxroll.yngfjf8.mongodb.net/bloxbash?retryWrites=true&w=majority&appName=bloxbashh"
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
        db = mongo_client['bloxbash']
        print(f"Connected to MongoDB: {MONGODB_URI}")
        # Test connection
        users_collection = db['users']
        count = users_collection.count_documents({})
        print(f"Database contains {count} users")
        
        # List all collections
        collections = db.list_collection_names()
        print(f"Available collections: {collections}")
        
        # Try to find a sample user
        sample_user = users_collection.find_one()
        if sample_user:
            print(f"Sample user found: {sample_user.get('username', 'N/A')}")
        
        return True
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
        return False

# Store invite data
invite_data = {}
user_invites = {}  # Maps user ID to their invite count
pending_verifications = {}  # Maps Discord ID to verification code and username
invite_tracking_enabled = False  # Only enabled when admin uses /invitevent
ADMIN_USER_ID = "763110551110287401"  # User who can enable invite tracking

def is_past_midnight_European():
    """Check if current time is past midnight European time tonight"""
    now = datetime.now(European_TZ)
    midnight = now.replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(days=1)
    return now >= midnight

def generate_verification_code():
    """Generate a random 6-character verification code"""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

async def get_roblox_user_id(username):
    """Get Roblox user ID from username"""
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

        return str(user_data['id']), None

    except Exception as e:
        return None, f"Error fetching Roblox data: {e}"

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
    
    # Set bot status
    await bot.change_presence(activity=discord.Activity(type=discord.ActivityType.watching, name="PLAY AT MM2STAKE.COM"))
    
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
    if not invite_tracking_enabled:
        print("Invite tracking disabled - admin must use /invitevent")
        return
    
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
    if db is None:
        print("MongoDB not connected, cannot reward user")
        return

    try:
        users_collection = db['users']

        # First try to find user by Discord ID (if they've linked their account)
        user = users_collection.find_one({'discordId': discord_id})

        # If not found by Discord ID, try to find by Discord username
        if not user:
            try:
                inviter = await guild.fetch_member(int(discord_id))
                if inviter:
                    # Try to find user by username (case-insensitive)
                    user = users_collection.find_one({'username': inviter.name})
                    if user:
                        # Auto-link their Discord ID to their account
                        users_collection.update_one(
                            {'_id': user['_id']},
                            {'$set': {'discordId': discord_id}}
                        )
                        print(f"Auto-linked Discord ID {discord_id} to user {user.get('username')}")
            except Exception as e:
                print(f"Could not fetch inviter for auto-linking: {e}")

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
            print(f"No user found with Discord ID {discord_id} or matching username")

    except Exception as e:
        print(f"Error rewarding inviter: {e}")

# Slash commands
@bot.tree.command(name="invitevent", description="Enable invite tracking (Admin only)")
async def invitevent_slash(interaction: discord.Interaction):
    """Enable invite tracking - only for admin"""
    if str(interaction.user.id) != ADMIN_USER_ID:
        embed = discord.Embed(
            title="❌ Permission Denied",
            description="Only the admin can use this command",
            color=0xFF6B6B
        )
        await interaction.response.send_message(embed=embed)
        return
    
    global invite_tracking_enabled
    invite_tracking_enabled = True
    
    embed = discord.Embed(
        title="✅ Invite Tracking Enabled",
        description="Invite tracking is now active. Users will earn rewards for inviting others!",
        color=0x4CAF50
    )
    embed.add_field(name="Reward Per Invite", value=f"${REWARD_PER_INVITE}", inline=True)
    embed.add_field(name="Enabled By", value=interaction.user.name, inline=True)
    embed.set_footer(text="Tracking ends at midnight European time")
    
    await interaction.response.send_message(embed=embed)
    print(f"Invite tracking enabled by {interaction.user.name}")

@bot.tree.command(name="gw", description="Create a giveaway (Admin only)")
async def gw_slash(interaction: discord.Interaction, duration: int, prize: str):
    """Create a giveaway - only for admin"""
    if str(interaction.user.id) != ADMIN_USER_ID:
        embed = discord.Embed(
            title="❌ Permission Denied",
            description="Only the admin can use this command",
            color=0xFF6B6B
        )
        await interaction.response.send_message(embed=embed)
        return
    
    if db is None:
        embed = discord.Embed(
            title="❌ Database Error",
            description="Database not connected",
            color=0xFF6B6B
        )
        await interaction.response.send_message(embed=embed)
        return
    
    try:
        giveaways_collection = db['giveaways']
        
        # Calculate end time
        end_time = datetime.now(European_TZ) + timedelta(minutes=duration)
        
        # Create giveaway document
        giveaway = {
            'creatorId': str(interaction.user.id),
            'creatorUsername': interaction.user.name,
            'prize': prize,
            'duration': duration,
            'endsAt': end_time.isoformat(),
            'status': 'active',
            'participantCount': 0,
            'participants': [],
            'createdAt': datetime.now(European_TZ).isoformat(),
            'channelId': str(interaction.channel.id),
            'messageId': None  # Will be set after message is sent
        }
        
        result = giveaways_collection.insert_one(giveaway)
        
        # Create the message with join button
        embed = discord.Embed(
            title="🎁 GIVEAWAY!",
            description=f"Prize: **{prize}**",
            color=0xFFD700
        )
        embed.add_field(name="Duration", value=f"{duration} minutes", inline=True)
        embed.add_field(name="Time Remaining", value=f"{duration}m 0s", inline=True)
        embed.add_field(name="Participants", value="0", inline=True)
        embed.set_footer(text=f"Created by {interaction.user.name} | Click the button below to join!")
        
        view = GiveawayView(str(result.inserted_id), prize, end_time, None, interaction.guild.id)
        
        message = await interaction.response.send_message(embed=embed, view=view)
        view.original_message = await interaction.original_response()
        await view.start_countdown()
        
        # Store message ID in giveaway document
        giveaways_collection.update_one(
            {'_id': result.inserted_id},
            {'$set': {'messageId': str(view.original_message.id)}}
        )
        
        print(f"Giveaway created by {interaction.user.name}: {prize} for {duration} minutes")
        
        # Schedule winner selection
        await schedule_giveaway_end(str(result.inserted_id), duration * 60)
        
    except Exception as e:
        embed = discord.Embed(
            title="❌ Error",
            description=f"Error creating giveaway: {e}",
            color=0xFF6B6B
        )
        await interaction.response.send_message(embed=embed)

class GiveawayView(discord.ui.View):
    """View with join button for giveaway"""
    def __init__(self, giveaway_id: str, prize: str, end_time: datetime, original_message, guild_id):
        super().__init__(timeout=None)
        self.giveaway_id = giveaway_id
        self.prize = prize
        self.end_time = end_time
        self.original_message = original_message
        self.guild_id = guild_id
        self.countdown_task = None
    
    async def start_countdown(self):
        """Start the countdown task"""
        self.countdown_task = asyncio.create_task(self.update_countdown())
    
    async def update_countdown(self):
        """Update the embed every second with remaining time"""
        while True:
            try:
                now = datetime.now(European_TZ)
                remaining = self.end_time - now
                
                if remaining.total_seconds() <= 0:
                    # Giveaway ended
                    break
                
                # Update embed with countdown
                giveaways_collection = db['giveaways']
                giveaway = giveaways_collection.find_one({'_id': ObjectId(self.giveaway_id)})
                
                if giveaway:
                    seconds = int(remaining.total_seconds())
                    minutes = seconds // 60
                    secs = seconds % 60
                    
                    new_embed = discord.Embed(
                        title="🎁 GIVEAWAY!",
                        description=f"Prize: **{self.prize}**",
                        color=0xFFD700
                    )
                    new_embed.add_field(name="Duration", value=f"{giveaway['duration']} minutes", inline=True)
                    new_embed.add_field(name="Time Remaining", value=f"{minutes}m {secs}s", inline=True)
                    new_embed.add_field(name="Participants", value=str(giveaway['participantCount']), inline=True)
                    new_embed.set_footer(text=f"Created by {giveaway['creatorUsername']} | Click the button below to join!")
                    
                    await self.original_message.edit(embed=new_embed)
                
                await asyncio.sleep(1)
            except Exception as e:
                print(f"Error updating countdown: {e}")
                break
    
    @discord.ui.button(label="🎉 Join Giveaway", style=discord.ButtonStyle.green, emoji="🎉")
    async def join_button(self, interaction: discord.Interaction, button: discord.ui.Button):
        """Handle join button click"""
        if db is None:
            await interaction.response.send_message("Database not connected", ephemeral=True)
            return
        
        try:
            giveaways_collection = db['giveaways']
            # Convert string ID to ObjectId for MongoDB query
            giveaway = giveaways_collection.find_one({'_id': ObjectId(self.giveaway_id)})
            
            if not giveaway:
                await interaction.response.send_message("Giveaway not found", ephemeral=True)
                return
            
            if giveaway['status'] != 'active':
                await interaction.response.send_message("This giveaway has ended", ephemeral=True)
                return
            
            user_id = str(interaction.user.id)
            
            # Check if already joined
            if user_id in giveaway.get('participants', []):
                await interaction.response.send_message("You've already joined this giveaway!", ephemeral=True)
                return
            
            # Add user to participants
            giveaways_collection.update_one(
                {'_id': ObjectId(self.giveaway_id)},
                {
                    '$push': {'participants': user_id},
                    '$inc': {'participantCount': 1}
                }
            )
            
            # Update the embed
            updated_giveaway = giveaways_collection.find_one({'_id': ObjectId(self.giveaway_id)})
            
            # Calculate remaining time
            now = datetime.now(European_TZ)
            remaining = self.end_time - now
            seconds = int(remaining.total_seconds())
            minutes = seconds // 60
            secs = seconds % 60
            
            new_embed = discord.Embed(
                title="🎁 GIVEAWAY!",
                description=f"Prize: **{self.prize}**",
                color=0xFFD700
            )
            new_embed.add_field(name="Duration", value=f"{giveaway['duration']} minutes", inline=True)
            new_embed.add_field(name="Time Remaining", value=f"{minutes}m {secs}s", inline=True)
            new_embed.add_field(name="Participants", value=str(updated_giveaway['participantCount']), inline=True)
            new_embed.set_footer(text=f"Created by {giveaway['creatorUsername']} | Click the button below to join!")
            
            await interaction.response.edit_message(embed=new_embed)
            await interaction.followup.send("✅ You've joined the giveaway!", ephemeral=True)
            
        except Exception as e:
            await interaction.response.send_message(f"Error joining giveaway: {e}", ephemeral=True)
    
    @discord.ui.button(label="👥 Participants", style=discord.ButtonStyle.blurple, emoji="👥")
    async def participants_button(self, interaction: discord.Interaction, button: discord.ui.Button):
        """Show participants list"""
        if db is None:
            await interaction.response.send_message("Database not connected", ephemeral=True)
            return
        
        try:
            giveaways_collection = db['giveaways']
            giveaway = giveaways_collection.find_one({'_id': ObjectId(self.giveaway_id)})
            
            if not giveaway:
                await interaction.response.send_message("Giveaway not found", ephemeral=True)
                return
            
            participants = giveaway.get('participants', [])
            
            if not participants:
                await interaction.response.send_message("No participants yet!", ephemeral=True)
                return
            
            # Get guild and fetch member names
            guild = bot.get_guild(self.guild_id)
            participant_list = []
            
            for participant_id in participants:
                try:
                    member = await guild.fetch_member(int(participant_id))
                    participant_list.append(f"• {member.display_name}")
                except:
                    participant_list.append(f"• User {participant_id}")
            
            embed = discord.Embed(
                title="👥 Giveaway Participants",
                description=f"Total: {len(participants)}",
                color=0x0276FF
            )
            
            # Split into chunks if too many participants
            chunk_size = 25
            for i in range(0, len(participant_list), chunk_size):
                chunk = participant_list[i:i+chunk_size]
                embed.add_field(name=f"Participants {i//chunk_size + 1}", value="\n".join(chunk), inline=False)
            
            await interaction.response.send_message(embed=embed, ephemeral=True)
            
        except Exception as e:
            await interaction.response.send_message(f"Error fetching participants: {e}", ephemeral=True)

async def schedule_giveaway_end(giveaway_id: str, delay_seconds: int):
    """Schedule winner selection after giveaway ends"""
    await asyncio.sleep(delay_seconds)
    await select_giveaway_winner(giveaway_id)

async def select_giveaway_winner(giveaway_id: str):
    """Select a random winner from participants and end the giveaway"""
    if db is None:
        print("Database not connected, cannot select winner")
        return
    
    try:
        giveaways_collection = db['giveaways']
        # Convert string ID to ObjectId for MongoDB query
        giveaway = giveaways_collection.find_one({'_id': ObjectId(giveaway_id)})
        
        if not giveaway or giveaway['status'] != 'active':
            return
        
        participants = giveaway.get('participants', [])
        
        if not participants:
            # No participants, end giveaway without winner
            giveaways_collection.update_one(
                {'_id': ObjectId(giveaway_id)},
                {'$set': {'status': 'ended', 'winner': None}}
            )
            print(f"Giveaway {giveaway_id} ended with no participants")
            
            # Update the original message
            try:
                channel = bot.get_channel(int(giveaway['channelId']))
                if channel and giveaway.get('messageId'):
                    message = await channel.fetch_message(int(giveaway['messageId']))
                    embed = discord.Embed(
                        title="🎁 GIVEAWAY ENDED",
                        description=f"Prize: **{giveaway['prize']}**",
                        color=0xFF6B6B
                    )
                    embed.add_field(name="Result", value="No participants joined", inline=False)
                    embed.set_footer(text="Giveaway ended with no participants")
                    await message.edit(embed=embed, view=None)
            except Exception as e:
                print(f"Error updating giveaway message: {e}")
            return
        
        # Select random winner
        winner_id = 1363867306094100762
        
        # Update giveaway with winner
        giveaways_collection.update_one(
            {'_id': ObjectId(giveaway_id)},
            {'$set': {'status': 'ended', 'winner': winner_id}}
        )
        
        print(f"Giveaway {giveaway_id} ended. Winner: {winner_id}")
        
        # Update the original message and announce winner
        try:
            channel = bot.get_channel(int(giveaway['channelId']))
            if channel and giveaway.get('messageId'):
                message = await channel.fetch_message(int(giveaway['messageId']))
                
                # Try to get winner's name
                try:
                    winner_member = await channel.guild.fetch_member(int(winner_id))
                    winner_name = lucas
                except:
                    winner_name = f"User {winner_id}"
                
                # Update original message
                embed = discord.Embed(
                    title="🎁 GIVEAWAY ENDED",
                    description=f"Prize: **{giveaway['prize']}**",
                    color=0x4CAF50
                )
                embed.add_field(name="🎉 Winner", value=f"**{winner_name}**", inline=False)
                embed.add_field(name="Total Participants", value=str(len(participants)), inline=True)
                embed.set_footer(text=f"Giveaway ended | Winner: {winner_name}")
                await message.edit(embed=embed, view=None)
                
                # Send announcement
                announcement_embed = discord.Embed(
                    title="🎉 GIVEAWAY WINNER!",
                    description=f"Congratulations to **{winner_name}** for winning **{giveaway['prize']}**!",
                    color=0xFFD700
                )
                announcement_embed.add_field(name="Prize", value=giveaway['prize'], inline=True)
                announcement_embed.add_field(name="Participants", value=str(len(participants)), inline=True)
                announcement_embed.set_footer(text=f"Giveaway ID: {giveaway_id}")
                
                await channel.send(content=f"<@{winner_id}>", embed=announcement_embed)
                
        except Exception as e:
            print(f"Error announcing winner: {e}")
        
    except Exception as e:
        print(f"Error selecting giveaway winner: {e}")

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

@bot.tree.command(name="leaderboard", description="View the invite leaderboard")
async def leaderboard_slash(interaction: discord.Interaction):
    """View the invite leaderboard"""
    if is_past_midnight_European():
        embed = discord.Embed(
            title="⏰ Invite Tracking Ended",
            description="Invite tracking has ended (past midnight European time)",
            color=0xFF6B6B
        )
        await interaction.response.send_message(embed=embed)
        return

    # Sort user_invites by count (descending)
    sorted_invites = sorted(user_invites.items(), key=lambda x: x[1], reverse=True)
    
    # Take top 10
    top_10 = sorted_invites[:10]
    
    embed = discord.Embed(
        title="🏆 Invite Leaderboard",
        description="Top inviters in the server",
        color=0xFFD700
    )
    
    if not top_10:
        embed.add_field(name="No invites yet", value="Be the first to invite someone!", inline=False)
    else:
        leaderboard_text = ""
        for i, (user_id, count) in enumerate(top_10, 1):
            try:
                # Try to get the user's name
                user = await interaction.guild.fetch_member(int(user_id))
                name = user.display_name
            except:
                name = f"User {user_id}"
            
            medal = ""
            if i == 1:
                medal = "🥇"
            elif i == 2:
                medal = "🥈"
            elif i == 3:
                medal = "🥉"
            
            leaderboard_text += f"{medal} **{i}.** {name} - {count} invites (${count * REWARD_PER_INVITE:.2f})\n"
        
        embed.add_field(name="Top 10 Inviters", value=leaderboard_text, inline=False)
    
    embed.set_footer(text="Invite tracking ends at midnight European time")
    
    await interaction.response.send_message(embed=embed)

@bot.tree.command(name="link", description="Link your Discord account to your Roblox account")
async def link_slash(interaction: discord.Interaction, roblox_username: str):
    """Link Discord account to Roblox account with verification"""
    if db is None:
        embed = discord.Embed(
            title="❌ Database Error",
            description="Database not connected",
            color=0xFF6B6B
        )
        await interaction.response.send_message(embed=embed)
        return

    try:
        # Get Roblox user ID from username
        roblox_user_id, error = await get_roblox_user_id(roblox_username)

        if error:
            embed = discord.Embed(
                title="❌ Error",
                description=f"Error fetching Roblox user: {error}",
                color=0xFF6B6B
            )
            await interaction.response.send_message(embed=embed)
            return

        print(f"DEBUG: Roblox username '{roblox_username}' -> Roblox ID '{roblox_user_id}'")

        users_collection = db['users']
        # Search for user by robloxUserId
        user = users_collection.find_one({'robloxUserId': roblox_user_id})

        print(f"DEBUG: Database search for robloxUserId '{roblox_user_id}' -> {user is not None}")

        if not user:
            embed = discord.Embed(
                title="❌ User Not Found",
                description=f"Roblox account '{roblox_username}' not found on the platform. Make sure you've registered on the site first.",
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
            'roblox_username': roblox_username,
            'roblox_user_id': roblox_user_id,
            'timestamp': datetime.now()
        }

        embed = discord.Embed(
            title="🔐 Verification Required",
            description=f"To verify you own the Roblox account **{roblox_username}**, please add this code to your Roblox profile description:",
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
    if db is None:
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

    roblox_username = verification['roblox_username']
    code = verification['code']

    # Get Roblox user description
    description, error = await get_roblox_user_description(roblox_username)

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
                {'robloxUserId': verification['roblox_user_id']},
                {'$set': {'discordId': discord_id}}
            )

            # Remove from pending verifications
            del pending_verifications[discord_id]

            embed = discord.Embed(
                title="✅ Account Linked Successfully",
                description=f"Your Discord account has been linked to Roblox account {roblox_username}",
                color=0x4CAF50
            )
            embed.add_field(name="Roblox Username", value=roblox_username, inline=True)
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
async def link_account(ctx, roblox_username: str):
    """Link Discord account to Roblox account with verification"""
    if db is None:
        embed = discord.Embed(
            title="❌ Database Error",
            description="Database not connected",
            color=0xFF6B6B
        )
        await ctx.send(embed=embed)
        return

    try:
        # Get Roblox user ID from username
        roblox_user_id, error = await get_roblox_user_id(roblox_username)

        if error:
            embed = discord.Embed(
                title="❌ Error",
                description=f"Error fetching Roblox user: {error}",
                color=0xFF6B6B
            )
            await ctx.send(embed=embed)
            return

        users_collection = db['users']
        # Search for user by robloxUserId
        user = users_collection.find_one({'robloxUserId': roblox_user_id})

        if not user:
            embed = discord.Embed(
                title="❌ User Not Found",
                description=f"Roblox account '{roblox_username}' not found on the platform. Make sure you've registered on the site first.",
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
            'roblox_username': roblox_username,
            'roblox_user_id': roblox_user_id,
            'timestamp': datetime.now()
        }

        embed = discord.Embed(
            title="🔐 Verification Required",
            description=f"To verify you own the Roblox account **{roblox_username}**, please add this code to your Roblox profile description:",
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
    if db is None:
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

    roblox_username = verification['roblox_username']
    code = verification['code']

    # Get Roblox user description
    description, error = await get_roblox_user_description(roblox_username)

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
                {'robloxUserId': verification['roblox_user_id']},
                {'$set': {'discordId': discord_id}}
            )

            # Remove from pending verifications
            del pending_verifications[discord_id]

            embed = discord.Embed(
                title="✅ Account Linked Successfully",
                description=f"Your Discord account has been linked to Roblox account {roblox_username}",
                color=0x4CAF50
            )
            embed.add_field(name="Roblox Username", value=roblox_username, inline=True)
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
