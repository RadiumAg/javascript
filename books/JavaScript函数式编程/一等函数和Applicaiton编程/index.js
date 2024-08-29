const { each, chain, reduce, range } = require('underscore');

// each(['whiskey', 'tango', 'foxtrot'], (word) => { console.log(word.charAt(0).toUpperCase() + word.substr(1)) });

// 命令式编程
function lyricSegment(n) {
  return chain([])
    .push(`${n} bottles of beer on the wall`)
    .push(`${n}bottles of beer`)
    .push(`${n}Take on down, pass it arround`)
    .tap(lyrics => {
      if (n > 1) lyrics.push(`${n - 1}bottles of beer on the wall.`);
      else lyrics.push('NO more bottles of beer on the wall!');
    })
    .value();
}
console.log(lyricSegment(9));

function song(start, end, lyricGen) {
  return reduce(
    range(start, end, -1),
    (acc, n) => {
      return acc.concat(lyricGen(n));
    },
    [],
  );
}

console.log(song(99, 0, lyricSegment));
// 基于原型的面向对象编程

// 元编程
