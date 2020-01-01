const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  const vc = client.channels.get(config.vc);
  if (vc) {
    vc.join().then(conn=>{
        console.log(`Successfully joined: ${vc.name}`);
    }).catch(err=>{
        console.log(`Failed to join: ${vc.name}`);
        console.error(err);
    })
  } else {
      console.log(`Voice channel not found: ${config.vc}`);
  }
});

client.on('message', msg => {
  if (msg.isMentioned(client.user)) {
    msg.react('🤖');
  }
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
    if (newMember.voiceChannelID == config.vc && newMember.voiceChannel != oldMember.voiceChannel) {
        console.log(`${newMember.nickname} joined the voice channel`);
    }
});

client.login(config.token).catch(err=>{console.log(err)});