'use strict';

var axios = require('axios');

var searchUrl = 'https://bandcamp.com/api/nusearch/2/autocomplete';
var mp3Regex = /{"mp3-128":"(.+)"}/;
var durationRegex = /"duration":([\d\.]+),/;

module.exports = {
  search: function search(q) {
    var _this = this;

    return axios.get(searchUrl, {
      params: {
        q: q
      }
    }).then(function (response) {
      return Promise.all(response.data.results.filter(function (el) {
        return el.type === 't';
      }).map(function (track) {
        return _this.getTrack(track.url).then(function (source) {
          return {
            url: track.url,
            name: track.name,
            artist: track.band_name,
            artwork: track.img,
            duration: source.duration
          };
        });
      }));
    });
  },

  getTrack: function getTrack(url) {
    return axios.get(url).then(function (response) {
      var data = response.data;

      return {
        duration: Number(data.match(durationRegex)[1]) * 1000,
        stream: data.match(mp3Regex)[1]
      };
    });
  }
};