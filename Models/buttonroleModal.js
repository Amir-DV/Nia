const { model, Schema } = require('mongoose');

let buttoneroleModal = new Schema({
	name: String,
	description: String,
	type: String,
	roles: Array,
});
module.exports = model('buttoneroleModal', buttoneroleModal);
