const {
	SlashCommandBuilder,
	CommandInteraction,
	Client,
	EmbedBuilder,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('role')
		.setDescription('Add/Remove X Role To/From All Users With Y Role')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('add')
				.setDescription('Add X Role To All Users With Y Role')
				.addRoleOption((f_role) =>
					f_role
						.setName('f_role')
						.setDescription('The Role You Wanna Add To Users')
						.setRequired(true)
				)
				.addRoleOption((s_role) =>
					s_role
						.setName('s_role')
						.setDescription('The Role That Users Will Be Affected.')
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('remove')
				.setDescription('Remove X Role From All Users With Y Role')
				.addRoleOption((f_role) =>
					f_role
						.setName('f_role')
						.setDescription('The Role You Wanna Remove From Users')
						.setRequired(true)
				)
				.addRoleOption((s_role) =>
					s_role
						.setName('s_role')
						.setDescription('The Role That Users Will Be Affected.')
						.setRequired(true)
				)
		),

	/**
	 * @param {CommandInteraction} interaction
	 * @param {Client} client
	 */

	async execute(interaction, client) {
		const subcommand = interaction.options.getSubcommand();
		const embed = new EmbedBuilder().setColor('Green').setTimestamp();
		await interaction.deferReply({ ephemeral: false });
		let updatedroleCount = 0;
		let notupdatedroleCount = 0;
		await interaction.guild.members.fetch();

		switch (subcommand) {
			case 'add':
				{
					const f_role = interaction.options.getRole('f_role');
					const s_role = interaction.options.getRole('s_role');
					const userRole = interaction.member.roles.highest.position;
					embed.setTitle('💻Processing Your Command');
					await interaction.editReply({ embeds: [embed] });

					if (userRole > f_role.position && userRole > s_role.position) {
						const Role = interaction.guild.roles.cache.get(s_role.id).members;
						Role.forEach((user) => {
							try {
								setTimeout(() => {
									user.roles.add(f_role);
									updatedroleCount++;
									embed.setTitle('✅Adding Roles To Users');
									embed.setDescription(
										`\nUpdated Users Count : ${updatedroleCount}\nNot Updated Users Count : ${notupdatedroleCount}`
									);
									interaction.editReply({ embeds: [embed] });
								}, 5000);
							} catch (err) {
								notupdatedroleCount++;
								embed.setTitle('✅Adding Roles To Users');
								embed.setDescription(
									`\nUpdated Users Count : ${updatedroleCount}\nNot Updated Users Count : ${notupdatedroleCount}`
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
				}
				break;
			default: {
				const f_role = interaction.options.getRole('f_role');
				const s_role = interaction.options.getRole('s_role');
				const userRole = interaction.member.roles.highest.position;
				embed.setTitle('💻Processing Your Command');
				await interaction.editReply({ embeds: [embed] });

				if (userRole > f_role.position && userRole > s_role.position) {
					const Role = interaction.guild.roles.cache.get(s_role.id).members;
					Role.forEach((user) => {
						try {
							setTimeout(() => {
								user.roles.remove(f_role);
								updatedroleCount++;
								embed.setTitle('❌Removing Roles From Users');
								embed.setDescription(
									`\nUpdated Users Count : ${updatedroleCount}\nNot Updated Users Count : ${notupdatedroleCount}`
								);
								interaction.editReply({ embeds: [embed] });
							}, 5000);
						} catch (err) {
							notupdatedroleCount++;
							embed.setTitle('❌Removing Roles From Users');
							embed.setDescription(
								`\nUpdated Users Count : ${updatedroleCount}\nNot Updated Users Count : ${notupdatedroleCount}`
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
			}
		}
	},
};
