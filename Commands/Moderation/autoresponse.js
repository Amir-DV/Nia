const {
	SlashCommandBuilder,
	CommandInteraction,
	Client,
	EmbedBuilder,
} = require('discord.js');

const ms = require('ms');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('auto_response')
		.setDescription('Will Add An Auto Response')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('add')
				.setDescription('Adding An Auto-Response Command')
				.addStringOption((type) =>
					type
						.setName('type')
						.setDescription('The Type Of Your Auto Response ')
						.addChoices(
							{ name: 'embed', value: 'Embed' },
							{ name: 'normal', value: 'Normal' }
						)
						.setRequired(true)
				)
				.addStringOption((trigger) =>
					trigger
						.setName('trigger')
						.setDescription('What Triggers The Command?')
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('list')
				.setDescription('Listing All Auto-Response Commands Names')
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('delete')
				.setDescription('Delete An Auto-Response Command')
				.addStringOption((id) =>
					id
						.setName('id')
						.setDescription('The Id Of Your Auto Response ')
						.setRequired(true)
				)
		),

	/**
	 * @param {CommandInteraction} interaction
	 * @param {Client} client
	 */

	async execute(interaction, client) {},
};
