import { createStackNavigator, Header } from "react-navigation";
import Media from "../components/Media/Media";
import MediaDetail from "../components/Media/MediaDetail";
import React from "react";
import { View, StatusBar } from "react-native";

const MediaTo = createStackNavigator(
  {
    scmedia: {
      screen: Media,
      navigationOptions: {
        headerTransparent: true
      }
    },
    scchitiet: {
      screen: MediaDetail,
      navigationOptions: {
        headerTitle: "Chi tiết hình ảnh",
        headerStyle: {
          height: 50
        }
      }
    }
  },
  {
    navigationOptions: {
      headerStyle: {
        backgroundColor: "#0ABFBC",
        elevation: 0,
      },
      headerTintColor: "white",
      header: props => (
        <View style={{ backgroundColor: "#0ABFBC" }}>
          <StatusBar translucent backgroundColor="rgba(0, 0, 0, 0)" animated />
          <View style={{ height: StatusBar.currentHeight }} />
          <Header {...props} />
        </View>
      )
    }
  }
);

//cài đặt để ẩn thanh tab khi vào màn hình con
MediaTo.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible
  };
};

export default MediaTo;
