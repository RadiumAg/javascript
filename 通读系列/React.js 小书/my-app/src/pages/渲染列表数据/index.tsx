import { Component } from "react";

const users = [
  {
    username: "Jerry",
    age: 21,
    gender: "male",
  },
  {
    username: "Jerry",
    age: 22,
    gender: "male",
  },
  {
    username: "female",
    age: 19,
    gender: "male",
  },
  {
    username: "female",
    age: 20,
    gender: "male",
  },
];

export class List extends Component<{}> {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(props: {}) {
    super(props);
  }

  render() {
     
     return <div>{ users.map((user,index)=>(
      <div key={user.age}>
        <div>姓名:{user.username}</div>
        <div>年龄:{user.age}</div>
        <div>性别:{user.gender}</div>
        <hr />
      </div>))}</div>;
  }
}
