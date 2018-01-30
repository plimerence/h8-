/**
 * Created by zhangzuohua on 2018/1/22.
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
} from 'react-native';
import urlConfig  from  '../../src/utils/urlConfig';
import formatData from '../../src/utils/formatData';
import Toast from 'react-native-root-toast';
import LoadError from  '../components/loadError';
import  _fetch from '../utils/_fetch'
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
import PullList from '../components/pull/PullList'
import storageKeys from '../utils/storageKeyValue'
export default class Home extends Component {
    static navigationOptions = {
        header: (params) => {
            return (<Text>哈吧</Text>);
        }
    };
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refreshing: false,
            loadError:false,
            loadNewData:false,
        };
    }
    componentWillMount() {
    }
    componentDidMount() {
        this.refTextArray = [];
        this.subscription = DeviceEventEmitter.addListener('reloadData', this.refreshing);

        InteractionManager.runAfterInteractions(() => {
            this.loadData();
        });
    }
    componentWillUnmount() {
        this.subscription.remove();
    }
    loadData = (resolve) => {
        let url = '';
        if (!this.props.data) {
            return;
        }
        switch (this.props.data.classid) {
            case '0':
                url = urlConfig.baseURL + urlConfig.newList;
                break;
            case '1':
                url = urlConfig.baseURL + urlConfig.randomList;
                break;
            default:
                url = urlConfig.baseURL + urlConfig.sectionListData + '&classid=' + this.props.data.classid;
        }
        _fetch(fetch(url),30000)
       // fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('XXX',responseJson);
                if (responseJson.status === '1') {
                    this.updateNumMessage = responseJson.updateNum;
                   // this.setState({data: this.dealWithLongArray(responseJson.result), refreshing: false});
                   // this.setState({loadNewData: true});
                    setTimeout(() => {
                        this.setState({loadNewData: true})
                    }, 500)
                   // this.flatList && this.flatList.setData([], 0);
                    this.flatList && this.flatList.setData(this.dealWithLongArray(responseJson.result), 0);
                        resolve &&  resolve();
                    WRITE_CACHE(storageKeys.homeList + 'page' + this.props.index,responseJson.result);
                    setTimeout(() => {
                        this.setState({loadNewData: false})
                    }, 1500)
                }else{
                  //  this.setState({loadError:true});
                    READ_CACHE(storageKeys.homeList + 'page' + this.props.index,(res)=>{
                        if (res && res.length > 0) {
                            this.flatList && this.flatList.setData(res, 0);
                        }else{}
                    },(err)=>{
                    });
                    Toast.show(responseJson.message, {
                        duration: Toast.durations.SHORT,
                        position: Toast.positions.CENTER,
                        shadow: true,
                        animation: true,
                        hideOnPress: true,
                        delay: 0,
                    });
                }
            })
            .catch((error) => {
                READ_CACHE(storageKeys.homeList + 'page' + this.props.index,(res)=>{
                    if (res && res.length > 0) {
                        this.flatList && this.flatList.setData(res, 0);
                    }else{}
                },(err)=>{
                });
                console.error(error);
            });
    }
    dealWithLongArray = (dataArray) => {
       // let waitDealArray = this.state.data.concat(dataArray);
        let waitDealArray = dataArray.concat(this.state.data);
        if (waitDealArray.length >= 50) {
         //   waitDealArray = waitDealArray.slice(waitDealArray.length - 50, waitDealArray.length);
            waitDealArray = waitDealArray.slice(0, 50);
            console.log('处理过的array', waitDealArray);
        }
        return waitDealArray;
    }
    refreshing = () => {
        console.log(123)
        if (this.props.index === global.activeTab){
            this.flatList.scrollToOffset({ offset: 0, animated: true });
            this.flatList.BeginRefresh();
            //this.loadData()
            setTimeout(this.flatList.StopRefresh,1000);
         //   this.flatList.StopRefresh();
            //this.flatList.scrollToIndex({animated: true,index :2});
           // this.setState({refreshing: true});
        }
    }
    ToastShow = (message) => {
        Toast.show(message, {
            duration: Toast.durations.SHORT,
            position: Toast.positions.CENTER,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
        });
    }
    PostThumb = (item,dotop,index) => {
      //  {classid:2,id:2,dotop:1,doajax:1,ajaxarea:'diggnum'dotop这个字段 传0 是踩 传1是赞}
        let url = '';
        if (dotop === 0){
            url = urlConfig.baseURL + urlConfig.thumbDownUrl;
        }else if (dotop === 1){
            url = urlConfig.baseURL + urlConfig.thumbUpUrl;
        }
      //不用formdate后台解析不出来
        let formData = new FormData();
        formData.append("id",item.id);
        formData.append("classid",item.classid);
        formData.append("dotop",''+dotop);
        formData.append("doajax",''+1);
        formData.append("ajaxarea","diggnum");
        fetch(url, {
            method: 'POST',
            headers: {
            },
            body: formData
        }).then((respond)=>{
            console.log('XXX',respond._bodyInit);
            let message = '';
            let array = respond._bodyInit.split('|');
            if (array.length > 0) {
                message = array[array.length - 1];
            }
            this.ToastShow(message);
        }).catch((error)=>{console.log(error);
            this.ToastShow('失败');
        });

    }
  //ref={(c) => {this.refTextArray.push(c)}}
//<Text style={{color: '#D3D3D3', marginLeft: 10}}>{formatData(item.newstime)}</Text>
   // item.smalltext && item.smalltext.replace(/\s+/g, "")
    _renderItem = ({item, index}) => {

        return (
            <TouchableOpacity activeOpacity={1} onPress={() => {
                {/*this.refTextArray[index].setNativeProps({*/}
                    {/*style: {color: '#D3D3D3'}*/}
                {/*});*/}
               // this.props.navigation.navigate('Detail', {data: this.state.data[index]});
            }}>
                <View>
                    <View style={{backgroundColor: 'white',marginHorizontal:15,marginTop:15}}>
                        <Text style={{
                            fontSize: 16,
                            lineHeight: 24,
                            color:'black',
                        }} >{item.smalltext && item.smalltext.replace(/^\r+|\n+$/g,"")}</Text>
                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: 10,
                                marginBottom:10,
                                justifyContent: 'space-between',
                            }}>
                            <View style={{flexDirection: 'row'}}>
                                {(this.props.data.classid === '0' || this.props.data.classid === '1') ? <Text style={{
                                    paddingHorizontal: 6,
                                    paddingVertical: 2,
                                    borderWidth: 1,
                                    borderRadius: 10
                                }} onPress={() => {
                                    this.props.pageNumber(parseInt(item.classid))
                                }}>{item.classname && item.classname}</Text> : <View/>}
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <View style={{flexDirection: 'row'}}>
                                    <TouchableOpacity activeOpacity={1} onPress={()=>{this.PostThumb(item,1,index)}} hitSlop={{left:10,right:10,top:10,bottom:10}}>
                                        <Image style={{width: 20, height: 20}} source={require('../assets/up.png')}/>
                                    </TouchableOpacity>
                                    <Text style={{marginLeft: 5}}>{item.diggtop && item.diggtop}</Text>
                                </View>
                                <View style={{flexDirection: 'row', marginLeft: 10}}>
                                    <TouchableOpacity activeOpacity={1} onPress={()=>{this.PostThumb(item,0,index)}} hitSlop={{left:10,right:10,top:10,bottom:10}}>
                                        <Image style={{width: 20, height: 20}} source={require('../assets/down.png')}/>
                                    </TouchableOpacity>
                                    <Text style={{marginLeft: 5}}>{item.diggbot && item.diggbot}</Text>
                                </View>
                            </View>

                        </View>
                    </View>
                    <View style={{height: 1, backgroundColor: '#eee'}}></View>
                </View>
            </TouchableOpacity>
        )
    }

