var Account

Account = pineapple.utils.inherit(Everybit.EverybitObject, function Account(uuid) {
  var self  = this, error

  this.uuid = uuid || false;
  this.super(this, 'account', Everybit.API_KEY);
 
  this.client.method(function retrieve(callback, apikey) {
    this.get('/account', function(err, req, res, data) {
      if (data && data.status) {
        data = data.data

        delete data.profile;

        self.define(data);
      }
      else if (data && data.message) {
        err = new pineapple.Base.Error(data.message || "Something went wrong!")
        err.name = "ClientError";
      }

      if (typeof callback === 'function') {
        callback.call(self, err, self);
      }
    });
  });
});

Account.prototype.retrieve = function(callback, apikey) {
  this.client.retrieve(callback);
  return this;
}

var account = new Account();
account.Account = Account;

account.Account.retrieve = function(callback, apikey) {
  account.client.apikey = apikey || Everybit.API_KEY || this.apikey;
  account.client.auth('apikey');
  account.retrieve(callback);
  return this;
}

module.exports = account;