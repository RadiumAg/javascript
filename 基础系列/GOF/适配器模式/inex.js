'use strict';

//常规模式
const goggleMap = {
  show() {
    console.log('开始渲染谷歌地图');
  },
};

const baiduMap = {
  display() {
    console.log('开始渲染百度地图');
  },
};

const baiduMapAdapter = {
  show() {
    return baiduMap.display();
  },
};

function renderMap(map) {
  if (map.show instanceof Function) {
    map.show();
  }
}

renderMap(goggleMap);
renderMap(baiduMapAdapter);
