var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://adrian:123123123@kahana.mongohq.com:10079/teach');
mongoose.set('debug', true)

var accountSchema = new Schema({
  email: { type: String, unique: true, required: true, trim: true },
  username: { type: String, trim: true },
  password: { type: String, trim: true, select: false },
  profiles: [profileSchema]
});

var profileSchema = new Schema({
  summary: String
});

module.exports = {
  Account: mongoose.model('Account', accountSchema),
  Profile: mongoose.model('Profile', profileSchema)
};