const { Client, Events, GuildMember } = require('discord.js');

const inviteModal = require('../../Models/inviteModal');
const generalModal = require('../../Models/generalModal');

module.exports = {
	name: Events.GuildMemberAdd,
	/**
	 *
	 * @param {GuildMember} member
	 */
	async execute(member) {
		const generalData = await generalModal.findOne({
			guildId: member.guild.id,
		});

		const discordBaseInv = 'https://discord.gg/';
		const invites = await member.guild.invites.fetch();
		const inviteData = await inviteModal.find();

		const filteredInvites = invites.filter(
			(filter) => filter.inviter.id === member.guild.members.me.id
		);

		const mongoInvites = inviteData.map(
			(mongoData) =>
				`${mongoData.inviteLink.split('/').pop()} ${mongoData.uses}`
		);
		const guildInvites = filteredInvites.map(
			(guildData) => `${guildData.code} ${guildData.uses}`
		);
		const finalInvites = mongoInvites.filter((x) => !guildInvites.includes(x));
		if (finalInvites.length) {
			const Code = finalInvites[0].split(' ').shift();
			const Link = invites.filter(
				(guildusesData) => guildusesData.code === Code
			);
			const Uses = Link.map((linkData) => linkData.uses);
			const newinviteData = await inviteModal.find({
				inviteLink: discordBaseInv + finalInvites[0].split(' ').shift(),
			});

			if (!newinviteData?.length) return;
			const Role = member.guild.roles.cache.find(
				(role) => role.id === newinviteData[0].roleId
			);

			await inviteModal.updateOne(
				{
					inviteLink: discordBaseInv + finalInvites[0].split(' ').shift(),
				},
				{
					uses: Uses[0],
				}
			);
			member.roles.add(Role);
		}
		if (generalData?.roleIds.length) {
			const Ids = generalData.roleIds.map((x) => x.roleID);

			for (let i = 0; i < Ids.length; i++) {
				await member.roles.add(Ids[i]);
			}
		}
	},
};
