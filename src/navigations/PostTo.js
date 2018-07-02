import { createStackNavigator, Header } from "react-navigation";
import PostDetail from "../components/Post/PostDetail";
import EditPost from "../components/Post/EditPost";
import Posts from "../components/Post/Posts";
import AddPost from "../components/Post/AddPost";
import Media from "../components/Media/Media";
import MediaDetail from "../components/Media/MediaDetail";
import DangNhap from "../components/User/DangNhap";
//import StatusBar from '../components/StatusBar'
import React, { Component } from "react";
import { View, StatusBar } from "react-native";

const PostTo = createStackNavigator(
  {
    main: {
      screen: Posts,
      navigationOptions: {
        headerTitle: "Bài viết",
        //headerTransparent: true,
        // headerStyle: {
        //   height:46,
        //   alignItems: "center",
        // },
        // tabBarVisible: true
      }
    },
    chitiet: {
      screen: PostDetail,
      navigationOptions: {
        headerTitle: "Chi tiết bài viết",
      }
    },
    chinhsua: {
      screen: EditPost,
      navigationOptions: {
        headerTitle: "Chỉnh sửa",
      }
    },
    thembaiviet: {
      screen: AddPost,
      navigationOptions: {
        headerTitle: "Thêm bài viết",
        // headerStyle: {
        //   height: 46
        // },
        headerTransparent: true
      }
    },
    scmedia: {
      screen: Media,
      navigationOptions: {
        headerTitle: "Chọn hình ảnh",
        // headerStyle: {
        //   height: 50
        // }
      }
    },
    scchitiet: {
      screen: MediaDetail,
      navigationOptions: {
        headerTitle: "Chi tiết hình ảnh",
        // headerStyle: {
        //   height: 50
        // }
      }
    },
    login: {
      screen: DangNhap,
      navigationOptions: {
        headerStyle: {
          height: 0
        }
      }
    }
  },
  {
    //headerMode: <View style={{height:50, backgroundColor:"blue"}}><Text>Hello</Text></View>,
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#0ABFBC',
        elevation:0,
        tintColor:"#fff"
      },
      headerTintColor:"white",
      header: props => (
        <View style={{backgroundColor: "#0ABFBC" }}>
          <StatusBar translucent backgroundColor="rgba(0, 0, 0, 0)" animated />
          <View style={{ height: StatusBar.currentHeight}} />
          <Header {...props}/>
        </View>
      ),
      
    }
  }
);

//cài đặt để ẩn thanh tab khi vào màn hình con
PostTo.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible
  };
};

export default PostTo;
