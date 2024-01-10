"use strict";

/* eslint-disable no-restricted-syntax */
var ElementVNode = {
  type: 'area',
  props: {
    id: 'foo'
  },
  children: [{
    type: 'p',
    children: 'hello'
  }]
};
var VOID_TAGS = 'area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr';

function renderElementVNode(vnode) {
  var tag = vnode.type,
      props = vnode.props,
      children = vnode.children; // 判断是否是闭合标签

  var isVoidElement = VOID_TAGS.includes(tag);
  var ret = "<".concat(tag);

  if (props) {
    for (var k in props) {
      ret += " ".concat(k, "=\"").concat(props[k], "\"");
    }
  }

  ret += isVoidElement ? "/>" : ">";
  if (isVoidElement) return ret;

  if (typeof children === 'string') {
    ret += children;
  } else if (Array.isArray(children)) {
    children.forEach(function (child) {
      ret += renderElementVNode(child);
    });
  }

  ret += "</".concat(tag, ">");
  return ret;
}

console.log(renderElementVNode(ElementVNode)); // <div id="foo"><p>hello</p></div>