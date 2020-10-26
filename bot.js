const Discord = require('discord.js');
const client = new Discord.Client();
const info = require('./i')
const prefix = "!";

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
    const channel = msg.channel;
    const messageManager = channel.messages;
    console.log(msg.content);
    if (msg.content.toLowerCase().startsWith(prefix + "clearchat")) {
        messageManager.fetch({ limit: 6 }).then((messages) => {
            // `messages` is a Collection of Message objects
            messages.forEach((message) => {
                message.delete();
            });
    
            channel.send("5 messages have been deleted!");
        });
    }
});

client.login(info);