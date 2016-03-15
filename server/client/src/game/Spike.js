var PIXI = require("pixi.js");
var loadTexture = require("./loadTexture");

var spikeTexture = loadTexture("spike.png");

function Spike() {
  PIXI.Sprite.call(this, spikeTexture);
  this.position.x = 2;
  this.position.y = -10;
}
Spike.prototype = Object.create(PIXI.Sprite.prototype);
Spike.prototype.constructor = Spike;

module.exports = Spike;

