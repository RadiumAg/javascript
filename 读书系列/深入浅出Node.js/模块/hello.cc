#include <node.h>
#include <v8.h>

Handle<Value> Hello(const Arguments& args) {
  HandleScope scope;
  return scope.Close(String::New("Hello world!"));
}
void init(Handle<Object> exports) {
  exports->Set(String::NewSymbol("hello"),
               FunctionTemplate::New(Hello)->GetFunction());
}
NODE_MODULE(hello, init)