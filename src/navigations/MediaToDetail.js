import { StackNavigator } from "react-navigation";
import Media from "../components/Media"
import MediaDetail from "../components/MediaDetail"

const MediaToDetail = StackNavigator({
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

export default MediaToDetail;