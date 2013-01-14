// Bootstrap pineapple
if (typeof pineapple === 'undefined') {
  require('pineapple');
}

module.exports = pineapple.register('everybit', {});

// Attach the MoovObject prototype
everybit.MoovObject = require('./MoovObject').MoovObject;

// Load up and attach external modules
everybit = pineapple.utils.object.merge(everybit, pineapple.loader.load(__dirname, false, ['everybit']).everybit);