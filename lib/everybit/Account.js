var Account = pineapple.utils.inherit(Everybit.EverybitObject, function Account() {
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

  this.proxy(['retrieve']);
});

Account.retrieve = function(callback) {
  account.client.apikey =  Everybit.API_KEY || account.apikey;
  account.client.auth('apikey');
  account.retrieve(callback);

  return Account;
}

var account = module.exports = new Account();
account.Account = Account;