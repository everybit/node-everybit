var client = {}

client.Client = pineapple.utils.inherit(pineapple.server.Client, function Client(name, options) {
  var method
  options = pineapple.utils.object.merge({
    type    : 'json',
    apikey  : options.apikey || Everybit.API_KEY,
    client  : {
      get url(){ return options.url || Everybit.API_URL || ""},
      version   : '*',
      retry     : false,
      name      : pineapple.app.name,
      userAgent : pineapple.config.app.client.userAgent || this.generateUserAgent()
    }
  }, options || {});

  this.super(this, name, pineapple.config.server.adapter, options);

  if (options.apikey) this.auth('apikey');

  if (options.methods instanceof Object) {
    for (method in options.methods) {
      if (options.methods[method] instanceof Function)
        this.method(method, options.methods[method]);
    }
  }
});

client.ClientError = function ClientError(message) {
  pineapple.Base.Error.call(this);
  this.name = "ClientError";
  this.message = message || "Something went wrong!";
};
client.ClientError.prototype = new pineapple.Base.Error();
client.ClientError.prototype.constructor = client.ClientError;

module.exports = client;