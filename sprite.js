/*! Sprite v0.0.1 | github.com/jeromedecoster/sprite */

function Sprite(options) {
  this.check(options, 'src', 'width', 'height', 'el');
  this.src = options.src;
  this.width = options.width;
  this.height = options.height;
  this.delay = options.delay || 60;
  this.waitStart = options.waitStart || 0;
  this.waitEnd = options.waitEnd || 0;

  if (~['loop', 'yoyo'].indexOf(options.motion)) this.motion = options.motion;

  options.el.style.width = this.width + 'px';
  options.el.style.height = this.height + 'px';

  if (options.el.nodeName.toLowerCase() == 'canvas') {
    this.canvas = true;
    options.el.width = this.width;
    options.el.height = this.height;
    this.el = options.el.getContext('2d');
  } else {
    this.el = options.el;
  }

  this.loaded = false;
  this.img = new Image();
  this.img.src = options.src;

  var that = this;
  this.img.onload = function() {
    if (this.height > this.width) {
      that.frames = (this.height / that.height) - 1;
      that.vertical = true;
    } else {
      that.frames = (this.width / that.width) - 1;
      that.vertical = false;
    }

    if (!that.canvas) that.el.style.backgroundImage = 'url(' + that.src +')';

    that.frame = that.clamp(options.frame || 0);
    that.draw();
    that.loaded = true;

    if (that.cb) {
      that.cb[0].apply(that, that.cb.splice(1));
      that.cb = undefined;
    }
  }
}

Sprite.prototype = {

  play : function() {
    // not loaded
    if (!this.loaded) return this.cb = [this.play];
    // already playing
    if (this.direction == 1) return;
    if (this.interval != undefined && this.motion == 'yoyo') return;

    this.clear();
    this.direction = 1;
    this.animate();
  },

  rewind : function() {
    // not loaded
    if (!this.loaded) return this.cb = [this.rewind];
    // already playing
    if (this.direction == -1) return;
    // rewind not allowed
    if (this.motion != undefined) return;
    // already rewinded
    if (this.frame == 0) return;

    this.clear();
    this.direction = -1;
    this.animate();
  },

  stop : function(frame, finish) {
    // not loaded
    if (!this.loaded) return this.cb = [this.stop, frame, finish];

    if (finish === true && (this.interval != undefined || this.timeout != undefined)) {
      this.finish = this.clamp(frame);
    } else {
      this.clear();
      if (frame != undefined) {
        this.frame = this.clamp(frame);
        this.draw();
      }
    }
  },

  // private functions

  check : function(obj) {
    for (var i = 1, n = arguments.length; i < n; i++) {
      if (obj[arguments[i]] == undefined) throw new Error('Sprite param `' + arguments[i] + '` required');
    }
  },

  draw : function() {
    if (this.canvas) {
      this.el.clearRect(0, 0, this.width, this.height);
      if (this.vertical) {
        this.el.drawImage(this.img, 0, 0 + this.height * this.frame,
                          this.width, this.height, 0, 0, this.width, this.height);
      } else {
        this.el.drawImage(this.img, 0 + this.width * this.frame, 0,
                          this.width, this.height, 0, 0, this.width, this.height);
      }
    } else {
      if (this.vertical) {
        this.el.style.backgroundPosition = '0px ' + -this.height * this.frame + 'px';
      } else {
        this.el.style.backgroundPosition = -this.width * this.frame + 'px 0px';
      }
    }
  },

  update : function() {
    var that = this;
    if (this.direction > 0) {
      this.frame += 1;
      if (this.motion == 'yoyo') {
        // if starts from the last frame
        if (this.frame > this.frames) {
          this.direction = -1;
          this.frame = this.frames - 1;
        } else if (this.frame == this.frames) {
          this.direction = -1;
          if (this.waitEnd > 0) {
            this.clear(true);
            this.timeout = setTimeout(function() {
              that.animate();
            }, this.waitEnd);
          }
        }
      } else if (this.motion == 'loop') {
        if (this.frame > this.frames) {
          this.frame = 0;
        } else if (this.frame == this.frames) {
          if (this.waitEnd > 0) {
            this.clear(true);
            setTimeout(function() {
              that.animate();
            }, this.waitEnd);
          }
        }
      } else {
        if (this.frame > this.frames) {
          this.frame = 0;
        } else if (this.frame == this.frames) {
          this.clear();
        }
      }
      this.draw();

    } else if (this.direction < 0) {
      this.frame -= 1;
      if (this.motion == 'yoyo') {
        if (this.frame == 0) {
          this.direction = 1;
          if (this.waitStart > 0) {
            this.clear(true);
            this.timeout = setTimeout(function() {
              that.animate();
            }, this.waitStart);
          }
        }
      } else if (this.motion == undefined) {
        if (this.frame == 0) this.clear();
      }
      this.draw();
    }

    if (this.finish != undefined && this.finish == this.frame) {
      this.finish = undefined;
      this.clear();
    }
  },

  clear : function(keep) {
    clearInterval(this.interval);
    clearTimeout(this.timeout);
    this.interval = undefined;
    this.timeout = undefined;
    if (keep !== true) {
      this.direction = undefined;
    }
  },

  clamp : function(frame) {
    return Math.max(0, Math.min(this.frames, frame));
  },

  animate : function() {
    var that = this;
    this.interval = setInterval(function() {
      that.update();
    }, this.delay);
  }
}
