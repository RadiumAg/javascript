/**
 * The Handler interface declares a method for building the chain of handlers.
 * It also declares a method for executing a request.
 */
interface Handler<Request = string, Result = string> {
  setNext(handler: Handler<Request, Result>): Handler;

  handle(request: Request): Result;
}
