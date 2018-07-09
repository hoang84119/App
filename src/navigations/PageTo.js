import { createStackNavigator, Header } from "react-navigation";
import Page from "../components/Page/Page";
import EditPage from "../components/Page/EditPage";
import AddPage from "../components/Page/AddPage";
// import PostTo from "./PostTo";
import React from "react";
import { View, StatusBar } from "react-native";

const PageTo = createStackNavigator(
  {
      Page: {
      screen: Page
    },
    EditPage: {
      screen: EditPage,
      navigationOptions: {
        headerTitle: "Chỉnh sửa trang"
      }
    },
    AddPage: {
      screen: AddPage,
      navigationOptions: {
        headerTitle: "Thêm trang mới"
      }
    },
//     Posts: {
//       screen: PostTo,
//       navigationOptions: {
//         header: null
//       }
//     }
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
PageTo.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible
  };
};

export default PageTo;
