var Track = require('./track');

function Album(obj) {
  this.data = obj;
  this._tracks = [];
  for (var i = 0; i < this.data.trackinfo.length; i++) {
    this._tracks.push(new Track(this.data.trackinfo[i]));
  }
}
Album.prototype = {
  artist: function(){
    return this.data.artist;
  },

  title: function(){
    return this.data.current.title;
  },

  tracks: function(){
    return this._tracks;
  },

  track: function(num){
    if (this._tracks[num]) {
      return this._tracks[num];
    }
    return new Track();
  },

  artwork: function(){
    return this.data.artFullsizeUrl;
  },

  url: function(){
    return this.data.url;
  },
};

module.exports = Album;
