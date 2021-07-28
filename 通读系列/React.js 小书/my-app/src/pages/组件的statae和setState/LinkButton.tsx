import React, { Component } from "react";

export class LikeButton extends Component<{}, { isLiked: boolean }, {}> {
  constructor(props: {}) {
    super(props);
    this.state = { isLiked: false };
  }

  handleClickOnLikeButton() {
    this.setState({
      isLiked: !this.state.isLiked,
    });
  }

  render() {
    return (
      <button onClick={this.handleClickOnLikeButton.bind(this)}>
        {this.state.isLiked ? "取消" : "点赞"}👍
      </button>
    );
  }
}
