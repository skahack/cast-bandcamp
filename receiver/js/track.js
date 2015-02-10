var initData = {
  title: '',
  track_num: 0,
  file: {
    'mp3-128': ''
  }
};

function Track(obj) {
  this.data = initData;

  if (obj) {
    this.data = obj;
  }
}

Track.prototype = {
  title: function(){
    return this.data.title;
  },

  num: function(){
    return this.data.track_num;
  },

  file: function(){
    if (!this.data.file) {
      return null;
    }
    return this.data.file['mp3-128'];
  }
};

module.exports = Track;
