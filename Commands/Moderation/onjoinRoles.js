const {
	SlashCommandBuilder,
	CommandInteraction,
	Client,
	EmbedBuilder,
} = require('discord.js');

const generalModal = require('../../Models/generalModal');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('onjoin_role')
		.setDescription('Will Add / Remove Roles To Onjoin Roles List.')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('add')
				.setDescription('Will Add A Role To The List Of Roles')
				.addRoleOption((role) =>
					role
						.setName('role')
						.setDescription(
							'The Role Which You Wanna Add To The Server Role List.'
						)
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('remove')
				.setDescription('Will Remove A Role From The List Of Roles')
				.addRoleOption((role) =>
					role
						.setName('role')
						.setDescription(
							'The Role Which You Wanna Remove From The Server Role List.'
						)
						.setRequired(true)
				)
		),

	/**
	 * @param {CommandInteraction} interaction
	 * @param {Client} client
	 */

	async execute(interaction, client) {
		const embed = new EmbedBuilder().setColor('Green');
		await interaction.deferReply({ ephemeral: false });
		const subcommand = interaction.options.getSubcommand();

		switch (subcommand) {
			case 'add':
				{
					const Role = interaction.options.getRole('role');
					const guildData = await generalModal.findOne({
						guildId: interaction.guild.id,
					});
					if (!guildData?.roleIds)
						await new generalModal({ guildId: interaction.guild.id }).save();

					if (guildData?.roleIds) {
						if (guildData.roleIds.length >= 25)
							return interaction.editReply({
								embeds: [
									embed.setDescription(
										'You Can Only Add `25` Roles To The Roles List'
									),
								],
							});

						const Ids = guildData.roleIds.map((x) => x.roleID);
						if (Ids.includes(Role.id))
							return interaction.editReply({
								embeds: [
									embed.setDescription(
										'You Have Already Added That Role To The List'
									),
								],
							});

						const newRole = {
							roleID: Role.id,
							roleName: Role.name,
						};

						if (guildData) {
							const roleData = guildData.roleIds.find(
								(r) => r.roleID === Role.id
							);

							if (roleData) {
								roleData = newRole;
							} else {
								guildData.roleIds = [...guildData.roleIds, newRole];
							}

							await guildData.save();
						} else {
							await buttonroleModal.updateOne(
								{ guildId: interaction.guild.id },
								{ roleIds: newRole }
							);
						}

						interaction.editReply({
							embeds: [
								embed.setDescription(
									`**Role Name**: ${newRole.roleName}\n**Role **: ${Role}\n**Role ID**: ${newRole.roleID}\nWas Added To The Role List`
								),
							],
						});
					} else
						interaction.editReply({
							embeds: [
								embed.setDescription(
									`Database Created , Please Use The Command Again`
								),
							],
						});
				}
				break;
			case 'remove':
				{
					const Role = interaction.options.getRole('role');
					const guildData = await generalModal.findOne({
						guildId: interaction.guild.id,
					});

					if (!guildData?.roleIds)
						await new generalModal({ guildId: interaction.guild.id }).save();

					if (guildData?.roleIds) {
						const guildRoles = guildData.roleIds;
						const findRole = guildRoles.find((r) => r.roleID === Role.id);

						if (!findRole)
							return interaction.editReply({
								embeds: [
									embed.setDescription(
										'This Role Was Never Added To Role List'
									),
								],
							});

						const filteredRoles = guildRoles.filter(
							(r) => r.roleID !== Role.id
						);

						guildData.roleIds = filteredRoles;

						await guildData.save();

						interaction.editReply({
							embeds: [
								embed.setDescription(
									`**Role Name**: ${Role.name}\n**Role **: ${Role}\n**Role ID**: ${Role.id}\n Is Removed From The Role List`
								),
							],
						});
					} else
						interaction.editReply({
							embeds: [
								embed.setDescription(
									`Database Created , Please Use The Command Again`
								),
							],
						});
				}
				break;
		}
	},
};
