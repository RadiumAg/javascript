"use strict";

function simpleHash(data) {
  let total = 0;
  for (var i = 0; i < data.length; ++i) {
    total += data.charCodeAt(i);
  }
  return total % this.table.length;
}

function put(data) {
  var pos = this.simpleHash(data);
  this.talbe[pos] = data;
}

function showDistro() {
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
  this.put = put;
}


var someNames = ["David", "Jennifer", "Donnie", "Raymond", "Cynthia", "Mike", "Clayton", "Danny", "Jonathan"];

var hTable = new HashTable();
for(var i = 0; i<someNames.length; ++i){
    hTable.put(someNames[i]);
}
hTable.showDistro();