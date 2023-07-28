'use strict';

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
  console.log(total, arr);
  total = total % arr.length;

  console.log(total);
  return total;
}

function put(data) {
  // var pos = this.simpleHash(data);
  const pos = this.betterHash(data, this.table);
  this.table[pos] = data;
}

function showDistro(): void {
  const total = 0;
  for (let i = 0; i < this.table.length; ++i) {
    if (this.table[i] != undefined) {
      console.log(`${i}:${this.table[i]}`);
    }
  }
}

function HashTable() {
  this.table = Array.from({ length: 137 });
  this.simpleHash = simpleHash;
  this.showDistro = showDistro;
  this.betterHash = betterHash;
  this.put = put;
}

const someNames = [
  'David',
  'Jennifer',
  'Donnie',
  'Raymond',
  'Cynthia',
  'Mike',
  'Clayton',
  'Danny',
  'Jonathan',
];

const hTable = new HashTable();
for (const someName of someNames) {
  hTable.put(someName);
}
hTable.showDistro();
