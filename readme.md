# Sprite

Sprite manager

* Work with canvas `drawImage` or regular div `backgroundPosition`
* Advanced `loop`, `yoyo` motions with optional delay before restart or rewind


## Example

```js
var sp = new Sprite({
  src: '/sprite.png',
  columns: 7,
  rows: 1,
  delay: 150,
  motion: 'yoyo',
  el: document.querySelector('.sprite')
});

sp.play();
```

Direct instantiation, without `new`, is also possible

```js
var sp = Sprite({
  src: '/sprite.png'
  // ...
});
```

## API

#### play()

Play the animation

```js
play()
```

#### rewind()

Play the animation in reverse order

```js
rewind()
```

#### stop([index], [finish])

Stop the animation

```js
stop()
```

Stop the animation at frame `index` 3

```js
stop(3)
```

Stop the animation when frame `index` 3 is reached

```js
stop(3, true)
```

## Required params

* `src`: The spritesheet path
* `columns`: The count of image by row
* `rows`: The count of rows
* `el`: The canvas or div element

## Options

#### options.delay

* Type: `Number`
* Default: `60`

The delay between each frame

#### options.frames

* Type: `Number`
* Default: `colmuns` * `rows`

The count of real frames. Useful when `colmuns` and `rows` are both greater than 1

#### options.index

* Type: `Number`
* Default: `0`

The frame `index` displayed at start

#### options.motion

* Type: `String`
* Default: `undefined`
* Values: `loop`, `yoyo`

The motion type

#### options.waitStart

* Type: `Number`
* Default: `0`

The delay before restart in `yoyo` mode

#### options.waitEnd

* Type: `Number`
* Default: `0`

The delay before rewind in `yoyo` mode, or before restart in `loop` mode
