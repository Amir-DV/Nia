const {
	SlashCommandBuilder,
	CommandInteraction,
	PermissionFlagsBits,
	Client,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Will Respond With Bot/Api Ping!')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	/**
	 * @param {CommandInteraction} interaction
	 * @param {Client} client
	 */

	async execute(interaction, client) {
		await interaction.reply({ content: `Hi`, ephemeral: true });
	},
};
