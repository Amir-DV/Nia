const { model, Schema } = require('mongoose');

let landingdropwdownModal = new Schema({
	name: String,
	description: String,
	type: String,
	roles: Array,
});
module.exports = model('landingdropwdownModal', landingdropwdownModal);
