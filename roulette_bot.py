import discord
from discord import app_commands
from discord.ext import commands
import random
import asyncio
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
DISCORD_TOKEN = "MTUzNTAzNzkxOTMzNTU1NTIyMw.GFfOUD._PUu765s2thAVudTwPlhthJsMV4HbPkoOPnehs"
AUTHORIZED_USER_ID = 763110551110287401

# Intents
intents = discord.Intents.default()
intents.members = True
intents.voice_states = True

bot = commands.Bot(command_prefix='!', intents=intents)

# Helper function to check if user is authorized
def is_authorized(user_id: int) -> bool:
    return user_id == AUTHORIZED_USER_ID

# Roulette game state
roulette_state = {
    'active': False,
    'voice_channel': None,
    'voice_client': None,
    'participants': [],
    'eliminated': [],
    'winner': None
}

@bot.event
async def on_ready():
    print(f'{bot.user.name} has connected to Discord!')
    
    # Sync slash commands
    try:
        await bot.tree.sync()
        print("Slash commands synced")
    except Exception as e:
        print(f"Error syncing commands: {e}")

@bot.tree.command(name="roulette-prepare", description="Join the voice channel for roulette")
async def roulette_prepare_slash(interaction: discord.Interaction):
    """Join the voice channel for roulette"""
    if not is_authorized(interaction.user.id):
        embed = discord.Embed(
            title="❌ Unauthorized",
            description="You are not authorized to use this command",
            color=0xFF6B6B
        )
        await interaction.response.send_message(embed=embed)
        return

    if roulette_state['active']:
        embed = discord.Embed(
            title="❌ Roulette Already Active",
            description="A roulette game is already in progress",
            color=0xFF6B6B
        )
        await interaction.response.send_message(embed=embed)
        return

    if not interaction.user.voice or not interaction.user.voice.channel:
        embed = discord.Embed(
            title="❌ Not in Voice Channel",
            description="You must be in a voice channel to use this command",
            color=0xFF6B6B
        )
        await interaction.response.send_message(embed=embed)
        return

    voice_channel = interaction.user.voice.channel

    # Join the voice channel
    try:
        voice_client = await voice_channel.connect()
        roulette_state['active'] = True
        roulette_state['voice_channel'] = voice_channel
        roulette_state['voice_client'] = voice_client
        roulette_state['participants'] = [member for member in voice_channel.members if not member.bot]
        roulette_state['eliminated'] = []
        roulette_state['winner'] = None

        embed = discord.Embed(
            title="🎰 Roulette Prepared",
            description=f"Joined voice channel: {voice_channel.name}\nParticipants: {len(roulette_state['participants'])}",
            color=0x4CAF50
        )
        embed.add_field(name="Participants", value=str(len(roulette_state['participants'])), inline=True)
        embed.add_field(name="Voice Channel", value=voice_channel.name, inline=True)
        embed.set_footer(text="Use /roulette-start to begin the elimination")

        await interaction.response.send_message(embed=embed)
    except Exception as e:
        embed = discord.Embed(
            title="❌ Error",
            description=f"Failed to join voice channel: {e}",
            color=0xFF6B6B
        )
        await interaction.response.send_message(embed=embed)

@bot.tree.command(name="roulette-start", description="Start the roulette elimination process")
async def roulette_start_slash(interaction: discord.Interaction):
    """Start the roulette elimination process"""
    if not is_authorized(interaction.user.id):
        embed = discord.Embed(
            title="❌ Unauthorized",
            description="You are not authorized to use this command",
            color=0xFF6B6B
        )
        await interaction.response.send_message(embed=embed)
        return

    if not roulette_state['active']:
        embed = discord.Embed(
            title="❌ Roulette Not Prepared",
            description="Use /roulette-prepare first to join the voice channel",
            color=0xFF6B6B
        )
        await interaction.response.send_message(embed=embed)
        return

    if len(roulette_state['participants']) < 2:
        embed = discord.Embed(
            title="❌ Not Enough Participants",
            description="Need at least 2 participants to start roulette",
            color=0xFF6B6B
        )
        await interaction.response.send_message(embed=embed)
        return

    await interaction.response.send_message("💀 **Elimination**\nStarting roulette with " + ", ".join([f"<@{member.id}>" for member in roulette_state['participants']]))

    # Start elimination process
    await run_roulette(interaction.channel)

