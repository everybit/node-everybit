var Video = pineapple.utils.inherit(Everybit.EverybitObject, function Video(data){
  var self = this

  this.super(this, 'video', Everybit.API_KEY);

  this.define(data || {});

  this.client.method(function create(data, callback){
    callback = data instanceof Function? data : callback;
    data = data instanceof Object? data : self.toObject();

    this.post('/videos', data, function(err, req, res, data){
      if (data && data.status) {
        data = data.data

        var video = new Video();
        video.define(data);
      }
      else if (data && data.message) {
        err = new pineapple.Base.Error(data.message || "Something went wrong!")
        err.name = "ClientError";
      }

      if (typeof callback === 'function') {
        callback.call(self, err, video);
      }
    });
  });

  this.proxy(['create']);
});

Video.create = function(data, callback) {
  video.client.apikey = Everybit.API_KEY;
  video.client.auth('apikey');
  video.create(data, callback);
  return Video;
};

/**
  @namespace video
  Instance of Video
**/
var video = module.exports = new Video();
video.Video = Video;