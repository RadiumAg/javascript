import React, {Component} from 'react';
import CommentInput from './CommontInput';
import CommentList from './CommentList';
import './index.css';

export default class CommonApp extends Component {
    render(){
        return (<div className="wrapper">
             <CommentInput></CommentInput>
             <CommentList></CommentList>
        </div>)
    }

}