import { useContext } from "react";
import { RouterContext } from "../router";

// 动态路由参数 Hook
function useParams() {
  const { path } = useContext(RouterContext);
  const params = {};
  
  // 从路径中提取参数（简单实现）
  const segments = path.split('/').filter(seg => seg);
  if (segments.length > 1 && segments[0] === 'user') {
    params.id = segments[1];
  }
  
  return params;
}

export default useParams;