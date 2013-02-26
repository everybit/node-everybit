var Resource = function Resource(type, data) {
  var self = this
  Everybit.Object.call(this, type, this.type || 'resource', data);
  if (type !== false) {
    this.client = new Everybit.Client(type, {
      apikey  : Everybit.API_KEY
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
      status    = data && data.status          || false;
      data      = status && data.data          || null;
      resource  = status && new Resource(data) || null;
      message   = !status && data.message      || false;
      err       = message && new Everybit.ClientError(message);
      
      (callback instanceof Function) && callback.call(self, err, resource);
    });
  });

  this.client.method(function retrieve(callback) {
    var Resource = self.constructor

    this.get('/'+ self.type, function(err, req, res, data) {
      var status = data.status
        , code = data.code
        , data = data.data
      console.log(data)
      if (data && status) {
        var resource = new Resource();
        resource.define(data);
      }
      else if (data && data.error) {
        err = new pineapple.Base.Error(data.error || "Something went wrong!")
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

  this.proxy(['create', 'retrieve', 'all', 'remove', 'edit']);
};

Resource.prototype = new Everybit.Object('resource');
Resource.prototype.constructor = Resource;

Resource.prototype.proxy = function(methods) {
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

Resource.extend = function(type, Constructor) {
  Constructor.prototype = new Resource(type)
  Constructor.prototype.constructor = Constructor;

  var resource = new Constructor();

  Constructor.create = function(data, callback) {
    resource.client.apikey = Everybit.API_KEY;
    resource.client.auth('apikey');
    resource.create(data, callback);
    return Constructor;
  };

  Constructor.retrieve = function(callback) {
    resource.client.apikey =  Everybit.API_KEY || resource.apikey;
    resource.client.auth('apikey');
    resource.retrieve(callback);
    return Constructor;
  };

  Constructor.all = function(callback) {
    resource.client.apikey = Everybit.API_KEY;
    resource.client.auth('apikey');
    resource.all(callback);
    return Constructor;
  };

  return Constructor;
};

module.exports.Resource = Resource