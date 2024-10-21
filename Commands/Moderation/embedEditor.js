const {
	SlashCommandBuilder,
	CommandInteraction,
	Client,
	EmbedBuilder,
} = require('discord.js');

const embedModal = require('../../Models/embedModal');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('embed_editor')
		.setDescription(
			'Will Edit An Embed Message That Is Already Saved In Database.'
		)
		.addStringOption((embed_id) =>
			embed_id
				.setName('embed_id')
				.setDescription('The Message Id Of The Embed You Wanna Edit')
				.setRequired(true)
		)
		.addStringOption((json) =>
			json
				.setName('json')
				.setDescription('The Full Json Of Your Embed')
				.setRequired(true)
		),

	/**
	 * @param {CommandInteraction} interaction
	 * @param {Client} client
	 */

	async execute(interaction) {
		const embed_Id = interaction.options.getString('embed_id');
		const jsonData = interaction.options.getString('json');

		await interaction.deferReply({ ephemeral: false });

		const errEmbed = new EmbedBuilder().setColor('Red');
		const embedData = await embedModal.find({
			embedId: embed_Id,
		});

		if (!embedData?.length) {
			errEmbed.setTitle('❌An Error Occured');
			errEmbed.setDescription(
				"Couldn't Find A Message With That Id In Database"
			);
			interaction.editReply({ embeds: [errEmbed] });
		} else {
			try {
				const interactionMessage = await interaction.channel.messages.fetch(
					`${embedData[0].embedId}`
				);
				const json = JSON.parse(jsonData);

				interactionMessage.edit({ embeds: [json] }).then((edited_message) => {
					const embedDone = new EmbedBuilder()
						.setColor('Green')
						.setTitle('✅Edited Message')
						.setDescription(
							`Edited Message : https://discord.com/channels/992300928067698759/${interactionMessage.channel.id}/${interactionMessage.id}`
						);
					interaction.editReply({ embeds: [embedDone] });
				});
			} catch (err) {
				errEmbed.setTitle('❌An Error Occured');
				errEmbed.setDescription('There Was A Problem In Editing The Message');
				interaction.editReply({ embeds: [errEmbed] });
			}
		}
	},
};
