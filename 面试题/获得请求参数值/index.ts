function getUrlParam (sUrl:string, sKey = '') { 
    let ret = undefined;
    const start = sUrl.indexOf('?');
    const end = sUrl.lastIndexOf('#'); 
    const paramString =  sUrl.slice(start+1, end === -1? undefined : end);
    if(sKey){ 
       ret = paramString.split('&').filter(_=>_.includes(sKey)).map(_=>
        _.replace(`${sKey}=`,''));
       return ret.length === 1 ?ret[0] : ret.length ===0 ? '' : ret;
   } else {
     ret = {};
     paramString.split('&').forEach(_=>{
        const prop = _.slice(0,_.lastIndexOf('='));
        if(ret[prop]){
          ret[prop].push(_.replace(/\w+=/g,''));
          ret[prop] = [];
          ret[prop].push(_.replace(/\w+=/g,''));
        }
    }
   );
    return ret;
   }
}

RegExp

console.log(getUrlParam('http://www.nowcoder.com?key=1&key=2&key=3&key=4&test1=4#hehe','abc'));