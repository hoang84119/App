import { createStackNavigator } from "react-navigation";
import PostDetail from "../components/Post/PostDetail";
import EditPost from "../components/Post/EditPost";
import Posts from "../components/Post/Posts";
import AddPost from "../components/Post/AddPost";
import Media from "../components/Media/Media"
import MediaDetail from "../components/Media/MediaDetail"
import DangNhap from '../components/User/DangNhap'

const PostTo = createStackNavigator({
  main: {
    screen: Posts,
    navigationOptions: {
      headerTitle: "Bài viết",
      headerTitleStyle:{
        color: "#36BC63"
      },
      headerStyle: {
        height:46,
        alignItems: "center",
      },
      tabBarVisible: true
    }
  },
  chitiet: {
    screen: PostDetail,
    navigationOptions: {
      headerTitle: "Chi tiết bài viết",
      headerStyle: {
        height:46
      }
    }
  },
  chinhsua: {
    screen: EditPost,
    navigationOptions: {
      headerTitle: "Chỉnh sửa",
      headerStyle: {
        height:46
      }
    }
  },
  thembaiviet: {
    screen: AddPost,
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
  },
  login:{
    screen: DangNhap,
    navigationOptions: {
      headerStyle: {
        height:0
      }
    }
  }
},
{
  headerMode: 'none',
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
