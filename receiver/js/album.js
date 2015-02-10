var Track = require('./track');

function Album(obj) {
  this.empty = true;
  this.data = {
    artist: '',
    artFullsizeUrl: '',
    url: '',
    current: {
      id: 0,
      band_id: 0,
      title: ''
    }
  };
  this._tracks = [];

  if (obj) {
    this.empty = false;
    this.data = obj;

    for (var i = 0; i < this.data.trackinfo.length; i++) {
      this._tracks.push(new Track(this.data.trackinfo[i]));
    }
  }
}
Album.prototype = {
  isEmpty: function(){
    return this.empty;
  },

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

  hasPlayableFile: function(){
    var i;
    var len = this.tracks().length;

    for (i = 0; i < len; i++) {
      if (this.track(i).file()) {
        return true;
      }
    }
    return false;
  },

  isSameAlbum: function(bandId, albumId){
    if (this.bandId() === bandId && this.id() === albumId) {
      return true;
    }
    return false;
  },

  artwork: function(){
    return this.data.artFullsizeUrl;
  },

  url: function(){
    return this.data.url;
  },

  bandId: function(){
    return String(this.data.current.band_id);
  },

  id: function(){
    return String(this.data.current.id);
  }
};

module.exports = Album;
