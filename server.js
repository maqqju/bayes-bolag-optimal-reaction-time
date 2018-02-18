const app = require('express')();
const http = require('http').Server(app);
const io = require("socket.io")(http);
const bayes = require("node-bayes");

let PORT = 3000;

const TRAINING_COLUMNS = ["server_time","jump","reactionTime?"];

const BUFFER = [];

const DATA = [];

app.get("/", (req,res) => {
	res.sendFile(__dirname+"/index.html");
})

function start(interval) {
	let count = 0;
	let learned = false;
	let cls;

	const LAG_TIME = 300;
	const max = LAG_TIME * 1.5;
	const min = LAG_TIME * 0;

	setInterval(() => {
		// we will gather a data set
		// to learn the trends
		if (count < 20) {
			console.log(`SERVER : Now ${count}`);
			BUFFER.push({index: count, time : Date.now(), success : (Math.random() * (max - min) + min)});
			count++;
		} else {

			if (!learned) {
				console.log("TRAINING DATA", JSON.stringify(DATA));
				cls = new bayes.NaiveBayes({
					columns : TRAINING_COLUMNS,
					data : DATA,
					verbose : true
				});

				cls.train();
				learned = true;
			} else {
				console.log(cls.predict([(Math.random() * (max - min) + min), "Yes"]));
			}
		} 
	}, interval);
}

function learn(reaction) {
	let serverPing = BUFFER.find((d) => d.index === reaction.index);
	let reactionTime = reaction.time - serverPing.time;
	serverPing && DATA.push([ serverPing.success, reactionTime < serverPing.success ? "Yes" : "No", reactionTime]);
}

io.on('connection', (socket) => {

	socket.on("loaded", (payload) => {
		start(payload.interval);
	})

	socket.on("clicked", (payload) => {
		console.log(`CLIENT : Now ${payload.index}`);
		learn({index : payload.index, time : Date.now()});
	});
})

http.listen(PORT, function(){
  console.log(`listening on *:${PORT}`);
});