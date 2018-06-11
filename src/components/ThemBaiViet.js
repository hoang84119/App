import React, { Component } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  Alert,
  Button,
  ToastAndroid
} from "react-native";
import {
  RichTextEditor,
  RichTextToolbar
} from "react-native-zss-rich-text-editor";
import DSBaiBao from "./DSBaiBao";

class ThemBaiViet extends Component {
  constructor(props) {
    super(props);
    this.getHTML = this.getHTML.bind(this);
    this.setFocusHandlers = this.setFocusHandlers.bind(this);
  }

  async getHTML() {
    const titleHtml = await this.richtext.getTitleHtml();
    const contentHtml = await this.richtext.getContentHtml();
    var html = contentHtml;
    alert(titleHtml + " " + contentHtml);
  }

  static navigationOptions = ({ navigation }) => {
    //let headerTitle = navigation.state.params.title;
    const { params = {} } = navigation.state;
    let headerRight = (
      <Button
        title="Thêm"
        onPress={() => {
          params.onAdd();
        }}
      />
    );
    return { headerRight };
  };

  async _onAdd() {
    if (this.props.navigation.state.params.isAdding == true) return;
    this.props.navigation.setParams({ isAdding: true });
    var formData = new FormData();
    let title = await this.richtext.getTitleHtml();
    let content = await this.richtext.getContentHtml();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("status", "publish");
    fetch(API.getURL() + "/thuctap/wp-json/wp/v2/posts/", {
      headers: {
        Authorization:
          "Basic " + Base64.btoa("admin:yEgN NbO6 w6k3 vSuU xBjV E8Ok")
      },
      body: formData,
      method: "POST"
    }).then(response => {
      var t = response.status;
      if (response.status == 201) {
        ToastAndroid.show("Lưu thành công", ToastAndroid.LONG);
        //DSBaiBao.loadData();
        this.props.navigation.navigate("main");
      } else Alert.alert("Lỗi", "Thất bại");
    });
  }

  componentDidMount() {
    this.props.navigation.setParams({
      onAdd: this._onAdd.bind(this),
      isAdding: false
    });
  }

  render() {
    return (
      <View style={myStyle.container}>
        <RichTextEditor
          ref={r => (this.richtext = r)}
          style={myStyle.richText}
          initialTitleHTML={"Tiêu đề bài viết"}
          initialContentHTML={"Nội dung bài viết"}
        />
        <RichTextToolbar getEditor={() => this.richtext} />
      </View>
    );
  }
  onEditorInitialized() {
    this.setFocusHandlers();
    this.getHTML();
  }

  setFocusHandlers() {
    this.richtext.setTitleFocusHandler(() => {
      //alert('title focus');
    });
    this.richtext.setContentFocusHandler(() => {
      //alert('content focus');
    });
  }
}

const myStyle = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ffffff"
  },
  richText: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
    //paddingTop: 20
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

export default ThemBaiViet;
