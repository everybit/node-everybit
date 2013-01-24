/**
   Require https://github.com/osteele/collections-js collection helper
**/
require(pineapple.APP_PATH + '/lib/external/collections')

var client = require('../client/Client')

var EverybitObject = function EverybitObject(type, apikey) {
  var properties = {}
    , self = this

  this.validators   = [];
  this.readable     = [];
    
  this.__defineGetter__('properties', function(){
    if (!!~ [
        'EverybitObjectSet', 'EverybitObjectPropertyGetter'
        ].indexOf(arguments.callee.caller.name)) {
      return properties;
    }
  });

  this.__defineSetter__('properties', function(value){
    if (arguments.callee.caller === self.set.name) {
      properties[value]
    }
  });

  if (type !== false) {
    this.client = new client.Client(type, {
      apikey  : apikey || false
    });
  }
}

EverybitObject.prototype.extend = function(object) {
  pineapple.utils.object.merge(this, object);
  return this;
};

EverybitObject.prototype.proxy = function(methods) {
  methods = Array.isArray(methods)? methods : [methods];
  var self = this;

  methods.map(function(method){
    self[method] = (function() { 
      self.client[method].apply(self.client, arguments);

      return this;
    }).bind(self);
  });

  return this;
};

EverybitObject.prototype.define = function(properties) {
  var prop

  if (typeof properties === 'object') {
    for (prop in properties) {
      this.set(prop, properties[prop], true);
    }
  }

  return this;
}

EverybitObject.prototype.validates = function(property, validator) {
  if (typeof this.validators[property] != 'object') {
    this.validators[property] = [];
  }

  if (typeof validator === 'function') {
    this.validators[property].push(validator);
  }

  return this;
}

EverybitObject.prototype.validate = function(property) {
  var i, func

  if (this.validators[property] && this.validators[property].length) {
    for (i = 0; i < this.validators[property].length; i++) {
      func = this.validators[property][i];

      return typeof func === 'function' && func.call(this)
    }
  }
  return false;
}


EverybitObject.prototype.set = function EverybitObjectSet(key, value, preventValidation) {
  var self = this, readable = true

  if (preventValidation || this.validate(key)) {
    if (key.match(/^!/)) {
      readable = false;
      key = key.replace('!', '');
    }

    if (readable && !~ this.readable.indexOf(key)) {
      this.readable.push(key);
    }

    this.__defineGetter__(key, function EverybitObjectPropertyGetter(){
      if (self.isReadable(key)) {
        return self.properties[key]
      }
    });

    this.__defineSetter__(key, function EverybitObjectPropertySetter(value){
      if (self.validate(key)) {
        self.properties[key] = value;
      }
    });

    //console.log(self.properties)
    self.properties[key] = value;
  }
}

EverybitObject.prototype.toObject = function() {
  var clean = {}, self = this

  this.readable.map(function(property){
    if (self[property]) {
      clean[property] = self[property]
    }
  });

  return clean;
};

EverybitObject.prototype.isReadable = function(key) {
  return !!~ this.readable.indexOf(key) ? true : false;
}

module.exports.EverybitObject = EverybitObject;