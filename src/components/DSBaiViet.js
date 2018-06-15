import React, { Component } from "react";
import {
  Alert,
  FlatList,
  BackHandler,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ToastAndroid,
  Image,
  AsyncStorage,
  Button
} from "react-native";
import HTMLView from "react-native-htmlview";
import API from "../API";
class DSBaiBao extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noidung: "",
      refreshing: true
    };
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let headerRight = (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity onPress={() => params.onAdd()}>
          <Image
            style={{ width: 32, height: 32 }}
            source={require("../image/ic_post.png")}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => params.onLogout()}>
          <Image
            style={{ width: 32, height: 32, marginLeft: 5, marginRight: 15 }}
            source={require("../image/ic_logout.png")}
          />
        </TouchableOpacity>
      </View>
    );
    return { headerRight };
  };

  _onLogout() {
    AsyncStorage.removeItem("Cookie").then(() => {
      //this.props.navigation.navigate("login");
      //Alert.alert("Đã đăng xuất");
      ToastAndroid.show("Đã đăng xuất", ToastAndroid.LONG);
      BackHandler.exitApp();
    });
  }
  _onAdd() {
    // if (this.props.navigation.state.params.isAdding == true) return;
    // this.props.navigation.setParams({ isAdding: true });
    this.props.navigation.navigate("thembaiviet");
  }

  componentDidMount() {
    this.loadData();
    //BackHandler.addEventListener("hardwareBackPress", this.onBackButtonPress);
    this.props.navigation.setParams({
      onAdd: this._onAdd.bind(this),
      onLogout: this._onLogout.bind(this)
      //,isAdding: false
    });
  }

  async loadData() {
    this.setState({ refreshing: true });
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

  xem(i, t) {
    this.getSrcImage(t);
    this.props.navigation.navigate("chitiet", { id: i });
  }
  xoa(i, t) {
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
                  "Basic " + Base64.btoa("admin:yEgN NbO6 w6k3 vSuU xBjV E8Ok")
              },
              method: "DELETE"
            }).then(response => {
              var t = response.status;
              if (response.status == 200) {
                ToastAndroid.show("Xóa thành công !", ToastAndroid.LONG);
                this.loadData();
              } else Alert.alert("Cảnh báo", "Xóa thất bại!");
            });
          }
        },
        { text: "Hủy", style: "cancel" }
      ],
      { cancelable: false }
    );
    return true;
  }
  chinhsua(i) {
    this.props.navigation.navigate("chinhsua", { id: i });
  }
  // lấy nguồn hình ảnh từ content html
  getSrcImage(content) {
    //tìm thẻ img đầu tiên
    let indexImg = content.toString().indexOf("<img");
    //không tìm thấy trả về đường dẫn mặc định
    if (indexImg == -1)
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR95Iv69vIsfDjhtuBDIAfvKO1e5pyRMwDYXDYeWDpjnLRt5JUe";
    // tìm vị trí mở src
    let indexSrcStart = content.toString().indexOf("src", indexImg) + 5;
    //tìm vị trí đóng src
    let indexSrcEnd = content.toString().indexOf('"', indexSrcStart);
    //lấy đường dẫn
    let src = content.substring(indexSrcStart, indexSrcEnd);
    return src.replace("http://localhost", API.getURL());
  }
  // Xóa link trong nội dung
  removeLink(content) {
    //tìm thẻ img đầu tiên
    let indexLink = content.toString().indexOf("&hellip");
    //không tìm thấy trả lại nội dung
    if (indexLink == -1) return content;
    // cắt bỏ đường link
    return content.substring(0, indexLink + 8);
  }
  formatExcerpt(content) {
    //Mỗi trích đoạn chỉ lấy tối đa 100 ký tự
    //content = this.removeLink(content);
    return content.length > 100 ? content.substring(0, 100)+"...</p>" : content;
  }
  render() {
    return (
      <View style={myStyle.nen}>

      </View>
    );
  }

  refresh() {
    this.loadData();
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
const htmlStyle = StyleSheet.create({
  span: {
    color: "#088A4B",
    paddingLeft: 0,
    paddingRight: 5,
    paddingTop: 5,
    marginBottom: 0,
    fontSize: 15
  },
  p:{
    paddingRight:20
  }
});
const myStyle = StyleSheet.create({
  nen:{
    color: 'black',
    height:'800'
  }
});

const chars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const Base64 = {
  btoa: input => {
    let str = input;
    let output = "";

    for (
      let block = 0, charCode, i = 0, map = chars;
      str.charAt(i | 0) || ((map = "="), i % 1);
      output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
    ) {
      charCode = str.charCodeAt((i += 3 / 4));

      if (charCode > 0xff) {
        throw new Error(
          "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."
        );
      }

      block = (block << 8) | charCode;
    }

    return output;
  },

  atob: input => {
    let str = input.replace(/=+$/, "");
    let output = "";

    if (str.length % 4 == 1) {
      throw new Error(
        "'atob' failed: The string to be decoded is not correctly encoded."
      );
    }
    for (
      let bc = 0, bs = 0, buffer, i = 0;
      (buffer = str.charAt(i++));
      ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
        ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
        : 0
    ) {
      buffer = chars.indexOf(buffer);
    }

    return output;
  }
};

export default DSBaiBao;
