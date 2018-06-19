import React, { Component } from "react";
import {
  ActivityIndicator, View, Text, StyleSheet, Alert, Image, ToastAndroid, TouchableOpacity
} from "react-native";
import { RichTextEditor, RichTextToolbar } from "react-native-zss-rich-text-editor";
import IonIcon from "react-native-vector-icons/Ionicons"


var ImagePicker = require("react-native-image-picker");

var options = {
  title: "Chọn hình ảnh",
  customButtons: [{ name: "tv", title: "Chọn ảnh từ thư viện của bạn" }],
  storageOptions: {
    skipBackup: true,
    path: "images"
  },
  takePhotoButtonTitle: "Máy ảnh",
  chooseFromLibraryButtonTitle: "Chọn hình ảnh sẵn có",
  cancelButtonTitle: "Hủy"
};

class ChinhSuaBaiViet extends Component {
  constructor(props) {
    super(props);
    this.getHTML = this.getHTML.bind(this);
    this.setFocusHandlers = this.setFocusHandlers.bind(this);
    this.state = {
      noidung: [],
      loaded: false
    };
  }

  static navigationOptions = ({ navigation }) => {
    //let headerTitle = navigation.state.params.title;
    const { params = {} } = navigation.state;
    let headerRight = (
      <TouchableOpacity
        onPress={() => {
          params.onSave();
        }}
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <IonIcon style={{ marginLeft: 5, marginRight: 10, color: '#088A4B' }} name="ios-paper-outline" size={28} />
      </TouchableOpacity>
    );
    return { headerRight };
  };

  async _onSave() {
    if (this.props.navigation.state.params.isSaving == true) return;
    this.props.navigation.setParams({ isSaving: true });
    var formData = new FormData();
    let title = await this.richtext.getTitleHtml();
    let content = await this.richtext.getContentHtml();
    formData.append("title", title);
    formData.append("content", content);
    fetch(
      API.getURL() +
        "/thuctap/wp-json/wp/v2/posts/" +
        this.props.navigation.getParam("id", ""),
      {
        headers: {
          Authorization:
            "Basic " + Base64.btoa("admin:SO1H sjHe BmAm jzX1 wQZc 5LlD")//MK135: yEgN NbO6 w6k3 vSuU xBjV E8Ok
        },
        body: formData,
        method: "POST"
      }
    ).then(response => {
      var t = response.status;
      if (response.status == "200") {
        ToastAndroid.show("Lưu thành công", ToastAndroid.LONG);
        //this.props.dispatch({type:'RefreshPost'});
        this.props.navigation.navigate("main");
      } else Alert.alert("Lỗi", "Thất bại");
    });
  }

  async loadData() {
    fetch(
      API.getURL() +
        "/thuctap/wp-json/wp/v2/posts/" +
        this.props.navigation.getParam("id", "")
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson == null) {
          Alert.alert("Lỗi", "Không có nội dung");
        } else {
          this.setState({
            noidung: responseJson,
            loaded: true
          });
        }
      });
  }

  componentDidMount() {
    this.props.navigation.setParams({
      onSave: this._onSave.bind(this),
      isSaving: false
    });
    this.loadData();
    this.setState({ linkIMG: this.props.navigation.getParam("linkHA") });
    //alert(""+this.props.navigation.getParam("linkHA"))
    try {
      this.richtext.insertImage({ src: this.state.linkIMG });
      this.setState({ linkIMG: "" });
    } catch (error) {}
    this.props.navigation.addListener('willFocus', ()=>{
      let srcImage = this.props.navigation.getParam("srcImage", "");
      if(srcImage != "")
      {
        this.richtext.insertImage({ src: srcImage });
        this.props.navigation.setParams({srcImage: ""});
      }
    });
  }

  render() {
    let img =
      this.state.avatarSource == null ? null : (
        <Image
          source={this.state.avatarSource}
          style={{ height: 200, width: 200 }}
        />
      );

    return (
      <View style={myStyle.container}>
        {this.state.loaded && (
          <RichTextEditor
            ref={r => (this.richtext = r)}
            style={myStyle.richText}
            initialTitleHTML={this.state.noidung.title.rendered}
            initialContentHTML={this.state.noidung.content.rendered.replace(
              "http://localhost",
              API.getURL()
            )}
          />
        )}
        {this.state.loaded && (
          <RichTextToolbar
            onPressAddImage={() => {
              ImagePicker.showImagePicker(options, response => {
                //console.log('Response = ', response);
                if (response.didCancel) {
                  ToastAndroid.show("Đã hủy", ToastAndroid.SHORT);
                } else if (response.error) {
                  ToastAndroid.show(
                    "Lỗi Image Picker: " + response.error,
                    ToastAndroid.SHORT
                  );
                }
                else if (response.customButton) {
                    this.props.navigation.navigate("scmedia");
                }
                else {
                  var file = {
                    uri: response.uri,
                    name: response.fileName,
                    fileName: response.path,
                    type: response.type
                  };
                  API.UploadImage(file).then(pathImage => {
                    if (pathImage != "") {
                      
                      pathImage = pathImage.replace(
                        "http://localhost",
                        API.getURL()
                      );
                      this.richtext.insertImage({ src: pathImage });
                    }
                  });
                }
              });
            }}
            getEditor={() => this.richtext}
          />
        )}
        {this.state.loaded === false && (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
      </View>
    );
  }

  onEditorInitialized() {
    this.setFocusHandlers();
    this.getHTML();
  }

  async getHTML() {
    const titleHtml = await this.richtext.getTitleHtml();
    const contentHtml = await this.richtext.getContentHtml();
    var html = contentHtml;
    alert(titleHtml + " " + contentHtml);
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
    paddingTop: 15,
    backgroundColor: "#ffffff"
  },
  richText: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
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

export default ChinhSuaBaiViet;
//export default connect()(CTBaiBao);
