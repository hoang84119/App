import React, { Component } from "react";
import {
  Alert,
  FlatList,
  BackHandler,
  View,
  TouchableOpacity,
  ToastAndroid,
  AsyncStorage,
  Text
} from "react-native";
import API from "../../config/API";
import IonIcon from "react-native-vector-icons/Ionicons";
import ItemPost from "./items/ItemPost";
import Base64 from "../../config/Base64";
import { connect } from "react-redux";

class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noidung: "",
      refreshing: true,
      featured_media: ""
    };
  }

  static navigationOptions = {
    header  : null,
  };

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
    let ButtonRight =
      this.props.dataUser.name === "admin" ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0)"
          }}
        >
          <TouchableOpacity onPress={() => this._onAdd()}>
            <IonIcon
              style={{ marginLeft: 10, marginRight: 10, color: "#088A4B" }}
              name="ios-add-outline"
              size={42}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this._onLogout()}>
            <IonIcon
              style={{ marginLeft: 5, marginRight: 10, color: "#088A4B" }}
              name="ios-log-out-outline"
              size={32}
            />
          </TouchableOpacity>
        </View>
      ) : (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "rgba(255,255,255,0)"
            }}
          >
            <TouchableOpacity onPress={() => this._onLogin()}>
              <IonIcon
                style={{ marginLeft: 10, marginRight: 10, color: "black" }}
                name="md-contact"
                size={36}
              />
            </TouchableOpacity>
          </View>
        );

    return (
      <View style={{ flex: 1}}>

        {/* Thanh bar */}
        <View style={{ backgroundColor: "#fff", borderBottomColor: "#fafafa", borderBottomWidth: 1 }}>
          <View style={{
            alignItems: "center",
            height: 45,
            justifyContent: "center",
            flexDirection: "row"
          }}>
            <Text style={{ fontSize: 18, color: "#000", fontWeight: "bold" }}>Bài viết</Text>
          </View>
          <View
            style={{
              alignItems: "center",
              height: 45,
              justifyContent: "flex-end",
              flexDirection: "row",
              marginTop: -45
            }}
          >
            {ButtonRight}
          </View>
        </View>

        {/* Noi dung */}

        <FlatList
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
    fetch(API.getURL() + "/thuctap/wp-json/wp/v2/posts")
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson == null) {
          Alert.alert("Lỗi", "Không có nội dung");
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

//export default Posts;

function mapStateToProps(state) {
  return { dataUser: state.dataUser };
}
export default connect(mapStateToProps)(Posts);
