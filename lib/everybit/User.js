var User, Profile

Profile = pineapple.utils.inherit(moovatom.MoovObject, function Profile(fields) {
  this.super(this, false);
  this.define(fields);
});

User = pineapple.utils.inherit(moovatom.MoovObject, function User(uuid) {
  var self  = this, error

  if (!uuid || typeof uuid !== 'string') {
    error = new pineapple.Base.Error('Invalid uuid set.');
    error.name = "UserError";

    throw error;
  }

  this.uuid = uuid;
  this.super(this);
 
  this.client.method(function details(uuid, callback) {
    callback = typeof uuid === 'function'? uuid : callback;
    uuid     = typeof uuid === 'string'? uuid : false; 

    this.get('/user/' + (uuid || self.uuid), function(err, req, res, data) {
      if (data.status) {
        data = data.data
        self.profile = new Profile(data.profile);

        delete data.profile;

        self.define(data);
      }
      else {
        err = new pineapple.Base.Error(data.message || "Something went wrong!")
        err.name = "ClientError";
      }

      if (typeof callback === 'function') {
        callback.call(self, err, self);
      }
    });
  });
});

User.prototype.details = function(uuid, callback) {
  this.client.details(uuid, callback);
  return this;
}

module.exports.User = User
module.exports.User.Profile = Profile;