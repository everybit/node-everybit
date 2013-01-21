// Bootstrap pineapple
if (typeof pineapple === 'undefined') {
  require('pineapple');
}

module.exports = pineapple.register('everybit', {});

// Attach the EverybitObject prototype
everybit.EverybitObject = require('./EverybitObject').EverybitObject;

// Load up and attach external modules
everybit = pineapple.utils.object.merge(everybit, pineapple.loader.load(__dirname, false, ['everybit']).everybit);