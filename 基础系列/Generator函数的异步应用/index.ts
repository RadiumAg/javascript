function run(fn){
  var gen = fn();
  
  function next(data?,err?){
      var res = gen.next(data);
      if(res.done) return;
      next(res.value);
  }

  next();
}


function* g(){
   var a  = yield 1;
   console.log(a);
   var b  = yield 2;
   console.log(b);
}


run(g)

