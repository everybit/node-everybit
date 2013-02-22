// Bootstrap pineapple
if (typeof pineapple === 'undefined') {
  require('pineapple');
}

module.exports = pineapple.register('Everybit', {
  API_KEY     : false,
  API_VERSION : 1,
  API_URL     : 'http://staging.api.everybit.co',

  
  setApiKey : function(apikey) {
    Everybit.API_KEY = apikey;
    return this;
  }
});

Everybit.Object      = require('./Object').Object;
Everybit.Collection  = require('./Collection').Collection;
Everybit.Client      = require('../client/Client').Client;
Everybit.ClientError = require('../client/Client').ClientError;
Everybit.Resource    = require('./Resource').Resource;

// Load up and attach external modules
Everybit = pineapple.utils.object.merge(Everybit, pineapple.loader.load(__dirname, false, ['everybit']).everybit);