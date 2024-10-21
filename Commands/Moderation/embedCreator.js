const {
	SlashCommandBuilder,
	CommandInteraction,
	Client,
	EmbedBuilder,
} = require('discord.js');

const embedModal = require('../../Models/embedModal');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('embed_creator')
		.setDescription(
			'Will Make An Embed Message Based On The Options You Provide.'
		)
		.addStringOption((json) =>
			json
				.setName('json')
				.setDescription('The Full Json Of Your Embed')
				.setRequired(true)
		)
		.addBooleanOption((bool) =>
			bool.setName('editable').setDescription('If You Can Edit This Later')
		),

	/**
	 * @param {CommandInteraction} interaction
	 * @param {Client} client
	 */

	async execute(interaction) {
		const jsonData = interaction.options.getString('json');
		const editable = interaction.options.getBoolean('bool') ?? false;

		const json = JSON.parse(jsonData);
		await interaction.deferReply({ ephemeral: false });
		try {
			interaction.editReply({ embeds: [json] });

			const interactionMessage = await interaction.fetchReply();

			if (editable === false) return;
			await new embedModal({
				embedId: interactionMessage.id,
			}).save();
		} catch (err) {
			interaction.editReply({ content: `Invalid Json \n${err}` });
		}
	},
};
