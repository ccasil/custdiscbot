const Discord = require('discord.js');
const client = new Discord.Client();
const infoModule = require('./i');
const yelp = require('yelp-fusion');
const yelpclient = yelp.client(infoModule.yelpinfo);
const prefix = "!";

let userlocation = '';

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async msg => {
    const channel = msg.channel;
    const messageManager = channel.messages;
    console.log(msg.content);
    if (msg.content.toLowerCase().startsWith(prefix + "help")) {
        // channel.send("!cleachat: deletes last 5 messages");
        // channel.send("!yelp search_term: searches yelp and displays top results");
        msg.channel.send({
            embed: {
                color: 3447003,
                title: "!help",
                fields: [{
                        name: "Command",
                        value: "!cleachat\n!yelp search_term\n!setlocation",
                        inline: true
                    },
                    {
                        name: "Description",
                        value: "deletes last 5 messages\nsearches Yelp and displays top results\nset your location for Yelp searches",
                        inline: true
                    }
                ]
            }
        });
    }
    if (msg.content.toLowerCase().startsWith(prefix + "clearchat")) {
        messageManager.fetch({
            limit: 6
        }).then((messages) => {
            // `messages` is a Collection of Message objects
            messages.forEach((message) => {
                message.delete();
            });

            channel.send("5 messages have been deleted!");
        });
    }
    if (msg.content.toLowerCase().startsWith(prefix + "setlocation")) {
        userlocation = msg.content.substr('!setlocation'.length);
        channel.send("You have set your Yelp location to: " + userlocation);
    }
    // https://www.npmjs.com/package/yelp-fusion
    if (msg.content.toLowerCase().startsWith(prefix + "yelp")) {
        const yelpsearch = msg.content.substr('!yelp'.length);
        console.log(yelpsearch)
        if (userlocation === '') {
            channel.send("use !setlocation to set your location (City, State)");
        } else {
            yelpclient.search({
                term: yelpsearch,
                location: userlocation,
            }).then(response => {
                for (let i = 0; i < 2; i++) {
                    // console.log(response.jsonBody.businesses[i].name);
                    console.log(response.jsonBody.businesses[i]);
                    // channel.send(response.jsonBody.businesses[i].name);
                    // console.log(response.jsonBody.businesses[i].image_url);
                    const business = response.jsonBody.businesses[i]
                    let address = '';
                    address += ((business.location.display_address[0]) ? business.location.display_address[0] : '');
                    address += ((business.location.display_address[1]) ? ', ' + business.location.display_address[1] : '');
                    address += ((business.location.display_address[2]) ? business.location.display_address[2] : '');
                const exampleEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(business.name)
                .setURL(business.url)
                // .setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
                // .setDescription('Some description here')
                .setThumbnail(business.image_url)
                .addFields({
                    name: (address),
                    value: business.display_phone,
                    // inline: true
                }, {
                    name: 'Reviews: ' + business.review_count,
                    value: 'Rating: ' + business.rating,
                    inline: true
                }, )
                .setImage(business.image_url)
                .setTimestamp()
                .setFooter(((business.price) ? business.price : ''), business.image_url);
    
            channel.send(exampleEmbed);
                }
            }).catch(e => {
                console.log(e);
            });
        }
    }
});

client.login(infoModule.info);