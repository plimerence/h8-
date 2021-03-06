/**
 * Created by zhangzuohua on 2018/1/19.
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
    FlatList,
    WebView,
    TextInput,
} from 'react-native';
import {StackNavigator} from 'react-navigation';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
import { ifIphoneX } from '../utils/iphoneX';
import urlConfig from '../utils/urlConfig'
export  default  class web extends Component {
    static navigationOptions = {
        header:({navigation}) =>{
            return (
                <ImageBackground style={{...header}} source={require('../assets/backgroundImageHeader.png')} resizeMode='cover'>
                <TouchableOpacity activeOpacity={1} onPress={() => {
                    navigation.goBack();
                }}>
                    <View style={{justifyContent:'center',marginLeft:10,alignItems:'center',height:43.7}}>
                        <Image source={require('../assets/backIconWhite.png')} style={{width:20,height:20}}/>
                    </View>
                </TouchableOpacity>
                <Text style={{fontSize:17,textAlign:'center',fontWeight:'bold',lineHeight:43.7,color:'white'}}> {navigation.state.routes[navigation.state.index].params && navigation.state.routes[navigation.state.index].params.WebTitle}</Text>
                <TouchableOpacity activeOpacity={1} onPress={() => {
                }}>
                    <View style={{justifyContent:'center',marginRight:10,alignItems:'center',height:43.7}}>
                    </View>
                </TouchableOpacity>
                </ImageBackground>
            )
        }
    };

    constructor(props) {
        super(props);
    }

    onNavigationStateChange(e) {
        this.props.navigation.setParams({
            WebTitle: e.title
        });
    }
    componentDidMount() {

    }

//this.props.navigation.state.params.data.content && JSON.parse(this.props.navigation.state.params.data.content).content
    componentDidMount() {
    }
    render() {
        return (
                <WebView source={{uri:urlConfig.pubLishUrl}} onNavigationStateChange={(e)=>{this.onNavigationStateChange(e)}}/>
        );
    }
}
const header = {
   // backgroundColor: '#C7272F',
    ...ifIphoneX({
        paddingTop: 44,
        height:88
    }, {
        paddingTop: Platform.OS === "ios" ? 20 : 0,
        height:Platform.OS === 'ios' ? 64 : 44,
    }),
    flexDirection:'row',
    justifyContent:'space-between',
}





