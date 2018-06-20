import { StackNavigator } from "react-navigation";
import Media from "../components/Media"
import MediaDetail from "../components/MediaDetail"

const MediaTo = StackNavigator({
  scmedia: {
    screen: Media,
    navigationOptions: {
      headerTitle: "Chọn hình ảnh",
      headerStyle: {
        height:50
      }
    }
  },
  scchitiet: {
    screen: MediaDetail,
    navigationOptions: {
      headerTitle: "Chi tiết hình ảnh",
      headerStyle: {
        height:50
      }
    }
  }
});

//cài đặt để ẩn thanh tab khi vào màn hình con
MediaTo.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
  };
};

export default MediaTo;
