/**
 * Created by zhangzuohua on 2018/1/22.
 */
export default urlConfig = {
    baseURL: 'http://jianjie.92kaifa.com',
    //最新更新
    newList: '/e/extend/api/new.php?getJson=new',
   // 随机穿越
    randomList: '/e/extend/api/new.php?getJson=rand',
   //栏目列表 http://jianjie.92kaifa.com/e/api/getNewsClass.php
    sectionList:'/e/extend/api/new.php?getJson=class',
    //栏目列表数据后面拼接&classid=3
    sectionListData:'/e/extend/api/new.php?getJson=column',
    //发布地址
    pubLishUrl:'http://m.h8.vc/fromapp',
    //点赞或者踩 {classid:2,id:2,dotop:1,doajax:1,ajaxarea:'diggnum'dotop这个字段 传0 是踩 传1是赞}
    thumbUpUrl:'/e/public/digg/post/index.php',

    thumbDownUrl:'/e/public/digg/post/diggbot.php',
}
