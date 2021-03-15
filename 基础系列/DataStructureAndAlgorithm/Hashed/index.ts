"use strict";

function simpleHash(data: string) {
  let total = 0;
  for (let i = 0; i < data.length; ++i) {
    total += data.charCodeAt(i);
  }
  return total % this.table.length;
}

function betterHash(string: string, arr: []): number {
  const H = 37;
  let total = 0;
  for (let i = 0; i < string.length; ++i) {
    total += H * total + string.charCodeAt(i);
  }
  console.log(total ,arr);
  total = total % arr.length;
  
  console.log(total);
  return total;
}

function put(data) {
  // var pos = this.simpleHash(data);
  var pos = this.betterHash(data,this.table);
  this.table[pos] = data;
}

function showDistro(): void {
  let total = 0;
  for (var i = 0; i < this.table.length; ++i) {
    if (this.table[i] != undefined) {
      console.log(i + ":" + this.table[i]);
    }
  }
}

function HashTable() {
  this.table = new Array(137);
  this.simpleHash = simpleHash;
  this.showDistro = showDistro;
  this.betterHash = betterHash;
  this.put = put;
}

var someNames = [
  "David",
  "Jennifer",
  "Donnie",
  "Raymond",
  "Cynthia",
  "Mike",
  "Clayton",
  "Danny",
  "Jonathan",
];

var hTable = new HashTable();
for (var i = 0; i < someNames.length; ++i) {
  hTable.put(someNames[i]);
}
hTable.showDistro();
