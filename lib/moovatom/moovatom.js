module.exports = pineapple.register('moovatom', {});

// Attach the MoovObject prototype
moovatom.MoovObject = require('./MoovObject').MoovObject;

// Load up and attach external modules
moovatom = pineapple.utils.object.merge(moovatom, pineapple.loader.load(__dirname, false, ['moovatom']).moovatom);