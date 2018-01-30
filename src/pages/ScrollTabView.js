/**
 * Created by zhangzuohua on 2018/1/22.
 */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Image,
    Text,
    Linking,
    View,
    Dimensions,
    Animated,
    Easing,
    PanResponder,
    Platform,
    ActivityIndicator,
    TouchableOpacity,
    StatusBar,
    InteractionManager,
    BackHandler,
    ScrollView,
    TouchableWithoutFeedback,
    RefreshControl,
    DeviceEventEmitter,
    LayoutAnimation,
    NativeModules,
    ImageBackground,
    FlatList
} from 'react-native';
import ScrollableTabView,{ ScrollableTabBar} from 'react-native-scrollable-tab-view';
import Button from '../components/Button';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
import { ifIphoneX } from '../utils/iphoneX';
import _fetch from  '../utils/_fetch'
import Home from './Home';
import storageKeys from '../utils/storageKeyValue'

export  default  class ScrollTabView extends Component {
    static navigationOptions = {
        header:({navigation}) =>{
            return (<View style={{...header}}>
                <TouchableOpacity activeOpacity={1} onPress={() => {
                    navigation.state.routes[0].params.leftFuc && navigation.state.routes[0].params.leftFuc();
                }}>
                    <View style={{justifyContent:'center',marginLeft:10,alignItems:'center',height:43.7}}>
                        <Image source={require('../assets/reload.png')} style={{width:25,height:25}}/>
                    </View>
                </TouchableOpacity>
                <Text style={{fontSize:17,textAlign:'center',fontWeight:'bold',lineHeight:43.7,color:'white'}}>哈吧</Text>
                <TouchableOpacity activeOpacity={1} onPress={() => {
                    navigation.state.routes[0].params.rightFuc && navigation.state.routes[0].params.rightFuc();
                }}>
                    <View style={{justifyContent:'center',marginRight:10,alignItems:'center',height:43.7}}>
                        <Image source={require('../assets/edit.png')} style={{width:30,height:30}}/>
                    </View>
                </TouchableOpacity>
            </View>)
        }
    };
    //88  43.7 fontSize 17 fontWeight:600 RGBA0009 textALi;center
    constructor(props) {
        super(props);
        this.state = {
            sectionList:[],
            page:0,
        };
    }
    readCache = () => {
        READ_CACHE("GesPWD",(res)=>{
            if (res && res.length > 0) {
            }else{
            }

        },(err)=>{
        });

        WRITE_CACHE("USERPWD",{loginStatus:true},null);
    }

    componentDidMount() {
        this.props.navigation.setParams({
            rightFuc:()=>{this.props.navigation.navigate('Web')},
            leftFuc:()=>{ DeviceEventEmitter.emit('reloadData')}
        });
        InteractionManager.runAfterInteractions(() => {
            this.loadData();
        });
    }
    loadData = () => {
        let url = urlConfig.baseURL + urlConfig.sectionList;
        _fetch(fetch(url),30000)
       // fetch(url)
            .then((response) =>  response.json())
           .then((responseJson) => {
            if ((responseJson.result instanceof  Array) && responseJson.result.length > 0){
                responseJson.result.unshift({
                    "classname": "最新",
                    "classid": "0",
                    "tbname": "article"
                }, {
                    "classname": "随机",
                    "classid": "1",
                    "tbname": "article"
                })
                WRITE_CACHE(storageKeys.sectionList,responseJson.result);
                this.setState({sectionList: responseJson.result});
            }else{
                READ_CACHE(storageKeys.sectionList,(res)=>{
                    if (res && res.length > 0) {
                        this.setState({sectionList: res});
                    }else{}
                },(err)=>{
                });}
           }).catch((error) => {
            READ_CACHE(storageKeys.sectionList,(res)=>{
                if (res && res.length > 0) {
                    this.setState({sectionList: res});
                }else{}
            },(err)=>{
            });
                console.error('XXXXX',error);
            });
    }

    renderTab = (tabs) => {
        let array = [];
        array.push(tabs.map((item) => {
            return <Text style={{width: 50,height:20}} >{item}</Text>
        }));
        return array;
    }
    renderTabBar = (params) => {
        global.activeTab = params.activeTab;
        return <ScrollableTabBar activeTextColor='red' underlineStyle={{width:0,height:0}} backgroundColor='white' textStyle={{fontSize:18}} tabStyle={{width:60,paddingLeft:0,paddingRight:0}}/>;
    }
    pageNumber = (number) => {
        let page = 0;
        this.state.sectionList.forEach((v,i)=>{if (parseInt(v.classid) === number){page = i}})
        this.setState({page:page});
    }

    renderContent = (sectionList) => {
        let list = [];
        list.push(sectionList.map((data,index) => {
            return <Home tabLabel={data.classname} data={data} {...this.props} pageNumber={(number)=> {this.pageNumber(number)}} index={index}/>
        }));
        return list;
    }

    render() {
        return (
            <View style={{flex:1}}>
                <StatusBar
                    barStyle="light-content"
                />
            <ScrollableTabView renderTabBar={this.renderTabBar} page={this.state.page} locked={true}>
                {this.renderContent(this.state.sectionList)}
            </ScrollableTabView>
            </View>
        );
    }
}
const header = {
    backgroundColor: '#C7272F',
    ...ifIphoneX({
        paddingTop: 44,
        height:88
    }, {
        paddingTop: 20,
        height:64
    }),
    flexDirection:'row',
    justifyContent:'space-between',
}






