import React, { Component } from 'react';
import LogiToPost from './src/navigations/LogiToPost'
import PostToDetail from './src/navigations/PostToDetail'
class App  extends Component {
    state = {  }
    render() {
        return (
            <PostToDetail/>
        );
    }
}

export default LogiToPost;