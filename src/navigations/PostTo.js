import { StackNavigator } from "react-navigation";
import CTBaiBao from "../components/CTBaiBao";
import ChinhSuaBaiViet from "../components/ChinhSuaBaiViet";
import DSBaiBao from "../components/DSBaiBao";
import ThemBaiViet from "../components/ThemBaiViet";
import Media from "../components/Media"
import MediaDetail from "../components/MediaDetail"

const PostTo = StackNavigator({
  main: {
    screen: DSBaiBao,
    navigationOptions: {
      headerTitle: "Bài viết"
    }
  },
  chitiet: {
    screen: CTBaiBao,
    navigationOptions: {
      headerTitle: "Chi tiết bài viết"
    }
  },
  chinhsua: {
    screen: ChinhSuaBaiViet,
    navigationOptions: {
      headerTitle: "Chỉnh sửa"
    }
  },
  thembaiviet: {
    screen: ThemBaiViet,
    navigationOptions: {
      headerTitle: "Thêm bài viết"
    }
  },
  scmedia: {
    screen: Media,
    navigationOptions: {
      headerTitle: "Chọn hình ảnh"
    }
  },
  scchitiet: {
    screen: MediaDetail,
    navigationOptions: {
      headerTitle: "Chi tiết hình ảnh"
    }
  }
});

export default PostTo;
