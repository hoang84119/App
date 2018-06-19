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
        height:46
      },
      tabBarVisible: true
    }
  },
  chitiet: {
    screen: CTBaiBao,
    navigationOptions: {
      headerTitle: "Chi tiết bài viết",
      headerStyle: {
        height:46
      }
    }
  },
  chinhsua: {
    screen: ChinhSuaBaiViet,
    navigationOptions: {
      headerTitle: "Chỉnh sửa",
      headerStyle: {
        height:46
      }
    }
  },
  thembaiviet: {
    screen: ThemBaiViet,
    navigationOptions: {
      headerTitle:"Thêm bài viết",
      headerStyle: {
        height:46
      }
    }
  },
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
