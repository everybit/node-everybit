var client = require('../client/Client')

module.exports = pineapple.register('moovatom', pineapple.extend({
  user : new client.Client('user', {
    apikey  : pineapple.config.app.apikey,
    methods : {
      details : function(uuid, callback) {
        this.get('/user/' + uuid, function(err, req, res, data) {
          if (typeof callback === 'function') {
            callback.call(this, err, new moovatom.User(data.data));
          }
        });
      }
    }
  })
}));

// Attach the MoovObject prototype
moovatom.MoovObject = require('./MoovObject').MoovObject;

// Load up and attach external modules
moovatom = moovatom.extend(moovatom.loader.load(__dirname, false, ['moovatom']).moovatom);