var Collection = function Collection(array) {
  var self = this
  if (! (array instanceof Array)) throw new Error("An Everybit Collection object expects an array as an argument.");
  Array.call(this, array.length);
  array.map(function(element, index){
    self[index] = element;
    delete array[index]; /// free mem?
  });
};

Collection.prototype = new Array();
Collection.prototype.constructor = Collection;

module.exports.Collection = Collection;