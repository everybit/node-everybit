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

// Attach the EverybitObject prototype
Everybit.EverybitObject = require('./EverybitObject').EverybitObject;

// Load up and attach external modules
Everybit = pineapple.utils.object.merge(Everybit, pineapple.loader.load(__dirname, false, ['everybit']).everybit);