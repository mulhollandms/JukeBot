const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  const vc = client.channels.get(config.vc);
  if (vc) {
    vc.join().then(conn=>{
        console.log(`Successfully joined: ${vc.name}`);
        client.user.setActivity('Laying down some beats 🎶');
        conn.on('error', (err) => {
            console.error(err);
        });
        conn.on('speaking',(user, speaking)=>{
            // ToDo
        });
        dispatcher = conn.playArbitraryInput('http://74.82.59.197:8440');
    }).catch(err=>{
        console.log(`Failed to join: ${vc.name}`);
        console.error(err);
    })
  } else {
      console.log(`Voice channel not found: ${config.vc}`);
  }
});

function handleCommand(msg) {
    tokens = msg.split(' ');
    switch(tokens[0]){
        case 'play':
            client.channels.get(config.tc).send(`Not supported yet! 🛠️`);
            break;
        default:
            client.channels.get(config.tc).send(`Unsupported operation: ${tokens[0]}`);
    }
}

client.on('message', msg => {
    if (msg.content.charAt(0) == config.prefix) {
        console.log(msg.toString());
        msg.react('🤖');

        handleCommand(msg.content.substring(1));
    }
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
    if (newMember.voiceChannelID == config.vc && newMember.voiceChannel != oldMember.voiceChannel) {
        console.log(`${newMember.nickname} joined the voice channel`);
    }
});

client.login(config.token).catch(err=>{console.log(err)});