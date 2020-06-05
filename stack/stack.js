function Stack () {
  this.dataStore = [];
  this.top = 0;
  this.push = push;
  this.pop = pop;
  this.peek = peek;
}

function push (element) {
  this.dataStore[this.top++] = element;
}

function pop () {
  return this.dataStore = [--this.top];
}

function peek () {
  return this.dataStore[this.top--]
}

function pop () {
  return this.dataStore[--this.top];
}

function clear () {
  this.top = 0;
}

function length () {
  return this.top;
}


s.push("David");
s.push("Raymond");
s.push("Bryan");
print("length: " + s.length());
print(s.peek()); var popped = s.pop();
print("The popped element is: " + popped);
print(s.peek()); s.push("Cynthia");
print(s.peek()); s.clear();
print("length: " + s.length());
print(s.peek());
s.push("Clayton");
print(s.peek());
