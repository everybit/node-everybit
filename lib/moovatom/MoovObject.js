/**
   Require https://github.com/osteele/collections-js collection helper
**/
require(moovatom.APP_PATH + '/lib/external/collections')

MoovObject = function MoovObject() {
  var properties = {}

  this.validators   = [];
  this.readable     = [];
    
  this.__defineGetter__('properties', function(){
    if (!!~ [
        'MoovObjectSet', 'MoovObjectPropertyGetter'
        ].indexOf(arguments.callee.caller.name)) {
      return properties;
    }
  });

  this.__defineSetter__('properties', function(value){
    console.log(value)
    if (arguments.callee.caller === 'MoovObjectSet') {
      properties[value]
    }
  });
}

MoovObject.prototype.define = function(properties) {
  var prop

  if (typeof properties === 'object') {
    for (prop in properties) {
      this.set(prop, properties[prop], true);
    }
  }

  return this;
}

MoovObject.prototype.validates = function(property, validator) {
  if (typeof this.validators[property] != 'object') {
    this.validators[property] = [];
  }

  if (typeof validator === 'function') {
    this.validators[property].push(validator);
  }

  return this;
}

MoovObject.prototype.validate = function(property) {
  var i, func

  if (this.validators[property] && this.validators[property].length) {
    for (i = 0; i < this.validators[property].length; i++) {
      func = this.validators[property][i];

      return typeof func === 'function' && func.call(this)
    }
  }
  return false;
}


MoovObject.prototype.set = function MoovObjectSet(key, value, preventValidation) {
  var self = this, readable = true

  if (preventValidation || this.validate(key)) {
    if (key.match(/^!/)) {
      readable = false;
      key = key.replace('!', '');
    }

    if (readable) {
      this.readable.push(key);
    }

    this.__defineGetter__(key, function MoovObjectPropertyGetter(){
      if (self.isReadable(key)) {
        return self.properties[key]
      }
    });

    this.__defineSetter__(key, function MoovObjectPropertySetter(value){
      if (self.validate(key)) {
        self.properties[key] = value;
      }
    });

    //console.log(self.properties)
    self.properties[key] = value;
  }
}

MoovObject.prototype.isReadable = function(key) {
  return !!~ this.readable.indexOf(key) ? true : false;
}

module.exports.MoovObject = MoovObject;