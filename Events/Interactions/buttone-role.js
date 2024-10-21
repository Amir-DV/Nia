const {
	Events,
	CommandInteraction,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	ActionRowBuilder,
	EmbedBuilder,
	ButtonInteraction,
} = require('discord.js');

const panelDB = require('../../Models/buttonroleModal');

module.exports = {
	name: Events.InteractionCreate,
	/**
	 *
	 * @param {ButtonInteraction} interaction
	 * @returns
	 */
	async execute(interaction, client) {
		if (!interaction.isButton()) return;

		const Embed = interaction.message.embeds[0];
		const name = Embed.title.toLowerCase();

		const Data = await panelDB.findOne({ name: name }).catch((err) => {});
		if (!Data) return;

		const Ids = Data.roles.map((x) => x.roleID);
		if (!Ids.includes(interaction.customId)) return;

		await interaction.deferReply({ ephemeral: true });

		const roleID = interaction.customId;

		const role = interaction.guild.roles.cache.get(roleID);
		const memberRoles = interaction.member.roles;

		const hasRole = memberRoles.cache.find((r) => r.id === roleID);

		if (interaction.guild.members.me.roles.highest.position <= role.position)
			return errorInteraction(
				interaction,
				hasRole
					? `Couldn't Remove ${role} From You Because The Role Position Is Higher Than Me.`
					: `Couldn't Give ${role} From You Because The Role Position Is Higher Than Me.`
			);
		if (
			interaction.guild.members.me.roles.highest.position <=
			memberRoles.highest.position
		)
			return errorInteraction(
				interaction,
				hasRole
					? `Couldn't Remove ${role} From You Because Your Position Is Higher Than Me.`
					: `Couldn't Give ${role} From You Because Your Position Is Higher Than Me.`
			);
		const roleType = Data.type;

		switch (roleType) {
			case 'Regular':
				{
					hasRole
						? await memberRoles.remove(roleID)
						: await memberRoles.add(roleID);

					successInteraction(
						interaction,
						hasRole
							? `You Have Lost The Role : ${role}`
							: `You Have Obtained The Role : ${role}`
					);
				}
				break;
			case 'Unique':
				{
					if (!hasRole) await memberRoles.add(roleID);

					successInteraction(
						interaction,
						hasRole
							? `You Can't Get Rid Of That Role : ${role}`
							: `You Have Obtained The Role : ${role}`
					);
				}
				break;
			case 'Remove':
				{
					if (hasRole) await memberRoles.remove(roleID);

					successInteraction(
						interaction,
						hasRole
							? `You Have Lost The Role : ${role}`
							: `You Can't Get That Role Back`
					);
				}
				break;
			case 'One-Of':
				{
					const filteredIds = Ids.filter((e) => e !== roleID);
					if (!hasRole) await memberRoles.add(roleID);

					successInteraction(
						interaction,
						`You Have Obtained The Role : ${role}`
					);
					for (let i = 0; i < filteredIds.length; i++) {
						const hasRole2 = memberRoles.cache.find(
							(r) => r.id === filteredIds[i]
						);
						if (hasRole2) await memberRoles.remove(hasRole2);
					}
				}
				break;
		}
	},
};

function errorInteraction(interaction, description) {
	interaction.editReply({
		embeds: [
			new EmbedBuilder().setColor('Red').setDescription(` - ${description}`),
		],
	});
}

function successInteraction(interaction, description) {
	interaction.editReply({
		embeds: [
			new EmbedBuilder().setColor('Green').setDescription(` - ${description}`),
		],
	});
}
