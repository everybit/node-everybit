var client = {}

client.Client = pineapple.utils.inherit(pineapple.server.Client, function Client(name, options) {
  var method

  options = pineapple.utils.object.merge({
    type    : 'json',
    apikey  : options.apikey || Everybit.API_KEY,
    client  : {
      url       : pineapple.config.app.client.url,
      version   : '*',
      retry     : false,
      name      : pineapple.app.name,
      userAgent : pineapple.config.app.client.userAgent || this.generateUserAgent()
    }
  }, options || {});

  this.super(this, name, pineapple.config.server.adapter, options);

  if (options.apikey) {
    this.auth('apikey')
  }

  if (options.methods && typeof options.methods === 'object') {
    for (method in options.methods) {
      if (typeof options.methods[method] === 'function') {
        this.method(method, options.methods[method]);
      }
    }
  }
});

module.exports = client;