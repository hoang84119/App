import React, { Component } from 'react';
import {createDrawerNavigator} from 'react-navigation'
import TabNavigator from './TabNavigator'
import Login from '../components/User/DangNhap'
import SlideMenu from '../components/SlideMenu'
import Account from '../components/User/Account';

const Drawer = createDrawerNavigator({
    Home: {screen: TabNavigator},
    Login: {screen: Login},
    Account: {screen: Account}
},{
    contentComponent: props => <SlideMenu {...props}/>
})

export default Drawer;