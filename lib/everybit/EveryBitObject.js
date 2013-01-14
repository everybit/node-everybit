/**
   Require https://github.com/osteele/collections-js collection helper
**/
require(pineapple.APP_PATH + '/lib/external/collections')

var client = require('../client/Client')

var EveryBit = function EveryBit(type) {
  var properties = {}

  this.validators   = [];
  this.readable     = [];
    
  this.__defineGetter__('properties', function(){
    if (!!~ [
        'EveryBitSet', 'EveryBitPropertyGetter'
        ].indexOf(arguments.callee.caller.name)) {
      return properties;
    }
  });

  this.__defineSetter__('properties', function(value){
    if (arguments.callee.caller === 'EveryBitSet') {
      properties[value]
    }
  });

  if (type !== false) {
    this.client = new client.Client(type, {
      apikey  : pineapple.config.app.apikey
    });
  }
}

EveryBit.prototype.define = function(properties) {
  var prop

  if (typeof properties === 'object') {
    for (prop in properties) {
      this.set(prop, properties[prop], true);
    }
  }

  return this;
}

EveryBit.prototype.validates = function(property, validator) {
  if (typeof this.validators[property] != 'object') {
    this.validators[property] = [];
  }

  if (typeof validator === 'function') {
    this.validators[property].push(validator);
  }

  return this;
}

EveryBit.prototype.validate = function(property) {
  var i, func

  if (this.validators[property] && this.validators[property].length) {
    for (i = 0; i < this.validators[property].length; i++) {
      func = this.validators[property][i];

      return typeof func === 'function' && func.call(this)
    }
  }
  return false;
}


EveryBit.prototype.set = function EveryBitSet(key, value, preventValidation) {
  var self = this, readable = true

  if (preventValidation || this.validate(key)) {
    if (key.match(/^!/)) {
      readable = false;
      key = key.replace('!', '');
    }

    if (readable) {
      this.readable.push(key);
    }

    this.__defineGetter__(key, function EveryBitPropertyGetter(){
      if (self.isReadable(key)) {
        return self.properties[key]
      }
    });

    this.__defineSetter__(key, function EveryBitPropertySetter(value){
      if (self.validate(key)) {
        self.properties[key] = value;
      }
    });

    //console.log(self.properties)
    self.properties[key] = value;
  }
}

EveryBit.prototype.isReadable = function(key) {
  return !!~ this.readable.indexOf(key) ? true : false;
}

module.exports.EveryBit = EveryBit;