const express = require("express")
const expressWs = require("express-ws")
const http = require("http")
const chess = require("chess.js")

let port = 6942;
let app = express();
let server = http.createServer(app).listen(port);    
let players = []
let colors = ["black", "white"]
var game = undefined;

expressWs(app, server);

app.ws('/', async function(ws, req) {
    players.push(ws)
    if (players.length == 2) {
        var p1 = colors[Math.floor(Math.random()*colors.length)];
        if (p1 == "white") {
            players[0].color = "white"
            players[1].color = "black"
            players[0].send("[board]black:white")
            players[1].send("[board]white:black")
        } else {
            players[1].color = "white"
            players[0].color = "black"
            players[1].send("[board]black:white")
            players[0].send("[board]white:black")
        }

        game = new chess.Chess();
    }
    ws.on('message', async function(msg) {
        if (msg.includes("[reqmove]")) {
            if (ws.color == "white") {
                var f = msg.replace("[reqmove]", "").split(":")[0]
                var t = msg.replace("[reqmove]", "").split(":")[1]
            } else {
                var f = msg.replace("[reqmove]", "").split(":")[0]
                var t = msg.replace("[reqmove]", "").split(":")[1]
                f = f[0]+(9-parseInt(f[1])).toString()
                t = t[0]+(9-parseInt(t[1])).toString()
            }

            if (game.move({
                from: f,
                to: t
            }) !== null) {
                if (players[0].color == "white") {
                    players[0].send("[move]"+f+":"+t)
                    f = f[0]+(9-parseInt(f[1])).toString()
                    t = t[0]+(9-parseInt(t[1])).toString()
                    players[1].send("[move]"+f+":"+t)
                } else {
                    players[1].send("[move]"+f+":"+t)
                    f = f[0]+(9-parseInt(f[1])).toString()
                    t = t[0]+(9-parseInt(t[1])).toString()
                    players[0].send("[move]"+f+":"+t)
                }
                if (game.isCheckmate()) {
                    ws.send("[win]")
                    players.forEach((webs) => {
                        if (webs != ws) {
                            webs.send("[lose]")
                        }
                    })
                } if (game.isDraw) {
                    players.forEach((webs) => {
                        webs.send("[draw]")
                    })
                } if (game.isStalemate) {
                    players.forEach((webs) => {
                        webs.send("[draw]")
                    })
                }
            }
        }
    });
    ws.on("close", function(err) {
        players.splice(players.indexOf(ws), 1);
        console.log("Disconnected")
    })
});