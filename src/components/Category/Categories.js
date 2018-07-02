import React, { Component } from "react";
import {
  StatusBar,
  Alert,
  FlatList,
  View,
  TouchableOpacity,
  ToastAndroid,
  Text,
  StyleSheet
} from "react-native";
import API from "../../config/API";
import Feather from "react-native-vector-icons/Feather";
import ItemCategory from "./items/ItemCategory";
import { connect } from "react-redux";

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: "",
      refreshing: true
    };
  }
  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    this.props.navigation.addListener("didFocus", () => {
      this._loadData();
    });
  }
  render() {
    let ButtonRight =
      this.props.dataUser.name === "admin" ? (
        <View style={myStyle.buttons}>
          <TouchableOpacity onPress={() => this._onAdd()}>
            <Feather style={myStyle.icon} name="plus" size={30} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this._onLogout()}>
            <Feather style={myStyle.icon} name="log-out" size={22} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={myStyle.buttons}>
          <TouchableOpacity onPress={() => this._onLogin()}>
            <Feather style={myStyle.icon} name="user" size={26} />
          </TouchableOpacity>
        </View>
      );
    return (
      <View style={myStyle.container}>
        <StatusBar translucent backgroundColor="rgba(0, 0, 0, 0)" animated />
        <View style={{ backgroundColor: "#0ABFBC" }}>
          <View style={{ height: StatusBar.currentHeight }} />
          {/* Thanh bar */}
          <View style={myStyle.headerTitleBar}>
            <View style={myStyle.headerTitle}>
              <Text style={myStyle.title}>Chuyên mục</Text>
            </View>
            {ButtonRight}
          </View>
        </View>

        {/* Noi dung */}
        <FlatList
          style={myStyle.item}
          refreshing={this.state.refreshing}
          onRefresh={() => this._loadData()}
          data={this.state.data}
          keyExtractor={(item, index) => item.id}
          renderItem={({ item }) =>
            item.parent === 0 && (
              <ItemCategory
                data={item}
                navigation={this.props.navigation}
                delete={this._delete}
                userName={this.props.dataUser.name}
                level={0}
              />
            )
          }
        />
      </View>
    );
  }

  _loadData() {
    this.setState({ refreshing: true });
    fetch(API.getURL() + "/thuctap/wp-json/wp/v2/categories")
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson == null) {
          Alert.alert("Lỗi", "Không có nội dung");
        } else {
          this.setState({ data: responseJson, refreshing: false });
        }
      });
  }

  _onAdd() {
    this.props.navigation.navigate("AddCategory");
  }

  _delete = (i, t) => {
    Alert.alert(
      "Thông báo",
      "Bạn có thật sự muốn xóa ''" + t + "'' không?",
      [
        {
          text: "Xóa",
          onPress: () => {
            API.Category.Remove(i).then(response => {
              if (response === true) {
                ToastAndroid.show("Xóa thành công !", ToastAndroid.LONG);
                this._loadData();
              } else Alert.alert("Cảnh báo", "Xóa thất bại!");
            });
          }
        },
        { text: "Hủy", style: "cancel" }
      ],
      { cancelable: false }
    );
  };
}
const myStyle = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  icon: {
    marginLeft: 5,
    marginRight: 5,
    color: "#fff"
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end"
  },
  headerTitleBar: {
    flexDirection: "row",
    shadowColor: "#efefef",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.1,
    elevation: 3,
    zIndex: 0
  },
  headerTitle: {
    paddingLeft: 10,
    alignItems: "center",
    height: 50,
    //justifyContent: "center",
    flexDirection: "row",
    flex: 4
  },
  title: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold"
  },
});

function mapStateToProps(state) {
  return { dataUser: state.dataUser };
}
export default connect(mapStateToProps)(Categories);
