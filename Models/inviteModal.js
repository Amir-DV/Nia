const { model, Schema } = require('mongoose');

let inviteSchema = new Schema({
	inviteLink: String,
	roleId: String,
	uses: Number,
});
module.exports = model('inviteSchema', inviteSchema);
