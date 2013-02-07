var Video = pineapple.utils.inherit(Everybit.Object, function Video(data){
  var self = this

  this.super(this, 'video', Everybit.API_KEY);

  this.define(data || {});

  this.client.method(function create(data, callback){
    callback = data instanceof Function? data : callback;
    data     = data instanceof Object? data : self.toObject();

    self.post('/videos', data, function(err, req, res, data){
      var video, status, message
      status  = data && data.status       || false;
      data    = status && data.data       || null;
      video   = status && new Video(data) || null;
      message = !status && data.message   || false;
      err     = message && new Everybit.ClientError(message);
      
      (callback instanceof Function) && callback.call(self, err, video);
    });
  });

  this.client.method(function all(callback){
    var videos = new Everybit.Collection([]);
    self.get('/videos', function(err, req, res, data){
      var status, message
      status  = data && data.status     || false;
      data    = status && data.data     || null;
      message = !status && data.message || false;
      err     = message && new Everybit.ClientError(message)

      data && data.length && data.map(function(video){
        video = new Video(video);
        videos.push(video);
      });

      (callback instanceof Function) && callback.call(self, err, videos);
    });
  });

  this.proxy(['create', 'all']);
});


Video.create = function(data, callback) {
  video.client.apikey = Everybit.API_KEY;
  video.client.auth('apikey');
  video.create(data, callback);
  return Video;
};

Video.all = function(callback) {
  video.client.apikey = Everybit.API_KEY;
  video.client.auth('apikey');
  video.all(callback);
  return Video;
};

/**
  @namespace video
  Instance of Video
**/
var video = module.exports = new Video();
video.Video = Video;