// <PullList
// type = "wait"
// style={{height:HEIGHT-SCALE(94)}}
// ref={(list)=> this.ultimateListView = list}
// onPullRelease={this.onPullRelease}
// onEndReached={this.loadMore}
// renderItem={this.renderRowView}
// numColumns={1}
// initialNumToRender={5}
// key={'list'}
// />
    onPullRelease = async (resolve) => {
        this.loadData(resolve);
    };
    loadMore = async()=>{
        if (this.props.index !== 1) {
            return;
        }

        let url = '';
        if (!this.props.data) {
            return;
        }
        switch (this.props.data.classid) {
            case '0':
                url = urlConfig.baseURL + urlConfig.newList;
                break;
            case '1':
                url = urlConfig.baseURL + urlConfig.randomList + '&page=' + 20;
                break;
            default:
                url = urlConfig.baseURL + urlConfig.sectionListData + '&classid=' + this.props.data.classid;
        }
        fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('XXX',responseJson);
                if (responseJson.status === '1') {
                    this.flatList && this.flatList.addData(this.dealWithLongArray(responseJson.result));
                }else{
                    Toast.show(responseJson.message, {
                        duration: Toast.durations.SHORT,
                        position: Toast.positions.CENTER,
                        shadow: true,
                        animation: true,
                        hideOnPress: true,
                        delay: 0,
                    });
                }
            })
            .catch((error) => {
                console.error(error);
            });

    };
//     //   <PullList
//     //  data={this.state.data}
//     keyExtractor={this._keyExtractor}
// onPullRelease={this.onPullRelease}
// renderItem={this._renderItem}
// onEndReached={this.loadMore}
// style={{backgroundColor: 'white'}}
// ref={(c) => {this.flatList = c}}
// ifRenderFooter={this.props.index !== 1 ? false : true}
//
// />
    _keyExtractor = (item, index) => index;
    render() {
        return (
            <View style={{flex: 1}} >
                <PullList
                  //  data={this.state.data}
                    keyExtractor={this._keyExtractor}
                    onPullRelease={this.onPullRelease}
                    renderItem={this._renderItem}
                    onEndReached={this.loadMore}
                    style={{backgroundColor: 'white'}}
                    ref={(c) => {this.flatList = c}}
                    ifRenderFooter={this.props.index !== 1 ? false : true}

                />
                {this.state.loadNewData ? <View style={{
                    height: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#C9E4F7',
                    position:'absolute',
                    left:0,
                    right:0,
                    top:0
                }}>
                    <Text style={{color: '#4884BE'}}>{this.updateNumMessage}</Text>
                </View> : <View/>}

            </View>
        );
    }
}
const styles = StyleSheet.create({
    base: {
        flex: 1
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#FFF'
    },
    spinner: {
        width: WIDTH,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.65)'
    },
    spinnerContent: {
        justifyContent: 'center',
        width: WIDTH,
        backgroundColor: '#fcfcfc',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
    spinnerTitle: {
        fontSize: 14,
        color: '#313131',
        textAlign: 'center',
        marginTop: 5
    },
    shareParent: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10
    },
    shareContent: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    shareIcon: {
        width: 40,
        height: 40
    }
});