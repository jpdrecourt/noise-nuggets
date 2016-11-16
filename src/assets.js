/*
 * Asset loading and initialisationtape
 * Create a sounds and imgs object
 * sound object with properties the names of the sound
 * Each sound has the following properties
 * file: the file name and location without extension
 * howl: the howler object
 * To play a sound called 'bell', call sounds.bell.howl.play()
 * TODO Images
 *
 */
const howler = require('howler');

let sounds = require('./sounds');
let data = require('./data');
let imgs = {};

exports.load = (callback) => {
  let assetCount = Object.keys(sounds).length + Object.keys(imgs).length;
  // Loading sounds
  let canPlay = () => {if (--assetCount === 0) callback();};
  // General sound setup
  Object.keys(sounds).forEach((sound) => {
    sounds[sound].howl = new howler.Howl({
      src: [sounds[sound].file + '.mp3', sounds[sound].file + '.ogg'],
      onload: canPlay
    });
  });
  // Loading images
  // TODO Loading image assets
};

exports.imgs = imgs;
exports.sounds = sounds;
exports.data = data;
