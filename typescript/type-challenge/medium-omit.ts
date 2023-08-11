type CustomExclude<T, U> = T extends U ? never : T;

type MyOmit<T, K extends keyof T> = {
  [P in CustomExclude<keyof T, K>]: T[P];
};
