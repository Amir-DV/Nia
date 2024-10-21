const { Events } = require('discord.js');

module.exports = {
	name: Events.VoiceStateUpdate,
	once: false,

	async execute(oldVoiceState, newVoiceState) {
		if (newVoiceState.channel) {
			if (newVoiceState.channel.id === '1100445701390995496') {
				if (
					newVoiceState.member.roles.highest.id === '992580744511758346' ||
					newVoiceState.member.roles.highest.id === '994997307827294298' ||
					newVoiceState.member.roles.highest.id === '1043857765120090142' ||
					newVoiceState.member.roles.highest.id === '1000485050489520153' ||
					newVoiceState.member.roles.highest.id === '996424602186174504' ||
					newVoiceState.member.roles.highest.id === '1040524630823284766' ||
					newVoiceState.member.roles.highest.id === '1102832639720833074'
				) {
					console.log('User Connected To Voice');
					newVoiceState.guild.channels
						.create({
							name: `${newVoiceState.member.nickname}'s Channel`,
							type: 2,
							parent: '1001741192012251186',
							permissionOverwrites: [
								{
									id: newVoiceState.member.id,
									allow: [
										PermissionsBitField.Flags.MuteMembers,
										PermissionsBitField.Flags.MoveMembers,
										PermissionsBitField.Flags.ManageChannels,
										PermissionsBitField.Flags.ViewChannel,
									],
								},
								{
									id: newVoiceState.guild.roles.everyone,
									allow: [
										PermissionsBitField.Flags.Speak,
										PermissionsBitField.Flags.Connect,
										PermissionsBitField.Flags.ViewChannel,
									],
								},
							],
						})
						.then((NewChannel) => {
							NewChannel.setPosition(1);
							newVoiceState.member.voice.setChannel(NewChannel);
						});
				}
			} else if (!oldVoiceState.channel) return;
			else if (oldVoiceState.channel.parent.id === '1001741192012251186') {
				if (
					oldVoiceState.channel.id === '1100445701390995496' ||
					oldVoiceState.channel.id === oldVoiceState.guild.afkChannelId
				)
					return;
				else {
					if (oldVoiceState.channel.members.size < 1) {
						oldVoiceState.channel.delete();
					}
				}
			}
		} else if (oldVoiceState.channel.parent.id === '1001741192012251186') {
			if (
				oldVoiceState.channel.id === '1100445701390995496' ||
				oldVoiceState.channel.id === oldVoiceState.guild.afkChannelId
			)
				return;
			else {
				if (oldVoiceState.channel.members.size < 1) {
					oldVoiceState.channel.delete();
				}
			}
		} else if (!newVoiceState.channel) return;
	},
};
