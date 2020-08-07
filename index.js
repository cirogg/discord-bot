const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const bot = new Discord.Client();

const token = 'NzIzNTM3NzIwMTk4MDM3NTA0.XuzFAw.y3685c46AUT7QWaykVDoFLSMRZI';

const PREFIX = "-"

var servers= {};

bot.on('ready', () => {
    console.log('This bot is online!');
});

bot.on('message', message=>{
    //if(msg.content === "Hello"){
    //    msg.reply('Hello friend!');
    //}
    let args = message.content.substring(PREFIX.length).split(" ");    

    switch(args[0]){
        case 'ping':
            message.channel.send('pong');
            //message.reply('pong');
            break;
        case 'info':
            if(args[1] === 'version'){
                message.channel.send('Aca iria la version probando segundo argumento');
            }else{
                message.channel.send('Error. Segundo argumento invalido');
            }
            break;
        case 'clear':
            if(!args[1]) return message.reply('Error please definí un segundo argumento');
            message.channel.bulkDelete(args[1]);
            break;
        case 'skip':
            var server = servers[message.guild.id];
            if(server.dispatcher) server.dispatcher.end();
            break;
        case 'stop':
            var server = servers[message.guild.id];
            if(message.guild.voice.connection){
                for (var i = server.queue.length -1; i >=0; i--){
                    server.queue.splice(i,1);
                }
                server.dispatcher.end();
                console.log('Stopped the queue');                
            }

            //if(message.member.connection) message.member.voice.connection.disconnect();
            if(message.guild.connection !== undefined){
                console.log('ENTRE AL IF');
                message.guild.voice.connection.disconnect();
            }else{
                console.log('ENTRE AL ELSE');
            }

            break;

        case 'reprod': 
            if(!args[1]){
                message.channel.send('Falta link bro');
                return;
            }

            //Chequeo si esta en el channel
            if(!message.member.voice.channel){
                message.channel.send('Tenes que estar en el canal de voz para usar ese comando');
                return;
            }

            if (!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            }

            var server = servers[message.guild.id];

            server.queue.push(args[1]);
            
            //Si el bot no esta en el voicechannel que se una
            //if(!message.guild.voice.connection) message.member.voice.channel.join().then(function(connection){
            if(!message.member.voice.connection) message.member.voice.channel.join().then(function(connection){
                play(connection,message);
            })

            //const url = args[1]
        break;
        case 'nashe':
            /* if(!args[1]){
                message.channel.send('Falta link bro');
                return;
            } */

            //Chequeo si esta en el channel
            if(!message.member.voice.channel){
                message.channel.send('Tenes que estar en el canal de voz para usar ese comando');
                return;
            }

            if (!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            }

            var server = servers[message.guild.id];

            server.queue.push(args[1]);
            
            //Si el bot no esta en el voicechannel que se una
            //if(!message.guild.voice.connection) message.member.voice.channel.join().then(function(connection){
            if(!message.member.voice.connection) message.member.voice.channel.join().then(function(connection){
                playUrl(connection,message);
            })
            break;
    }
        


});

bot.login(token);

function play(connection,message){
    var server = servers[message.guild.id];

    server.dispatcher = connection.play(ytdl(server.queue[0],{filter: "audioonly"}));                

    server.queue.shift();

    server.dispatcher.on("end", function(){
        if(server.queue[0]){
            play(connection,message);
        }else{
            connection.disconnect();
        }
    });
}

function playUrl(connection,message){
    var server = servers[message.guild.id];

    server.dispatcher = connection.play(ytdl('https://www.youtube.com/watch?v=GOqYM1eR6bg',{filter: "audioonly"}));                

    server.queue.shift();

    server.dispatcher.on("end", function(){
        if(server.queue[0]){
            play(connection,message);
        }else{
            connection.disconnect();
        }
    });
}