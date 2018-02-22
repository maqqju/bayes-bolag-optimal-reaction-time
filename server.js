const app = require('express')();
const http = require('http').Server(app);
const io = require("socket.io")(http);
const BolagLearning = require("./BolagLearning.module");

let PORT = 3000;


app.get("/", (req,res) => {
	res.sendFile(__dirname+"/index.html");
});

app.get("/client-challenge", (req,res) => {
	res.sendFile(__dirname+"/client-challenge.html");
});

app.get("/learning-script", (req,res) => {
	res.sendFile(__dirname+"/learning.min.js");
});


io.on('connection', (socket) => {

	socket.on("loaded", (payload) => {
		start(payload.interval);
	})

	socket.on("ping", (payload) => {
		console.log(`CLIENT : Now ${payload.index}`);
		learn({index : payload.index, timeSent : payload.time, timeReceived : Date.now()});
	});
})

http.listen(PORT, function(){
  console.log(`listening on *:${PORT}`);
});