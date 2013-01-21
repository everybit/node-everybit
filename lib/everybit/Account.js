var Account

Account = pineapple.utils.inherit(Everybit.EverybitObject, function Account() {
  var self  = this, error

  this.super(this, 'account', Everybit.API_KEY);
 
  this.client.method(function retrieve(callback) {
    this.get('/account', function(err, req, res, data) {
      if (data && data.status) {
        data = data.data

        var account = new Account();
        account.define(data);
      }
      else if (data && data.message) {
        err = new pineapple.Base.Error(data.message || "Something went wrong!")
        err.name = "ClientError";
      }

      if (typeof callback === 'function') {
        callback.call(self, err, account);
      }
    });
  });
});

Account.prototype.retrieve = function(callback) {
  this.client.retrieve(callback);
  return this;
}

var account = new Account();
account.Account = Account;

account.Account.retrieve = function(callback, apikey) {
  account.client.apikey =  Everybit.API_KEY || this.apikey;
  account.client.auth('apikey');
  account.retrieve(callback);
  return this;
}

module.exports = account;