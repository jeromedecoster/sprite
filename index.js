
function Sprite(options) {
  if (!(this instanceof Sprite)) return new Sprite(options);

  this.check(options, 'src', 'columns', 'rows', 'el');
  this.src = options.src;
  this.columns = options.columns;
  this.rows = options.rows;
  this.delay = options.delay || 60;
  this.waitStart = options.waitStart || 0;
  this.waitEnd = options.waitEnd || 0;

  if (/^(loop|yoyo)$/.test(options.motion)) this.motion = options.motion;

  this.canvas = options.el.nodeName.toLowerCase() == 'canvas';

  var that = this;
  this.loaded = false;
  this.img = new Image();
  this.img.src = options.src;
  this.img.onload = function() {
    that.onload(this, options);
  }
}

/**
 * Start the animation.
 *
 * @api public
 */

Sprite.prototype.play = function() {
  // image not loaded
  if (!this.loaded) return this.cb = [this.play];
  // already playing
  if (this.direction == 1) return;
  if (this.interval != undefined && this.motion == 'yoyo') return;

  this.clear();
  this.direction = 1;
  this.animate();
}

/**
 * Rewind the animation.
 *
 * @api public
 */

Sprite.prototype.rewind = function() {
  // image not loaded
  if (!this.loaded) return this.cb = [this.rewind];
  // already playing
  if (this.direction == -1) return;
  // rewind not allowed
  if (this.motion != undefined) return;
  // already rewinded
  if (this.index == 0) return;

  this.clear();
  this.direction = -1;
  this.animate();
}

/**
 * Stop the animation at frame `index`.
 * If `finish` is true, continue the animation and stop only when the frame `index` is reached.
 *
 * @param  {Number} index
 * @param  {Boolean} finish
 * @api private
 */

Sprite.prototype.stop = function(index, finish) {
  // image not loaded
  if (!this.loaded) return this.cb = [this.stop, index, finish];

  if (finish === true && (this.interval != undefined || this.timeout != undefined)) {
    this.finish = this.clamp(index);
  } else {
    this.clear();
    if (index != undefined) {
      this.index = this.clamp(index);
      this.draw();
    }
  }
}

/**
 * Check for required params presence in `obj`.
 *
 * @param  {Object} obj
 * @api private
 */

Sprite.prototype.check = function(obj) {
  for (var i = 1, n = arguments.length; i < n; i++) {
    if (obj[arguments[i]] == undefined) throw new Error('Sprite param `' + arguments[i] + '` required');
  }
}

/**
 * Image onload event handler.
 *
 * @param  {Image} img
 * @param  {Object} options
 * @api private
 */

Sprite.prototype.onload = function(img, options) {
  var cels = options.rows * options.columns;
  this.max = !options.frames
    ? cels - 1
    : Math.max(0, Math.min(cels - 1, options.frames - 1));

  this.width = img.width / options.columns;
  this.height = img.height / options.rows;

  options.el.style.width = this.width + 'px';
  options.el.style.height = this.height + 'px';

  if (this.canvas) {
    options.el.width = this.width;
    options.el.height = this.height;
    this.el = options.el.getContext('2d');
  } else {
    this.el = options.el;
    this.el.style.backgroundImage = 'url(' + this.src +')';
  }

  this.index = this.clamp(options.index || 0);
  this.draw();
  this.loaded = true;

  if (this.cb) {
    this.cb[0].apply(this, this.cb.splice(1));
    this.cb = undefined;
  }
}

/**
 * Render the frame.
 *
 * @api private
 */

Sprite.prototype.draw = function() {
  var row = Math.floor(this.index / this.columns);
  var col = (this.index - row * this.columns);

  if (this.canvas) {
    this.el.clearRect(0, 0, this.width, this.height);
    this.el.drawImage(this.img, this.width * col, this.height * row,
                      this.width, this.height, 0, 0, this.width, this.height);
  } else {
    this.el.style.backgroundPosition = -this.width * col + 'px ' + -this.height * row + 'px';
  }
}

/**
 * Reset instervals and variables.
 *
 * @param  {Boolean} keep
 * @api private
 */

Sprite.prototype.clear = function(keep) {
  clearInterval(this.interval);
  clearTimeout(this.timeout);
  this.interval = undefined;
  this.timeout = undefined;
  if (keep !== true) {
    this.direction = undefined;
  }
}

/**
 * Setup the update interval.
 *
 * @api private
 */

Sprite.prototype.animate = function() {
  var that = this;
  this.interval = setInterval(function() {
    that.update();
  }, this.delay);
}

/**
 * Compute the new frame index then draw it.
 *
 * @api private
 */

Sprite.prototype.update = function() {
  var that = this;
  if (this.direction > 0) {
    this.index += 1;
    if (this.motion == 'yoyo') {
      // if starts from the last index
      if (this.index > this.max) {
        this.direction = -1;
        this.index = this.max - 1;
      } else if (this.index == this.max) {
        this.direction = -1;
        if (this.waitEnd > 0) {
          this.clear(true);
          this.timeout = setTimeout(function() {
            that.animate();
          }, this.waitEnd);
        }
      }
    } else if (this.motion == 'loop') {
      if (this.index > this.max) {
        this.index = 0;
      } else if (this.index == this.max) {
        if (this.waitEnd > 0) {
          this.clear(true);
          setTimeout(function() {
            that.animate();
          }, this.waitEnd);
        }
      }
    } else {
      if (this.index > this.max) {
        this.index = 0;
      } else if (this.index == this.max) {
        this.clear();
      }
    }
    this.draw();

  } else if (this.direction < 0) {
    this.index -= 1;
    if (this.motion == 'yoyo') {
      if (this.index == 0) {
        this.direction = 1;
        if (this.waitStart > 0) {
          this.clear(true);
          this.timeout = setTimeout(function() {
            that.animate();
          }, this.waitStart);
        }
      }
    } else if (this.motion == undefined) {
      if (this.index == 0) this.clear();
    }
    this.draw();
  }

  if (this.finish != undefined && this.finish == this.index) {
    this.finish = undefined;
    this.clear();
  }
}

/**
 * Clamp the `index` between 0 and the `max` frame index.
 *
 * @param  {Number} index
 * @return {Number}
 * @api private
 */

Sprite.prototype.clamp = function(index) {
  return Math.max(0, Math.min(this.max, index));
}
