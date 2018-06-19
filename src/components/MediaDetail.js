import React, { Component } from 'react'
import {ToastAndroid, Alert, View, Text, TouchableOpacity, Image, Dimensions } from 'react-native'
import ImageZoom from 'react-native-image-pan-zoom';
import API from "../API";

export default class MediaDetail extends Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        let headerRight = (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                    onPress={() => params.onDelete()}
                >
                    {/* <Image
                        style={{ width: 32, height: 32 }}
                        source={require("../image/ic_post.png")}
                    /> */}
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Xóa</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => params.onChinhSua()}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 15, marginRight: 10 }}>Chọn hình</Text>
                </TouchableOpacity>
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
                        fetch(API.getURL() + "/thuctap/wp-json/wp/v2/media/" + this.props.navigation.getParam("id", "") + "?force=true",
                            {
                                headers: {
                                    Authorization:
                                        "Basic " + Base64.btoa("admin:SO1H sjHe BmAm jzX1 wQZc 5LlD")//MK: SO1H sjHe BmAm jzX1 wQZc 5LlD
                                },
                                method: "DELETE"
                            }).then(response => {
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
    _onChinhSua() {
        //Alert.alert("T", this.state.hinhanh.replace("http://localhost", API.getURL()));
        this.props.navigation.navigate("chinhsua", { srcImage: this.state.hinhanh.replace("http://localhost", API.getURL()) });
    }

    constructor(props) {
        super(props);
        this.state = {
            ten:'',
            hinhanh: '',
            chieurong: 0,
            chieudai: 0,
            link: ''
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
                        chieudai: responseJson.media_details.height,
                        chieurong: responseJson.media_details.width
                    });
                }
            });
    }
    componentDidMount() {
        this.loadData();
        this.props.navigation.setParams({
            onChinhSua: this._onChinhSua.bind(this),
            onDelete: this._onDelete.bind(this)
        });
    }
    render() {
        return (
            <View
                style={{ backgroundColor: 'black' }}>
                <ImageZoom
                    cropWidth={Dimensions.get('window').width}
                    cropHeight={Dimensions.get('window').height}
                    imageWidth={this.state.chieurong}
                    imageHeight={this.state.chieudai}>
                    <Image
                        style={{ flex: 1 }}
                        source={{ uri: `${this.state.hinhanh.replace("http://localhost", API.getURL())}` }} />
                </ImageZoom>
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