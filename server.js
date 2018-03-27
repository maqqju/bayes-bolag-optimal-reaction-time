const app = require('express')();
const http = require('http').Server(app);
const io = require("socket.io")(http);
const Bolag = require("./BolagLearning.module");
const LagSufferer = require("./LagSufferer.module");

let PORT = 3000;

app.get("/", (req,res) => {
	res.sendFile(__dirname+"/index.html");
});

app.get("/client-challenge", (req,res) => {
	res.sendFile(__dirname+"/client-challenge.html");
});

app.get("/bolag.min", (req,res) => {
	res.sendFile(__dirname+"/bolag.min.js");
});

io.on('connection', (socket) => {

	socket.on("loaded", (payload) => {
		let bolag = new Bolag.Bolag();
		bolag.start();
	});

	socket.on("ping", (payload) => {
		if (payload.intention === "bolag") {
			console.log(`CLIENT : Now ${payload.index}`);
			bolag.learn({index : payload.index, timeSent : payload.time, timeReceived : Date.now()});
		}
	});

	socket.on("challenger-loaded", (payload) => {
		const INTERVAL = 2000;
		const LAG_TIME = 500;
		const max = LAG_TIME * 1.5;
		const min = LAG_TIME * 0;
		
		let lagSufferer = new LagSufferer(socket, {
				interval : INTERVAL,
				max : max,
				min : min
			});	

		lagSufferer.startPinging();
	});

})

http.listen(PORT, function(){
  console.log(`listening on *:${PORT}`);
});