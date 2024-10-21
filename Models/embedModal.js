const { model, Schema } = require('mongoose');

let embedModal = new Schema({
	embedId: String,
});
module.exports = model('embedModal', embedModal);
