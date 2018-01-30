/**
 * Created by zhangzuohua on 2018/1/22.
 */
import React, {Component} from 'react';
import {StackNavigator} from 'react-navigation';
import Detail from '../src/pages/Detail';
import web from '../src/pages/web';
import Home from '../src/pages/Home';
import ScrollTabView from './pages/ScrollTabView'
const NavgationApp = StackNavigator({
    Home: {screen: Home},
    Index:{screen:ScrollTabView},
    Detail: {screen: Detail},
    Web: {screen: web}
},{initialRouteName:'Index'});
export default class Router extends React.Component {
    render() {
        return <NavgationApp/>;
    }
}