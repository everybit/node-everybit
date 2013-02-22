var Account = pineapple.utils.inherit(Everybit.Resource, function Account(data) {
  this.super(this, 'account', data);
});

Account.retrieve = function(callback) {
  account.client.apikey =  Everybit.API_KEY || account.apikey;
  account.client.auth('apikey');
  account.retrieve(callback);

  return Account;
}

var account = module.exports = new Account();
account.Account = Account;