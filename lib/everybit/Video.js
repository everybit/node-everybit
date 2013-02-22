var Video = pineapple.utils.inherit(Everybit.Resource, function Video(data){
  var self = this
  this.super(this, 'videos', data);
  this.define(data || {});
});


Video.create = function(data, callback) {
  video.client.apikey = Everybit.API_KEY;
  video.client.auth('apikey');
  video.create(data, callback);
  return Video;
};

Account.retrieve = function(callback) {
  video.client.apikey =  Everybit.API_KEY || video.apikey;
  video.client.auth('apikey');
  video.retrieve(callback);

  return Video;
}

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