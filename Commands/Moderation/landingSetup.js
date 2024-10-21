const {
	SlashCommandBuilder,
	CommandInteraction,
	PermissionFlagsBits,
	Client,
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	AttachmentBuilder,
	StringSelectMenuBuilder,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('landing_setup')
		.setDescription('Will Setup The Landing Embed In Current Channel'),

	/**
	 * @param {CommandInteraction} interaction
	 * @param {Client} client
	 */

	async execute(interaction, client) {
		await interaction.deferReply({ ephemeral: false });

		const file = new AttachmentBuilder('./Assets/Mockup-V1.png');
		const embed = new EmbedBuilder().setImage('attachment://discordjs.png');

		const button = new ActionRowBuilder().setComponents(
			new ButtonBuilder()
				.setCustomId('hom_general')
				.setLabel('HoM General')
				.setStyle(ButtonStyle.Danger)
				.setEmoji('<:Mantis:408058761253486631>'),
			new ButtonBuilder()
				.setCustomId('wow_guild')
				.setLabel('WoW Guild')
				.setStyle(ButtonStyle.Success)
				.setEmoji('<:wowc:601521872403955752>'),
			new ButtonBuilder()
				.setCustomId('archeage_guild')
				.setLabel('ArcheAge Guild')
				.setStyle(ButtonStyle.Danger)
				.setEmoji('<:Archeage:407702738500059137>')
		);

		// const dropMenu = new ActionRowBuilder().setComponents(
		// 	new StringSelectMenuBuilder()
		// 		.setCustomId('help-menu')
		// 		.setPlaceholder('Select your Question.')
		// 		.setDisabled(false)
		// 		.addOptions([
		// 			{
		// 				label: 'Test',
		// 				value: 'testid',
		// 				description: 'Test',
		// 				emoji: '❓',
		// 			},
		// 		])
		// );

		interaction.followUp('Done');
		const message = await interaction.fetchReply();
		await interaction.channel.send({
			components: [button],
			embeds: [embed],
			files: [file],
		});
		message.delete();
	},
};
