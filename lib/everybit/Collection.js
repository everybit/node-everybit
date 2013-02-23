var Collection = function Collection(array) {
  var self = this
  array = (array instanceof Array)? array : [];
  Array.call(this, array.length);
  array.map(function(element, index){
    self[index] = element;
    delete array[index]; /// free mem?
  });
};

Collection.prototype = new Array();
Collection.prototype.constructor = Collection;

module.exports.Collection = Collection;