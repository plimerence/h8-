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
            return (<View style={{...header}}>
                <TouchableOpacity activeOpacity={1} onPress={() => {
                    navigation.goBack();
                }}>
                    <View style={{justifyContent:'center',marginLeft:10,alignItems:'center',height:43.7}}>
                        <Image source={require('../assets/backIconWhite.png')} style={{width:20,height:20}}/>
                    </View>
                </TouchableOpacity>
                <Text style={{fontSize:17,textAlign:'center',fontWeight:'bold',lineHeight:43.7,color:'white'}}>发布</Text>
                <TouchableOpacity activeOpacity={1} onPress={() => {
                }}>
                    <View style={{justifyContent:'center',marginRight:10,alignItems:'center',height:43.7}}>
                    </View>
                </TouchableOpacity>
            </View>)
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            enews: 'MAddInfo',
            classid:'2',
            mid:'7',
            smalltext:'',
            ctitle:'',
            ecmsfrom:'9',
        };
    }

//this.props.navigation.state.params.data.content && JSON.parse(this.props.navigation.state.params.data.content).content
    componentDidMount() {
    }
    render() {
        return (
                <WebView source={{uri:urlConfig.pubLishUrl}}/>
        );
    }
}
const header = {
    backgroundColor: '#C7272F',
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





