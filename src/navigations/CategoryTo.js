import { createStackNavigator } from "react-navigation";
import Categories from "../components/Category/Categories";
import EditCategory from "../components/Category/EditCategory";
import AddCategory from "../components/Category/AddCategory";

const CategoryTo = createStackNavigator({
  Categories: {
    screen: Categories
  },
  EditCategory: {
    screen: EditCategory,
    navigationOptions: {
      headerTitle: "Chỉnh sửa chuyên mục"
    }
  },
  AddCategory: {
    screen: AddCategory,
    navigationOptions: {
      headerTitle: "Thêm chuyên mục"
    }
  }
});

//cài đặt để ẩn thanh tab khi vào màn hình con
CategoryTo.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible
  };
};

export default CategoryTo;