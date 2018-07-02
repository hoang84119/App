import React, { Component } from "react";
import {
  Alert,
  StatusBar,
  FlatList,
  BackHandler,
  View,
  TouchableOpacity,
  ToastAndroid,
  AsyncStorage,
  Text,
  StyleSheet
} from "react-native";
import API from "../../config/API";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import ItemPost from "./items/ItemPost";
import Base64 from "../../config/Base64";
import { connect } from "react-redux";
import Feather from "react-native-vector-icons/Feather";

class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noidung: "",
      refreshing: true,
      featured_media: "",
      empty: false
    };
  }
  static navigationOptions = ({ navigation }) => {
    //let headerTitle = "Thêm chuyên mục";
    let header;
    let headerTitle;
    let idCategory = navigation.getParam("idCategory", "");
    let idTag = navigation.getParam("idTag", "");
    if (idCategory != "") {
      headerTitle = navigation.getParam("nameCategory", "");
    } else if (idTag != "") {
      headerTitle = navigation.getParam("nameTag", "");
    } else header = null;
    return { header, headerTitle };
  };

  // static navigationOptions = {
  //   header: null,
  // };

  componentDidMount() {
    //this._loadData();
    //BackHandler.addEventListener("hardwareBackPress", this.onBackButtonPress);
    if (this.props.dataUser.name === "admin")
      this.props.navigation.addListener("didFocus", () => {
        this._loadData();
      });
    else this._loadData();
    // this.props.navigation.setParams({
    //   onAdd: this._onAdd.bind(this),
    //   onLogout: this._onLogout.bind(this),
    //   onLogin: this._onLogin.bind(this),
    //   userName: this.props.dataUser.name
    //   //,isAdding: false
    // });
  }

  render() {
    if (
      this.props.navigation.getParam("idCategory", "") == "" &&
      this.props.navigation.getParam("idTag", "") == ""
    )
      var headerBar = (
        <View style={myStyle.headerTitleBar}>
          <View style={myStyle.headerTitle}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.openDrawer();
              }}
            >
              <Feather style={myStyle.icon} name="menu" size={25} />
            </TouchableOpacity>
            <Text style={myStyle.title}>Bài viết</Text>
          </View>
          {this.props.dataUser.name === "admin" && (
            <TouchableOpacity style={myStyle.buttons} onPress={() => this._onAdd()}>
              <Feather style={myStyle.icon} name="plus" size={34} />
            </TouchableOpacity>
          )}
        </View>
      );
    return (
      <View style={myStyle.container}>
        <View style={{ backgroundColor: "#0ABFBC" }}>
          <StatusBar translucent backgroundColor="rgba(0, 0, 0, 0)" animated />
          <View style={{ height: StatusBar.currentHeight }}></View>
          {/* Thanh bar */}
          {headerBar}
        </View>
        {this.state.empty && (
          <Text style={myStyle.empty}>Không có nội dung</Text>
        )}

        {/* Noi dung */}

        <FlatList
          style={myStyle.item}
          refreshing={this.state.refreshing}
          //refreshing={this.props.refreshing}
          onRefresh={() => this.refresh()}
          data={this.state.noidung}
          keyExtractor={(item, index) => item.id}
          renderItem={({ item }) => (
            <ItemPost
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

  _delete = (i, t) => {
    Alert.alert(
      "Thông báo",
      "Bạn có thật sự muốn xóa ''" + t + "'' không?",
      [
        {
          text: "Xóa",
          onPress: () => {
            fetch(API.getURL() + "/thuctap/wp-json/wp/v2/posts/" + i, {
              headers: {
                Authorization:
                  "Basic " + Base64.btoa("admin:yEgN NbO6 w6k3 vSuU xBjV E8Ok") //MK: SO1H sjHe BmAm jzX1 wQZc 5LlD
              },
              method: "DELETE"
            }).then(response => {
              if (response.status == 200) {
                ToastAndroid.show("Xóa thành công !", ToastAndroid.LONG);
                this.refresh();
              } else Alert.alert("Cảnh báo", "Xóa thất bại!");
            });
          }
        },
        { text: "Hủy", style: "cancel" }
      ],
      { cancelable: false }
    );
  };

  refresh() {
    this._loadData();
  }

  _loadData() {
    this.setState({ refreshing: true });
    //this.props.dispatch({type:'RefreshPost'});
    let url = API.getURL() + "/thuctap/wp-json/wp/v2/posts";
    let idCategory = this.props.navigation.getParam("idCategory", "");
    let idTag = this.props.navigation.getParam("idTag", "");
    if (idCategory != "") url = `${url}?categories=${idCategory}`;
    else if (idTag != "") url = `${url}?tags=${idTag}`;
    fetch(url)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.length === 0) {
          this.setState({ empty: true, refreshing: false });
        } else {
          this.setState({ noidung: responseJson, refreshing: false });
        }
      });
  }

  _onLogin() {
    this.props.navigation.navigate("login");
  }

  _onLogout() {
    AsyncStorage.removeItem("Base64").then(() => {
      this.props.dispatch({
        type: "DeleteDataUser"
      });
      ToastAndroid.show("Đã đăng xuất", ToastAndroid.LONG);
      //BackHandler.exitApp();
    });
  }
  _onAdd() {
    // if (this.props.navigation.state.params.isAdding == true) return;
    // this.props.navigation.setParams({ isAdding: true });
    this.props.navigation.navigate("thembaiviet");
  }

  onBackButtonPress = () => {
    Alert.alert(
      "Thoát",
      "Bạn muốn thoát không",
      [
        { text: "Đồng ý", onPress: () => BackHandler.exitApp() },
        { text: "Hủy", style: "cancel" }
      ],
      { cancelable: false }
    );
    return true;
  };
}
const myStyle = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  icon: { marginLeft: 5, marginRight: 10, color: "#fff" },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end"
  },
  headerTitleBar: {
    backgroundColor: "#0ABFBC",
    flexDirection: "row",
    zIndex: 0
  },
  headerTitle: {
    //paddingLeft: 20,
    alignItems: "center",
    height: 50,
    flexDirection: "row",
    flex: 4
  },
  title: { fontSize: 20, color: "#fff", fontWeight: "500", marginLeft: 10 },
  loading: { paddingVertical: 10 }
});

//export default Posts;

function mapStateToProps(state) {
  return { dataUser: state.dataUser };
}
export default connect(mapStateToProps)(Posts);
