#! /usr/bin/env node

const Flickr = require('flickr-sdk')
const digits  = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ'
const api_key = 'd62ed2ba3fffa2a56419e113da2aa166'

const flickr = new Flickr(api_key)

const d58 = (s) => [...s].reverse()
                         .reduce((p,c,i) => p + digits.indexOf(c) * Math.pow(58,i), 0)

const decodeFlickr = (u) => d58(u.slice(u.lastIndexOf('/')+1))


const start = async function (photo_id) {
  const args = { photo_id }
  const r = await Promise.all([
    flickr.photos.getInfo(args),
    flickr.photos.getSizes(args)
  ])

  let info  = r[0].body.photo
  let sizes = r[1].body.sizes
  let ret = {
    title: info.title._content,
    photopage: info.urls.url[0]._content,
    original: sizes.size.find(e => e.label == 'Original')
  }

  let x = `<div><img src="${ret.photopage}"></div>`

  console.log(x)
  return x

}

let r = start(decodeFlickr('https://flic.kr/p/2mxa8Gy'))

console.log(r.then(r => r))

