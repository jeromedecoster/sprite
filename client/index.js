var el1 = document.getElementsByClassName('sprite')[0];

var sp1 = new Sprite({
  src: '/sprite-ver.png',
  // src: '/img/sprite-hor.png',
  width: 100,
  height: 200,
  delay: 40,
  // delay: 250,
  // frame: 5,
  // waitStart: 2000,
  // waitEnd: 1000,
  // motion: 'loop',
  // motion: 'yoyo',
  el: el1
});

el1.addEventListener('mouseenter', function() {
  sp1.play();
})
el1.addEventListener('mouseleave', function() {
  sp1.rewind();
  // sp.stop(0);
  // sp.stop(0, true);
})
el1.addEventListener('click', function() {
  // sp.rewind();
  sp1.stop(2);
  // sp.stop(1);
  // sp.stop(-10, true);
});

var el2 = document.getElementsByClassName('sprite')[1];

var sp2 = new Sprite({
  src: '/sprite-hor.png',
  width: 100,
  height: 200,
  // delay: 40,
  delay: 450,
  // frame: 25,
  // waitStart: 3000,
  waitEnd: 3000,
  // motion: 'loop',
  motion: 'yoyo',
  el: el2
});

sp2.play();