async def run_roulette(channel):
    """Run the roulette elimination process"""
    participants = roulette_state['participants'].copy()
    eliminated_count = 0
    total_participants = len(participants)

    while len(participants) > 1:
        # Randomly select a participant to eliminate
        eliminated = random.choice(participants)
        participants.remove(eliminated)
        roulette_state['eliminated'].append(eliminated)
        eliminated_count += 1

        # Determine the standing (ordinal) - last to first
        remaining = len(participants)
        standing = total_participants - eliminated_count + 1

        # Format ordinal number
        if 11 <= standing % 100 <= 13:
            ordinal = f"{standing}th"
        else:
            suffixes = {1: 'st', 2: 'nd', 3: 'rd'}
            ordinal = f"{standing}{suffixes.get(standing % 10, 'th')}"

        # Send elimination message
        embed = discord.Embed(
            title="💀 Elimination",
            description=f"❌ <@{eliminated.id}> has been eliminated!",
            color=0xFF6B6B
        )
        embed.add_field(name="🏆 Standing", value=f"{ordinal} place", inline=True)
        embed.add_field(name="RBXChance", value=f"{remaining} players remaining", inline=True)

        await channel.send(embed=embed)

        # Kick the eliminated user from voice channel
        try:
            await eliminated.move_to(None)
        except Exception as e:
            print(f"Failed to kick {eliminated.name}: {e}")

        # Wait a bit between eliminations
        await asyncio.sleep(2)

    # Winner announcement
    if participants:
        winner = participants[0]
        roulette_state['winner'] = winner

        embed = discord.Embed(
            title="🏆 Roulette Winner",
            description=f"🎉 <@{winner.id}> has won the roulette!",
            color=0xFFD700
        )
        embed.add_field(name="Final Standing", value="1st place", inline=True)
        embed.add_field(name="Total Eliminated", value=str(eliminated_count), inline=True)

        await channel.send(embed=embed)

    # Reset roulette state
    roulette_state['active'] = False
    roulette_state['voice_channel'] = None
    roulette_state['participants'] = []
    roulette_state['eliminated'] = []
    roulette_state['winner'] = None

    # Disconnect from voice channel
    if roulette_state.get('voice_client'):
        await roulette_state['voice_client'].disconnect()
        roulette_state['voice_client'] = None

@bot.tree.command(name="roulette-stop", description="Stop the current roulette game")
async def roulette_stop_slash(interaction: discord.Interaction):
    """Stop the current roulette game"""
    if not is_authorized(interaction.user.id):
        embed = discord.Embed(
            title="❌ Unauthorized",
            description="You are not authorized to use this command",
            color=0xFF6B6B
        )
        await interaction.response.send_message(embed=embed)
        return

    if not roulette_state['active']:
        embed = discord.Embed(
            title="❌ No Active Roulette",
            description="No roulette game is currently running",
            color=0xFF6B6B
        )
        await interaction.response.send_message(embed=embed)
        return

    # Reset roulette state
    roulette_state['active'] = False
    roulette_state['voice_channel'] = None
    roulette_state['participants'] = []
    roulette_state['eliminated'] = []
    roulette_state['winner'] = None

    # Disconnect from voice channel
    if roulette_state.get('voice_client'):
        await roulette_state['voice_client'].disconnect()
        roulette_state['voice_client'] = None

    embed = discord.Embed(
        title="🛑 Roulette Stopped",
        description="The roulette game has been stopped",
        color=0xFFA500
    )
    await interaction.response.send_message(embed=embed)

# Run the bot
if __name__ == '__main__':
    bot.run(DISCORD_TOKEN)
