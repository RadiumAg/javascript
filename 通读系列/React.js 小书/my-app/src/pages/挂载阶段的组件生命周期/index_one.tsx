import React, { Component } from "react";

interface ClockProps {}
export default class Clock extends Component<
  ClockProps,
  {
    date: Date;
  }
> {
  constructor(props: ClockProps) {
    super(props);
    this.state = {
      date: new Date(),
    };
  }

  timer!: NodeJS.Timeout;

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({ date: new Date() });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <div>
        <h1>
          <p>现在的时间是</p>
          {this.state.date.toLocaleTimeString()}
        </h1>
      </div>
    );
  }
}
