var hash = {};
var search = document.location.search.slice(1);
if (search.length) {
  hash = search
    .split('&')
    .reduce(function(previous, current) {
      var arr = current.split('=');
      previous[arr[0]] = arr[1];
      return previous;
    }, {});
}

var type = hash['type'] || 'canvas';
var mouseleave = hash['mouseleave'] || 'rewind';
var click = hash['click'] || 'rewind';

var src = hash['src'] || 'horizontal';
var delay = hash['delay'] || 170;
var motion = hash['motion'] || 'none';
var waitStart = hash['waitStart'] || 0;
var waitEnd = hash['waitEnd'] || 0;
var index = hash['index'] || 0;
var frames = hash['frames'] || 7;

function radios(name) {
  inputs
    .filter(function(n) { return n.type == 'radio' && n.name == name })
    .forEach(function(n) {
      if (n.value == window[name]) n.checked = true;
      n.addEventListener('click', function(e) {
        hash[name] = e.target.value;
        browse();
      })
    })
}

function ranges(name) {
  inputs
    .filter(function(n) { return n.type == 'range' && n.name == name })
    .forEach(function(n) {
      if (n.id == name) {
        n.value = window[name];
        n.nextSibling.innerHTML = n.value;
      }
      n.addEventListener('input', function(e) {
        e.target.nextSibling.innerHTML = e.target.value;
      });
      n.addEventListener('change', function(e) {
        hash[name] = e.target.value;
        browse();
      });
    });
}

function buttons(name) {
  inputs
    .filter(function(n) { return n.type == 'button' && n.name == name })
    .forEach(function(n) {
      n.addEventListener('click', function(e) {
        var next = e.target.nextElementSibling;
        next.value = 0;
        next.nextElementSibling.innerHTML = 0;
        hash[next.name] = 0;
        browse();
      })
    })
}

function browse() {
  document.location = document.location.origin
    + document.location.pathname
    + '?'
    + Object.keys(hash).map(function(k) {
        return k + '=' + hash[k];
      }).join('&');
}

// create canvas or div
var node = document.body.firstChild;
var el = document.createElement(type);
el.className = 'sprite';
node.parentNode.insertBefore(el, node);


var inputs = [].slice.call(document.getElementsByTagName('input'));

// radios buttons
radios('type');
radios('mouseleave');
radios('click');
radios('src');
radios('motion');

// ranges
ranges('delay');
ranges('waitStart');
ranges('waitEnd');
ranges('index');
ranges('frames');

// buttons
buttons('reset');

var png = {
  horizontal: '/sprite-hor.png',
  vertical: '/sprite-ver.png',
  rows: '/sprite-rows.png'
}

var rows = 1;
var columns = 1;
if (src == 'horizontal') { columns = 7; }
else if (src == 'vertical') { rows = 7; }
else if (src == 'rows') { columns = 3; rows = 3; }

console.log('type:', type)
console.log('mouseleave:', mouseleave)
console.log('src:', src)
console.log('rows:', rows)
console.log('columns:', columns)
console.log('delay:', delay)
console.log('motion:', motion)
console.log('waitStart:', waitStart)
console.log('waitEnd:', waitEnd)
console.log('index:', index)

var sp = new Sprite({
  src: png[src],
  rows: rows,
  columns: columns,
  delay: delay,
  index: index,
  frames: frames,
  waitStart: waitStart,
  waitEnd: waitEnd,
  motion: motion,
  el: el
});

if (motion != 'loop' && motion != 'yoyo') {
  el.addEventListener('mouseenter', function() {
    sp.play();
  })
} else {
  sp.play();
}
el.addEventListener('mouseleave', function() {
  if (mouseleave == 'rewind') sp.rewind();
  else if (mouseleave == 'stop0') sp.stop(0);
  else if (mouseleave == 'stop0true') sp.stop(0, true);
})
el.addEventListener('click', function() {
  if (click == 'rewind') sp.rewind();
  else if (click == 'stop2') sp.stop(2);
  else if (click == 'stop2true') sp.stop(2, true);
  else if (click == 'stop10true') sp.stop(-10, true);
});
