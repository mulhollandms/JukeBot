/*
A basic music bot script using discord.js. For now it just plays polka music
in the voice channel defined in config.json.

ToDo List:
- 
- 
- integrate with <some service> to respond to voice commands (???)
*/

const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

player = null;
voiceConnection = null;
textChannel = null;
queue = [];
autoPlaylist = [];
autoPlaylistIndex = 0;
shuffle = false;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  const vc = client.channels.get(config.vc);
  textChannel = client.channels.get(config.tc);
  if (vc) {
    vc.join().then(conn=>{
        voiceConnection = conn;
        console.log(`Successfully joined: ${vc.name}`);
        client.user.setActivity('Laying down some beats 🎶');
        conn.on('error', (err) => {
            console.error(err);
        });
        conn.on('speaking',(user, speaking)=>{
            // ToDo
        });
        if (autoPlaylist.length) {
            if (shuffle) {
                // ToDo
            }
        } else {
            player = conn.playArbitraryInput('http://70.38.12.44:8144/');
            player.on('end', reason => {
                // ToDo
            });
        }
    }).catch(err=>{
        console.log(`Failed to join: ${vc.name}`);
        console.error(err);
    })
  } else {
      console.log(`Voice channel not found: ${config.vc}`);
  }
});

function handleCommand(msg) {
    tokens = msg.content.substring(1).split(' ');
    if (msg.member.id == config.owner || msg.member.roles.has(config.master)) {
        switch(tokens[0]){
            case 'play':
                client.channels.get(config.tc).send(`Not supported yet! 🛠️`);
                break;
            case 'pause':
                if (player) {
                    if (player.paused) {
                        msg.reply('Player is already paused...').then(sent=>{sent.delete(3000);}).catch(console.error);
                    } else {
                        msg.reply('Pausing...').then(sent=>{sent.delete(5000);}).catch(console.error);
                        player.pause();
                    }
                }
                break;
            case 'resume':
                if (player) {
                    if (player.paused) {
                        msg.reply('Resuming...').then(sent=>{sent.delete(5000);}).catch(console.error);
                        player.resume();
                    } else {
                        msg.reply('Player is not paused...').then(sent=>{sent.delete(3000);}).catch(console.error);
                    }
                }
                break;
            case 'clean':
                break;
            default:
                msg.reply(`Unsupported command: ${tokens[0]}`).then(sent=>{sent.delete(5000);}).catch(console.error);
        }
    } else {
        msg.reply('You do not currently have permission to use bot commands 🖕🤖🖕')
            .then(sent=>{sent.delete(8000);}).catch(console.error);
    }
    msg.delete(30000).catch(console.error);
}

client.on('message', msg => {
    if (!textChannel) return;
    if (msg.channel.id != textChannel.id) return;
    if (msg.content.charAt(0) == config.prefix) {
        console.log(`${msg.member.nickname}: ${msg.toString()}`);
        msg.react('🤖');

        handleCommand(msg);
    }
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
    if (newMember.voiceChannelID == config.vc && newMember.voiceChannel != oldMember.voiceChannel) {
        console.log(`${newMember.nickname} joined the voice channel`);
    }
});

client.login(config.token).catch(console.error);