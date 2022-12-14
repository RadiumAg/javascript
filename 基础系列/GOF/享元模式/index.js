'use strict';
//享元模式要求将对象的属性划分为内部状态与外部状态（状态在这里通常指属性）。享元模式是
//尽量减少共享对象的数量，关于如何划分内部状态和外部状态，下面的几条经验提供了一些指引。
//1.内部状态存储于对象内部。
//2.内部状态可以被一些对象共享。
//3.内部状态独立于具体的场景，通常不会改变。
//4.外部状态取决于具体的场景，并根据场景而变化，外部状态不能被共享。
//这样一来，我们便可以把所有内部状态相同的对象都指定为同一个共享的对象。而外部状态从对象上
//剥离出来，并存储在外部。根据元素（metadata）去创建对象
