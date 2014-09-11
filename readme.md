# Sprite

Sprite manager

* Work with canvas `drawImage` or regular div `backgroundPosition`
* Advanced `loop`, `yoyo` motions with optional delay before restart or rewind


## Example

```js
var sp = new Sprite({
  src: '/sprite.png',
  width: 100,
  height: 200,
  delay: 40,
  motion: 'yoyo',
  el: document.getElementsByClassName('sprite')[0]
});

sp.play();
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

#### stop([frame], [finish])

Stop the animation

```js
stop()
```

Stop the animation at frame 3

```js
stop(3)
```

Stop the animation when frame 3 is reached

```js
stop(3, true)
```

## Required params

* `src`: The spritesheet path
* `width`: The sprite width
* `height`: The sprite height
* `el`: The canvas or div element

## Options

#### options.delay

* Type: `Number`
* Default: `60`

The delay between each frame

#### options.motion

* Type: `String`
* Default: `undefined`
* Values: `loop`, `yoyo`

The motion type

#### options.waitStart

* Type: `Number`
* Default: `0`

The delay before restart in yoyo mode

#### options.waitEnd

* Type: `Number`
* Default: `0`

The delay before rewind in yoyo mode, or before restart in loop mode
