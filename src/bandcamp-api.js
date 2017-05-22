const axios = require('axios')

const searchUrl = 'https://bandcamp.com/api/nusearch/2/autocomplete'
const mp3Regex = /{"mp3-128":"(.+)"}/
const durationRegex = /"duration":([\d\.]+),/

module.exports = {
  search: function (q) {
    return axios.get(searchUrl, {
      params: {
        q: q
      }
    }).then(response => {
      return Promise.all(
        response.data.results.filter(el => {
          return el.type === 't'
        }).map(track => {
          return this.getTrack(track.url).then(source => {
            return {
              url: track.url,
              name: track.name,
              artist: track.band_name,
              artwork: track.img,
              duration: source.duration
            }
          })
        })
      )
    })
  },

  getTrack: function (url) {
    return axios.get(url).then(response => {
      const data = response.data

      return {
        duration: Number(data.match(durationRegex)[1]) * 1000,
        stream: data.match(mp3Regex)[1]
      }
    })
  }
}