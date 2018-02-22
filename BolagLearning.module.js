const bayes = require("node-bayes");

const TRAINING_COLUMNS = ["expectation","received?"];

const BUFFER = [];

const DATA = [];

function start(interval) {
	let count = 1;
	let learned = false;
	let cls;

	const LAG_TIME = 300;
	const max = LAG_TIME * 1.5;
	const min = LAG_TIME * 0;

	setInterval(() => {
		if (count % 20) {
			if (learned) {
				let expectation = (Math.random() * (max - min) + min);
				let prediction = cls.predict([expectation]);
				console.log(`Would the client have responded according to the Server's expectation of ${expectation}? ${prediction.answer} (${prediction[prediction.answer]})`);
				learned = false;
			} else {
				console.log(`SERVER : Now ${count}`);
				BUFFER.push({index: count, time : Date.now(), expectation : (Math.random() * (max - min) + min)});
			}
		} else {
			console.log("TRAINING DATA", JSON.stringify(DATA));
			cls = new bayes.NaiveBayes({
				columns : TRAINING_COLUMNS,
				data : DATA,
				verbose : true
			});

			cls.train();
			learned = true;
		}
		count++;
	}, interval);
}

function learn(clientCall) {
	let serverPing = BUFFER.find((d) => d.index === clientCall.index);
	if (serverPing) {
		let reactionTime = clientCall.timeReceived - serverPing.time;
		DATA.push([ serverPing.expectation, reactionTime < serverPing.expectation ? "Yes" : "No"]);
	}
}
