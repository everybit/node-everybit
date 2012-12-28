var User, Profile

Profile = moovatom.utils.inherit(moovatom.MoovObject, function Profile(fields) {
  this.super(this);
  this.define(fields);
});

User = moovatom.utils.inherit(moovatom.MoovObject, function User(fields) {
  this.super(this);
  this.profile = new Profile(fields.profile);

  delete fields.profile;

  this.define(fields);
});

module.exports.User = User
module.exports.User.Profile = Profile;