import { Component, ReactElement } from "react";

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

class List extends Component<{}> {
  constructor(props: {}) {
    super(props);
  }

  render() {
    const usersElements: ReactElement[] = [];
    for (const user of users) {
      usersElements.push(
        <div>
          <div>姓名:{user.username}</div>
          <div>年龄:{user.age}</div>
          <div>性别:{user.gender}</div>
          <hr />
        </div>
      );
    }

    return <div>{usersElements}</div>;
  }
}
