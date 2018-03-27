const bayes = require("node-bayes");

function Bolag() {
	const TRAINING_COLUMNS = ["expectation","received?"];
	this.BUFFER = [];
	this.DATA = [];

	this.start =  (interval) => {
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
					this.BUFFER.push({index: count, time : Date.now(), expectation : (Math.random() * (max - min) + min)});
				}
			} else {
				console.log("TRAINING DATA", JSON.stringify(this.DATA));
				cls = new bayes.NaiveBayes({
					columns : TRAINING_COLUMNS,
					data : this.DATA,
					verbose : true
				});

				cls.train();
				learned = true;
			}
			count++;
		}, interval);
	}
	
	this.learn = (clientCall) => {
		console.log("Buffer size", this.BUFFER.length);
		let serverPing = this.BUFFER.find((d) => d.index === clientCall.index);
		if (serverPing) {
			let reactionTime = clientCall.timeReceived - serverPing.time;
			this.DATA.push([ serverPing.expectation, reactionTime < serverPing.expectation ? "Yes" : "No"]);
		}
	}

}

module.exports = {Bolag : Bolag};

