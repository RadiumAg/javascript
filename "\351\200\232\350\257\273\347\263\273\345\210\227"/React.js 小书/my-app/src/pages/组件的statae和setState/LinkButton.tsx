import { count } from "console";
import React, { Component } from "react";

export class LikeButton extends Component<
  {},
  { isLiked: boolean; count: number },
  {}
> {
  constructor(props: {}) {
    super(props);
    this.state = { isLiked: false, count: 0 };
  }

  handleClickOnLikeButton() {
    this.setState({
      isLiked: !this.state.isLiked,
    });

    this.setState((prevState) => {
      return { count: 0 };
    });

    this.setState((prevState) => {
      return { count: prevState.count + 1 };
    });
    console.log(this.state.count);
  }

  render() {
    return (
      <button onClick={this.handleClickOnLikeButton.bind(this)}>
        {this.state.isLiked ? "取消" : "点赞"}👍
      </button>
    );
  }
}
