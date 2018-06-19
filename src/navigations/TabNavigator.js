import React from 'react';
import PostTo from "./PostTo";
import Media from "../components/Media";
import Account from "../components/Account";
import { TabNavigator, TabBarBottom } from "react-navigation";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Image } from "react-native";


export default TabNavigator(
  {
    Post: {screen: PostTo},
    Media: {screen: Media},
    User: {screen: Account}
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({focused,tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === "Post") {
          iconName = `ios-book${focused ? '' : '-outline'}`;
        } else if (routeName === "Media") {
          iconName = `ios-albums${focused ? '' : '-outline'}`;
        } else if (routeName === "User") {
          iconName = `ios-contact${focused ? '' : '-outline'}`;
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Ionicons name={iconName} size={20} color={tintColor} />;
      }
    }),
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    tabBarOptions: {
      activeTintColor: "#36BC63",
      inactiveTintColor: "gray",
      style: {height:40}
    },
    animationEnabled: true,
    swipeEnabled: true,
  }
);
