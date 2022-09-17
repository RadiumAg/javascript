const { WSASERVICE_NOT_FOUND } = require("constants");
const { threadId } = require("worker_threads");

function Dicitonary(){
     this.datastore = new Array();
     this.add = add;
     this.find = find;
     this.remove = remove;
     this.showAll = showAll;
     this.count = count;
}

function add(key , value){
    this.datastore[key] = value;
}


function find(key){
    return this.datastore[key];
}


function remove(key) {
   delete this.datastore[key];
}


function showAll(){
    for (const key in Object.keys(this.datastore).sort()) {
        console.log(key+ '->' + this.datastore[key]);
    }
}


function count(){
    let n = 0;
    for (const key in Object.keys(this.datastore)) {
        ++n;
    }
    return n;
}