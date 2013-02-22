var Resource = pineapple.utils.inherit(Everybit.Object, function Resource(type, data) {
  this.super(this, type, this.type || 'resource', Everybit.API_KEY, data);

  if (type !== false) {
    this.client = new Everybit.Client(type, {
      apikey  : apikey || false
    });
  }

  (['get', 'post', 'put', 'del']).map(function(method) {
    var oldMethod = self.client.client[method]
      
    self[method] = self.client.client[method] = function() {
      var args = pineapple.utils.makeArray(arguments)
        , uri = args.shift()

      uri = (self.version? '/v'+ self.version : '') + uri;
      args = [uri].concat(args);

      oldMethod.apply(self.client.client, args);

      return self;
    }
  });


  // inherited methods
  this.client.method(function create(data, callback){
    var Resource = self.constructor
    callback = data instanceof Function? data : callback;
    data     = data instanceof Object? data : self.toObject();

    self.post('/'+ self.type, data, function(err, req, res, data){
      var resource, status, message
      status    = data && data.status       || false;
      data      = status && data.data       || null;
      resource  = status && new Resource(data) || null;
      message   = !status && data.message   || false;
      err       = message && new Everybit.ClientError(message);
      
      (callback instanceof Function) && callback.call(self, err, resource);
    });
  });

  this.client.method(function retrieve(callback) {
    var Resource = self.constructor
    this.get('/'+ self.type, function(err, req, res, data) {
      if (data && data.status) {
        data = data.data

        var resource = new Resource();
        resource.define(data);
      }
      else if (data && data.message) {
        err = new pineapple.Base.Error(data.message || "Something went wrong!")
        err.name = "ClientError";
      }

      if (typeof callback === 'function') {
        callback.call(self, err, resource);
      }
    });
  });

  this.client.method(function all(callback){
    var Resource  = self.constructor, resources = new Everybit.Collection([])
    self.get('/'+ self.type, function(err, req, res, data){
      var status, message
      status  = data && data.status     || false;
      data    = status && data.data     || null;
      message = !status && data.message || false;
      err     = message && new Everybit.ClientError(message);

      data && data.length && data.map(function(resource){
        resource = new Resource(resource);
        resources.push(resource);
      });

      (callback instanceof Function) && callback.call(self, err, resources);
    });
  });
});

Resource.prototype.prototype.proxy = function(methods) {
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

module.exports.Resource = Resource