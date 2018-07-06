import React, { Component } from "react";
import {
  ToastAndroid,
  Alert,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions
} from "react-native";
import ImageZoom from "react-native-image-pan-zoom";
import API from "../../config/API";
import PinchZoomView from "react-native-pinch-zoom-view";

export default class MediaDetail extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let headerRight = (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity onPress={() => params.onDelete()}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginRight: 15 }}>
            Xóa
          </Text>
        </TouchableOpacity>
        {navigation.getParam("src", 0) === "chinhsua" && (
          <TouchableOpacity onPress={() => params.comeBack()}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginRight: 10 }}>
              Chọn
            </Text>
          </TouchableOpacity>
        )}
        {navigation.getParam("src", 0) === "thembaiviet" && (
          <TouchableOpacity onPress={() => params.comeBack()}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginRight: 10 }}>
              Chọn
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
    return { headerRight };
  };
  _onDelete() {
    Alert.alert(
      "Thông báo",
      "Bạn có thật sự muốn xóa ''" + this.state.ten + "'' không?",
      [
        {
          text: "Xóa",
          onPress: () => {
            fetch(
              API.getURL() +
                "/thuctap/wp-json/wp/v2/media/" +
                this.props.navigation.getParam("id", "") +
                "?force=true",
              {
                headers: {
                  Authorization:
                    "Basic " +
                    Base64.btoa("admin:yEgN NbO6 w6k3 vSuU xBjV E8Ok") //MK: SO1H sjHe BmAm jzX1 wQZc 5LlD
                },
                method: "DELETE"
              }
            ).then(response => {
              var t = response.status;
              if (response.status == 200) {
                ToastAndroid.show("Xóa thành công !", ToastAndroid.LONG);
                this.props.navigation.navigate("scmedia");
              } else Alert.alert("Cảnh báo", "Xóa thất bại!");
            });
          }
        },
        { text: "Hủy", style: "cancel" }
      ],
      { cancelable: false }
    );
  }
  _comeBack() {
    //Alert.alert("T", this.state.hinhanh.replace("http://localhost", API.getURL()));
    this.props.navigation.navigate(`${this.props.navigation.getParam("src")}`, {
      srcImage: this.state.hinhanh.replace("http://localhost", API.getURL())
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      ten: "",
      hinhanh: "",
      width: 0,
      height: 0,
      link: ""
      //check: this.props.navigation.getParam("checkMedia", 0),
      //refreshing: true
    };
  }
  async loadData() {
    fetch(
      API.getURL() +
        "/thuctap/wp-json/wp/v2/media/" +
        this.props.navigation.getParam("id", "")
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson == null) {
          Alert.alert("Lỗi", "Không có nội dung");
        } else {
          this.setState({
            ten: responseJson.title.rendered,
            hinhanh: responseJson.guid.rendered,
            height: responseJson.media_details.height,
            width: responseJson.media_details.width
          });
        }
      });
  }
  componentDidMount() {
    this.loadData();
    this.props.navigation.setParams({
      comeBack: this._comeBack.bind(this),
      onDelete: this._onDelete.bind(this)
    });
    //alert(this.props.navigation.getParam("src","rong"))
  }
  render() {
    console.log(this.state);
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000"
        }}
      >
        <PinchZoomView>
          <Image
            style={{
              width: Dimensions.get("window").width,
              height:
                (Dimensions.get("window").width * this.state.height) /
                this.state.width
            }}
            //resizeMode="center"
            source={{
              uri: `${this.state.hinhanh.replace(
                "http://localhost",
                API.getURL()
              )}`
            }}
          />
        </PinchZoomView>
      </View>
    );
  }
}
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
