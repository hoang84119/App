import { StackNavigator } from "react-navigation";
import CTBaiBao from "../components/CTBaiBao";
import ChinhSuaBaiViet from "../components/ChinhSuaBaiViet";
import DSBaiBao from "../components/DSBaiBao";
import ThemBaiViet from "../components/ThemBaiViet";
import Media from "../components/Media"
import MediaDetail from "../components/MediaDetail"
import DSBaiViet from "../components/DSBaiViet"

const PostTo = StackNavigator({
  main: {
    screen: DSBaiBao,
    navigationOptions: {
      headerTitle: "Bài viết",
      headerStyle: {
        height:40
      },
      tabBarVisible: true
    }
  },
  chitiet: {
    screen: CTBaiBao,
    navigationOptions: {
      headerTitle: "Chi tiết bài viết",
      headerStyle: {
        height:40
      }
    }
  },
  chinhsua: {
    screen: ChinhSuaBaiViet,
    navigationOptions: {
      headerTitle: "Chỉnh sửa",
      headerStyle: {
        height:40
      }
    }
  },
  thembaiviet: {
    screen: ThemBaiViet,
    navigationOptions: {
      headerTitle: "Thêm bài viết",
      headerStyle: {
        height:40
      }
    }
  },
  scmedia: {
    screen: Media,
    navigationOptions: {
      headerTitle: "Chọn hình ảnh",
      headerStyle: {
        height:40
      }
    }
  },
  scchitiet: {
    screen: MediaDetail,
    navigationOptions: {
      headerTitle: "Chi tiết hình ảnh",
      headerStyle: {
        height:40
      }
    }
  }
});

PostTo.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
  };
};

export default PostTo;
