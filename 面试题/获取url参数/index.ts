function parse(url = 'www.baidu.com?a=1&b=2&c=3#d=4&e=5&f=6') {
  const firstQueryIndex = url.indexOf('?');
  url = url.slice(firstQueryIndex + 1);

  const [urlQuery, hashQuery] = url.split('#');
  const hashQueryArray = hashQuery.split('&').map(_ => _.split('='));
  const urlQueryArray = urlQuery.split('&').map(_ => _.split('='));

  const result = {
    urlQuery: {},
    hashQuery: {},
  };

  hashQueryArray.forEach(query => {
    const key = query[0];
    const value = query[1];

    if (key in result) {
      if (Array.isArray(result[key])) {
        result.hashQuery[key].push(value);
      } else {
        result.hashQuery[key] = [result[key], value];
      }
    } else {
      result.hashQuery[key] = value;
    }
  });

  urlQueryArray.forEach(query => {
    const key = query[0];
    const value = query[1];

    if (key in result) {
      if (Array.isArray(result[key])) {
        result.urlQuery[key].push(value);
      } else {
        result.urlQuery[key] = [result[key], value];
      }
    } else {
      result.urlQuery[key] = value;
    }
  });

  return result;
}

function useUrlChange = (hashCallback , queryChange)=>{
   const  location = useLocation(); // react-router 

  useEffect(() => {
    const result = parse(location.url)
    if(isHashChange(location.url)) {
    hashCallback(result.hashQuery)

    if(isUrlChange(location.url)) {
        queryChange(result.urlQuery)   
    }
    }

    return ()=>{}
    }, [location.url]); // added Dom, setup() ; update: cleanUp ; setup();  unMounted:cleanUp

}

function isUrlChange(url,oldUrl){
    return true
}

function isHashChange(url){

    return;
}

const B = memo(()=>{})

function App(){
    const a = useCallback(()=>{},[]); // ahooks useMemorizeFn
    const b =  useMemo(()=>()=>{},[])

    return <B onClick = {a} value={b}></B>


}
// useMemo useCallback React.memo();

// ts