const {
	SlashCommandBuilder,
	CommandInteraction,
	Client,
	EmbedBuilder,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kick All Users With X Role')

		.addRoleOption((f_role) =>
			f_role
				.setName('f_role')
				.setDescription('The Role You Wanna Kick Users For')
				.setRequired(true)
		),
	/**
	 * @param {CommandInteraction} interaction
	 * @param {Client} client
	 */

	async execute(interaction, client) {
		const embed = new EmbedBuilder().setColor('Green').setTimestamp();
		await interaction.deferReply({ ephemeral: false });

		let kickedCount = 0;
		let unkickedCount = 0;
		await interaction.guild.members.fetch();

		const role = interaction.options.getRole('f_role');
		embed.setTitle('💻Processing Your Command');
		await interaction.editReply({ embeds: [embed] });

		const userRole = interaction.member.roles.highest.position;
		if (userRole > role.position) {
			const Role = interaction.guild.roles.cache.get(role.id).members;
			Role.forEach((user) => {
				try {
					setTimeout(() => {
						user.kick();
						kickedCount++;
						embed.setTitle(`✅Kicking Users With **${role.name}** Role`);
						embed.setDescription(
							`\nKicked Users Count : ${kickedCount}\nNot Kicked Users Count : ${unkickedCount}`
						);
						interaction.editReply({ embeds: [embed] });
					}, 5000);
				} catch (err) {
					unkickedCount++;
					embed.setTitle(`✅Kicking Users With **${role.name}** Role`);
					embed.setDescription(
						`\nKicked Users Count : ${kickedCount}\nNot Kicked Users Count : ${unkickedCount}`
					);
					interaction.editReply({ embeds: [embed] });
				}
			});
		} else {
			embed.setTitle('❗An Error Occured');
			embed.setDescription(
				`Chosen Roles Have Higher Position Than Your Highest Roles`
			);
			interaction.editReply({ embeds: [embed] });
		}
	},
};
