import React, { Component } from 'react';
import MainNavigations from './src/navigations/MainNavigations'
import BaiVietNavigations from './src/navigations/BaiVietNavigations'
class App  extends Component {
    state = {  }
    render() {
        return (
            <BaiVietNavigations/>
        );
    }
}

export default App;