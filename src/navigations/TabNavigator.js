import PostTo from "./PostTo";
import Media from "../components/Media";
import Account from "../components/Account";
import { createBottomTabNavigator } from "react-navigation";
import { Image } from "react-native";

export default createBottomTabNavigator(
  {
    Post: PostTo,
    Media: Media,
    User: Account
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: () => {
        const { routeName } = navigation.state;
        let srcIcon = "";
        if (routeName === "Post") {
          srcIcon = "../image/ic_post.png";
        } else if (routeName === "Media") {
          srcIcon = "../image/ic_gallery.png";
        } else if (routeName === "User") {
          srcIcon = "../image/ic_user.png";
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return (
          <Image
            source={require("../image/ic_post.png")}
            style={{ height: 26, width: 26, tintColor:"black" }}
          />
        );
      }
    }),
    tabBarOptions: {
      activeTintColor: "#36BC63",
      inactiveTintColor: "black"
    }
  }
);
