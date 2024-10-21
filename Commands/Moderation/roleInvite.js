const {
	SlashCommandBuilder,
	CommandInteraction,
	Client,
	EmbedBuilder,
} = require('discord.js');

const inviteModal = require('../../Models/inviteModal');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('role_invite')
		.setDescription('Making An Invite Link With A Role Attached To It')
		.addRoleOption((role) =>
			role
				.setName('role')
				.setDescription('The Role You Wanna Attach It To The Invite Link')
				.setRequired(true)
		)
		.addStringOption((max_use) =>
			max_use
				.setName('max_use')
				.setDescription('The Maximum Amount Of Use For That Role')
				.addChoices(
					{ name: 'no_limit', value: '0' },
					{ name: 'one', value: '1' },
					{ name: 'five', value: '5' },
					{ name: 'ten', value: '10' },
					{ name: 'twenty_five', value: '25' },
					{ name: 'fifty', value: '50' },
					{ name: 'hundred', value: '100' }
				)
		)
		.addStringOption((expire_after) =>
			expire_after
				.setName('expire_after')
				.setDescription('The Time You Want The Invite Link Expire After.')
				.addChoices(
					{ name: '30_minute', value: '1800' },
					{ name: '1_hour', value: '3600' },
					{ name: '6_hours', value: '21600' },
					{ name: '12_hours', value: '43200' },
					{ name: '1_day', value: '86400' },
					{ name: '7_days', value: '604800' },
					{ name: 'never', value: '0' }
				)
		),

	/**
	 * @param {CommandInteraction} interaction
	 * @param {Client} client
	 */

	async execute(interaction, client) {
		const embed = new EmbedBuilder().setColor('Green').setTimestamp();
		await interaction.deferReply({ ephemeral: false });

		const Role = interaction.options.getRole('role');
		const maxUse = interaction.options.getString('max_use');
		const expireAfter = interaction.options.getString('expire_after');

		try {
			interaction.guild.invites
				.create(interaction.channel.id, {
					maxAge: expireAfter,
					maxUses: maxUse,
					unique: true,
				})
				.then(async (invLink) => {
					embed.setTitle(`✅Created Invite Link`);
					embed.setDescription(
						`\nInvite Link : [Link](${invLink})\n Attached Role : <@&${Role.id}>`
					);
					await new inviteModal({
						inviteLink: invLink,
						roleId: Role.id,
						uses: invLink.uses,
					}).save();
					interaction.editReply({ embeds: [embed] });
				});
		} catch (err) {
			embed.setTitle('❗An Error Occured');
			embed.setDescription(
				`There Was A Problem While Creating The Invite Link`
			);
			interaction.editReply({ embeds: [embed] });
		}
	},
};
