import React from 'react';
import PostTo from "./PostTo";
import MediaTo from "./MediaTo";
//import { TabNavigator, TabBarBottom } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation";
import Ionicons from "react-native-vector-icons/Ionicons";
import TagTo from './TagTo';
import CategoryTo from './CategoryTo';
import PageTo from './PageTo'



//tạo thanh Tab
//export default TabNavigator(
  export default createBottomTabNavigator(
  {
    //Định nghĩa các màn hình 
    Post: {screen: PostTo,tabBarOptions: {tabStyle: {width:100}}},
    Media: {screen: MediaTo},
    Category:{screen:CategoryTo},
    Tag:{screen:TagTo},
    Page:{screen: PageTo}
  },
  {
    navigationOptions: ({ navigation }) => ({
      //Đặt Icon đại diện cho các màn hình
      tabBarIcon: ({focused,tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === "Post") {
          // nếu màn hình được thì nối thêm chữ -outline
          iconName = `ios-book${focused ? '' : '-outline'}`; 
        } else if (routeName === "Media") {
          iconName = `ios-image${focused ? '' : '-outline'}`;
        } else if (routeName === "Category") {
          iconName = `ios-apps${focused ? '' : '-outline'}`;
        }else if (routeName === "Tag") {
          iconName = `ios-pricetag${focused ? '' : '-outline'}`;
        }else if (routeName === "Page") {
          iconName = `ios-albums${focused ? '' : '-outline'}`;
        }
        // trả về icon
        return <Ionicons name={iconName} size={20} color={tintColor} />;
      }
    }),
    //vị trí thanh tab
    //tabBarComponent: TabBarBottom,
    //tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: "#0ABFBC", //màu khi màn hình được chọn
      inactiveTintColor: "gray", // màu khi màn hình không được chọn
      //style: {height:40},
      scrollEnabled: true,
    },
    initialRouteName: 'Post',
    animationEnabled: true,//hiệu ứng chuyển tab
    //swipeEnabled: true,// cho phép vuốt để chuyển
  }
);
