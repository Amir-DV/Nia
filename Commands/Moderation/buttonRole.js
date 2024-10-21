const {
	SlashCommandBuilder,
	CommandInteraction,
	Client,
	EmbedBuilder,
	ChannelType,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
} = require('discord.js');

const buttonroleModal = require('../../Models/buttonroleModal');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('button_role_menu')
		.setDescription(
			'Create / Delete Button Role Panels - Add / Remove Roles From The Panel.'
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('create')
				.setDescription('Create A New Button Role Panel')
				.addStringOption((panel_name) =>
					panel_name
						.setName('name')
						.setDescription('The Name Of Your Button Role Panel')
						.setRequired(true)
				)
				.addStringOption((type) =>
					type
						.setName('type')
						.setDescription('The Type Of Your Button Role Panel')
						.addChoices(
							{ name: 'regular', value: 'Regular' },
							{ name: 'unique', value: 'Unique' },
							{ name: 'remove', value: 'Remove' },
							{ name: 'one_of', value: 'One-Of' }
						)
						.setRequired(true)
				)
				.addStringOption((description) =>
					description
						.setName('description')
						.setDescription('The Description Of Your Button Role Panel')
						.setRequired(false)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('delete')
				.setDescription('Delete A Button Role Panel')
				.addStringOption((panel_id) =>
					panel_id
						.setName('panel_id')
						.setDescription('The Id Of Your Previous Saved Panel')
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand.setName('list').setDescription('List All Button Role Panels')
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('add')
				.setDescription('Add A New Button Role To A Panel')
				.addStringOption((panel_id) =>
					panel_id
						.setName('panel_id')
						.setDescription('The Id Of Your Previous Saved Panel')
						.setRequired(true)
				)
				.addRoleOption((role) =>
					role
						.setName('role')
						.setDescription('The Role You Wanna Add To The Panel')
						.setRequired(true)
				)
				.addStringOption((emoji) =>
					emoji
						.setName('emoji')
						.setDescription('The EMoji You Wanna Set For The Added Role')
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('remove')
				.setDescription('Remove A Button Role From A Panel')
				.addStringOption((panel_id) =>
					panel_id
						.setName('panel_id')
						.setDescription('The Id Of Your Previous Saved Panel')
						.setRequired(true)
				)
				.addRoleOption((role) =>
					role
						.setName('role')
						.setDescription('The Role You Wanna Remove From The Panel')
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('panel')
				.setDescription('Will Send The Button Role Panel')
				.addStringOption((panel_id) =>
					panel_id
						.setName('panel_id')
						.setDescription('The Id Of Your Previous Saved Panel')
						.setRequired(true)
				)
				.addChannelOption((channel) =>
					channel
						.setName('channel')
						.setDescription('The Channel You Wanna Send The Button Role Panel')
						.addChannelTypes(ChannelType.GuildText)
						.setRequired(false)
				)
		),
	/**
	 * @param {CommandInteraction} interaction
	 * @param {Client} client
	 */

	async execute(interaction) {
		const subCommand = interaction.options.getSubcommand();
		const embed = new EmbedBuilder().setColor('Green');

		await interaction.deferReply({ ephemeral: false });

		switch (subCommand) {
			case 'create':
				{
					const name = interaction.options.getString('name');
					const description =
						interaction.options.getString('description') ??
						'Click A Button Role Below To Get The Role';
					const type = interaction.options.getString('type');
					await new buttonroleModal({
						name: name.toLowerCase(),
						description: description,
						type: type,
					}).save();
					embed.setTitle('✅ Button Role Panel Created');
					embed.setDescription(
						`Name : ${name.toUpperCase()}\nCreated By : ${interaction.user}`
					);
					interaction.editReply({ embeds: [embed] });
				}
				break;
			case 'list':
				{
					const panelList = await buttonroleModal.find();

					if (!panelList?.length)
						return interaction.editReply({
							embeds: [
								embed.setDescription(
									'There Is No Button Role Panel In This Server'
								),
							],
						});

					let index = 1;
					const panelData = panelList
						.map((data) => {
							return `\`${index++}.\` **Name** : ${data.name.toUpperCase()}\n**ID:** \`${
								data._id
							}\`\n`;
						})
						.join('\n\n');

					embed.setTitle(`🌟 Button Role Panels List`);
					embed.setDescription(`${panelData}`);
					embed.setTimestamp();
					interaction.editReply({ embeds: [embed] });
				}
				break;
			case 'delete':
				{
					const id = interaction.options.getString('panel_id');
					const guildData = await buttonroleModal
						.findById(id)
						.catch((err) => {});
					if (!guildData)
						return interaction.editReply({
							embeds: [embed.setDescription('Please Provie A Valid Panel ID')],
						});

					await buttonroleModal.findByIdAndDelete(id);

					embed.setDescription(
						`Deleted The Button Role Panel With The ID Of : \`${id}\``
					);
					interaction.editReply({ embeds: [embed] });
				}
				break;
			case 'add':
				{
					const panelID = interaction.options.getString('panel_id');
					const role = interaction.options.getRole('role');
					const emoji = interaction.options.getString('emoji');

					const guildData = await buttonroleModal
						.findById(panelID)
						.catch((err) => {});
					if (!guildData)
						return interaction.editReply({
							embeds: [embed.setDescription('Please Provie A Valid Panel ID')],
						});

					if (guildData.roles.length >= 25)
						return interaction.editReply({
							embeds: [
								embed.setDescription('You Can Only Add `25` Roles To A Panel'),
							],
						});

					if (
						role.position >= interaction.guild.members.me.roles.highest.position
					)
						return interaction.editReply({
							embeds: [
								embed.setDescription(
									"I Can't Add A Role Which Is Higher Or Equal To Me."
								),
							],
						});

					const newRole = {
						roleID: role.id,
						RoleEmoji: emoji,
					};

					if (guildData) {
						const roleData = guildData.roles.find((r) => r.roleID === role.id);

						if (roleData) {
							roleData = newRole;
						} else {
							guildData.roles = [...guildData.roles, newRole];
						}

						await guildData.save();
					} else {
						await buttonroleModal.updateOne(
							{ _id: panelID },
							{ Roles: newRole }
						);
					}

					interaction.editReply({
						embeds: [
							embed.setDescription(
								`**Panel Name**: ${guildData.name.toUpperCase()}\n**Role**: ${role}\n**Emoji**: ${emoji}`
							),
						],
					});
				}
				break;
			case 'remove':
				{
					const panelID = interaction.options.getString('panel_id');
					const role = interaction.options.getRole('role');

					const guildData = await buttonroleModal
						.findById(panelID)
						.catch((err) => {});
					if (!guildData)
						return interaction.editReply({
							embeds: [embed.setDescription('Please Provie A Valid Panel ID')],
						});

					const guildRoles = guildData.roles;
					const findRole = guildRoles.find((r) => r.roleID === role.id);

					if (!findRole)
						return interaction.editReply({
							embeds: [
								embed.setDescription('This Role Was Never Added To This Panel'),
							],
						});

					const filteredRoles = guildRoles.filter((r) => r.roleID !== role.id);

					guildData.roles = filteredRoles;

					await guildData.save();

					interaction.editReply({
						embeds: [
							embed.setDescription(
								`Removed The Role ${role} From The Panel List`
							),
						],
					});
				}
				break;
			case 'panel':
				{
					const panelID = interaction.options.getString('panel_id');
					const channel =
						interaction.options.getChannel('channel') || interaction.channel;

					const guildData = await buttonroleModal
						.findById(panelID)
						.catch((err) => {});
					if (!guildData)
						return interaction.editReply({
							embeds: [embed.setDescription('Please Provie A Valid Panel ID')],
						});

					if (!guildData?.roles)
						return interaction.editReply({
							embeds: [
								embed.setDescription(
									"Couldn't Find Any Role Attached To That Panel"
								),
							],
						});

					const Description = guildData.roles
						.map((x) => {
							const role = interaction.guild.roles.cache.get(x.roleID);
							return `\`${x.RoleEmoji}\` => ${role}`;
						})
						.join('\n');

					const panelEmbed = new EmbedBuilder()
						.setColor('Green')
						.setTitle(`${guildData.name.toUpperCase()}`)
						.setDescription(`${guildData.description}\n\n${Description}`)
						.setTimestamp()
						.setFooter({ text: 'Designed By Ivo' });

					interaction.editReply({
						embeds: [
							embed.setDescription(`Sent The Button Role Panel To ${channel}`),
						],
					});

					const row = panelRow(guildData.roles, 5, interaction.guild);
					channel.send({ embeds: [panelEmbed], components: row });
				}
				break;
		}
	},
};

function panelRow(array, number, guild) {
	const Rows = [];
	let k = number;
	for (let i = 0; i < array.length; i += number) {
		const current = array.slice(i, k);
		k += number;
		let totalArray = [];

		const Info = current.map((x) => {
			const role = guild.roles.cache.get(x.roleID);

			return new ButtonBuilder()
				.setStyle(ButtonStyle.Success)
				.setCustomId(role.id)
				.setLabel(role.name)
				.setEmoji(x.RoleEmoji);
		});

		totalArray.push(Info);

		totalArray.forEach((x) => {
			const Row = new ActionRowBuilder().addComponents(x);
			Rows.push(Row);
		});
	}

	return Rows;
}
