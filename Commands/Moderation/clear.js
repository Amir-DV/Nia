const {
	SlashCommandBuilder,
	CommandInteraction,
	Client,
	EmbedBuilder,
} = require('discord.js');

const ms = require('ms');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Will Clear Set Amount Of Messages')
		.addIntegerOption((number) =>
			number
				.setName('number')
				.setDescription('Amount Of Messages You Wanna Delete.')
				.setRequired(true)
				.setMinValue(1)
				.setMaxValue(100)
		)
		.addUserOption((user) =>
			user
				.setName('user')
				.setDescription('The User You Wanna Delete Their Message')
		),

	/**
	 * @param {CommandInteraction} interaction
	 * @param {Client} client
	 */

	async execute(interaction, client) {
		const embed = new EmbedBuilder().setColor('Green');

		const Number = interaction.options.getInteger('number');
		const User = interaction.options.getUser('user');
		switch (User) {
			case null:
				{
					try {
						const Messages = await interaction.channel.messages.fetch({
							limit: Number,
						});
						const Filtered = Messages.filter(
							(msg) => Date.now() - msg.createdTimestamp < ms('14 days')
						);
						await interaction.channel.bulkDelete(Filtered);
						embed.setDescription(`Deleted ${Filtered.size} Number Of Messages`);
						interaction.reply({ embeds: [embed], ephemeral: true });
					} catch (error) {
						embed.setColor('Red');
						embed.setDescription(
							`There Was Something Wrong In Deleting Messages \n\n**ERROR**\n${error}`
						);
						interaction.reply({ embeds: [embed], ephemeral: true });
					}
				}
				break;
			default: {
				try {
					const Messages = await interaction.channel.messages.fetch({
						limit: Number,
					});
					const FilterBy = User ? User.id : Client.user.id;
					const Filtered = Messages.filter(
						(msg) =>
							Date.now() - msg.createdTimestamp < ms('14 days') &&
							msg.author.id === FilterBy
					);

					await interaction.channel.bulkDelete(Filtered);
					embed.setDescription(`Deleted ${Filtered.size} Number Of Messages`);
					interaction.reply({ embeds: [embed], ephemeral: true });
				} catch (error) {
					embed.setColor('Red');
					embed.setDescription(
						`There Was Something Wrong In Deleting Messages \n\n**ERROR**\n${error}`
					);
					interaction.reply({ embeds: [embed], ephemeral: true });
				}
			}
		}
	},
};
