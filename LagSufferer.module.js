function LagSufferer(socket, CONFIG) {
	if (!socket) {
		return console.error("Cannot start pinging if no socket is defined");
	}
	// test for config
	this.startPinging = () => {
		let variable = Math.random() * (CONFIG.max - CONFIG.min) + CONFIG.min;
		let count = 1;
		let sendMessage = (payload) => socket.emit("ping", payload);
		setInterval(() => {
			if (count % 20) {
				setTimeout(sendMessage.bind(null, {intention : "bolag", message : variable, index : count, time : Date.now()}), variable);
				variable = Math.random() * (CONFIG.max - CONFIG.min) + CONFIG.min;
			} 
			count++;
		}, CONFIG.interval);

		return {
			on : socket.on.bind(this, "on")
		}
	}

	socket.emit("loaded", { interval : CONFIG.interval});
}

module.exports = {LagSufferer : LagSufferer};