import React, { Component } from "react";

interface likeButtonProps {
  likedText: string;
  unlikedText: string;
}

export class LikeButton extends Component<
  likeButtonProps,
  {
    isLiked: boolean;
    count: number;
  }
> {
  constructor(props: likeButtonProps) {
    super(props);
    this.state = { isLiked: false, count: 0 };
  }

  static defaultProps = {
    likedText: "取消",
    unlikedText: "点赞",
  };

  handleClickOnLikeButton() {
    this.setState({
      isLiked: !this.state.isLiked,
    });
  }

  render() {
    const likedText = this.props.likedText;
    const unlikedText = this.props.unlikedText;
    return (
      <button onClick={this.handleClickOnLikeButton.bind(this)}>
        {this.state.isLiked ? likedText : unlikedText}👍
      </button>
    );
  }
}
