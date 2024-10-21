const { Client, Events } = require('discord.js');
const mongoose = require('mongoose');
const config = require('../../config.json');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		await mongoose.connect(config.mongodb || '', { keepAlive: true });

		if (mongoose.connect) {
			console.log('Connected To Database✅');
		}
		console.log(`${client.user.username} Is Now Online✅`);
	},
};
