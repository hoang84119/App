import { StackNavigator } from "react-navigation";
import PostDetail from "../components/PostDetail";
import EditPost from "../components/EditPost";
import Posts from "../components/Posts";
import AddPost from "../components/Post/AddPost";
import Media from "../components/Media"
import MediaDetail from "../components/MediaDetail"

const PostTo = StackNavigator({
  main: {
    screen: Posts,
    navigationOptions: {
      headerTitle: "Bài viết",
      headerStyle: {
        height:46
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
