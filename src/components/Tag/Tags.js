import React, { Component } from "react";
import {
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
import ItemTag from "./item/ItemTag";
import { connect } from "react-redux";

class Tags extends Component {
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
            <Feather style={myStyle.icon} name="plus" size={34} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this._onLogout()}>
            <Feather style={myStyle.icon} name="log-out" size={24} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={myStyle.buttons}>
          <TouchableOpacity onPress={() => this._onLogin()}>
            <Feather style={myStyle.icon} name="user" size={34} />
          </TouchableOpacity>
        </View>
      );
    return (
      <View style={myStyle.container}>
        {/* Thanh bar */}
        <View style={myStyle.headerTitleBar}>
          <View style={myStyle.headerTitle}>
            <Text style={myStyle.title}>Thẻ</Text>
          </View>
          {ButtonRight}
        </View>

        {/* Noi dung */}
        <FlatList
          style={myStyle.item}
          refreshing={this.state.refreshing}
          onRefresh={() => this._loadData()}
          data={this.state.data}
          keyExtractor={(item, index) => item.id}
          renderItem={({ item }) => (
            <ItemTag
              data={item}
              navigation={this.props.navigation}
              delete={this._delete}
              userName={this.props.dataUser.name}
            />
          )}
        />
      </View>
    );
  }

  _loadData() {
    this.setState({ refreshing: true });
    fetch(API.getURL() + "/thuctap/wp-json/wp/v2/tags")
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson == null) {
          ToastAndroid.show("Không có nội dung", ToastAndroid.LONG);
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
            API.RemoveCategory(i).then(response => {
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
  icon: { marginLeft: 5, marginRight: 10, color: "#088A4B" },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end"
  },
  headerTitleBar: {
    backgroundColor: "#fff",
    borderBottomColor: "#fafafa",
    borderBottomWidth: 1,
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
    height: 45,
    justifyContent: "center",
    flexDirection: "row",
    flex: 4
  },
  title: { fontSize: 18, color: "#000", fontWeight: "bold" },
  item:{marginTop: 5}, 
});

function mapStateToProps(state) {
  return { dataUser: state.dataUser };
}
export default connect(mapStateToProps)(Tags);
