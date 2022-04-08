# 函数对象，NFE

##### 属性"length"

它返回函数入参的个数，rest参数不参与计数。



##### 命名函数表达式

可以在内部访问

```ts
let sayHi = function func(who) {
    alert(`Hello,${who}`)
    func('any')
}
```


