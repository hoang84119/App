import { createStackNavigator } from "react-navigation";
import Tags from "../components/Tag/Tags";
import EditTag from "../components/Tag/EditTag";
import AddTag from "../components/Tag/AddTag";
import PostTo from "./PostTo"

const TagTo = createStackNavigator({
    Tags: {
    screen: Tags
  },
  EditTag: {
    screen: EditTag,
    navigationOptions: {
      headerTitle: "Chỉnh sửa thẻ"
    }
  },
  AddTag: {
    screen: AddTag,
    navigationOptions: {
      headerTitle: "Thêm thẻ"
    }
  },
  Posts: {
    screen: PostTo,
    navigationOptions:{
      header:null
    }
  }
});

//cài đặt để ẩn thanh tab khi vào màn hình con
TagTo.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible
  };
};

export default TagTo;
