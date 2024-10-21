const { model, Schema } = require('mongoose');

let generalModal = new Schema({
	guildId: String,
	autoResponseQ: Array,
	autoResponseA: Array,
	roleIds: Array,
});
module.exports = model('generalModal', generalModal);
