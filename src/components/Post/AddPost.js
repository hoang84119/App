import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ToastAndroid
} from "react-native";
import {
  RichTextEditor,
  RichTextToolbar
} from "react-native-zss-rich-text-editor";
import Feather from "react-native-vector-icons/Feather";
import Base64 from '../../config/Base64';

var ImagePicker = require("react-native-image-picker");

var options = {
  title: "Chọn hình ảnh",
  customButtons: [{ name: "tv", title: "Chọn ảnh từ thư viện của bạn" }],
  storageOptions: {
    skipBackup: true,
    path: "images"
  },
  takePhotoButtonTitle: "Máy ảnh",
  chooseFromLibraryButtonTitle: null,
  cancelButtonTitle: "Hủy"
};

class AddPost extends Component {
  constructor(props) {
    super(props);
    this.getHTML = this.getHTML.bind(this);
    this.setFocusHandlers = this.setFocusHandlers.bind(this);
  }

  async getHTML() {
    const titleHtml = await this.richtext.getTitleHtml();
    const contentHtml = await this.richtext.getContentHtml();
    alert(titleHtml + " " + contentHtml);
  }

  static navigationOptions = ({ navigation }) => {
    //let headerTitle = navigation.state.params.title;
    const { params = {} } = navigation.state;
    let headerRight = (
      <TouchableOpacity onPress={() => params.onAdd()} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Feather style={myStyle.icon} name="save" size={24} />
      </TouchableOpacity>
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
        this.props.navigation.navigate("main");
      } else Alert.alert("Lỗi", "Thất bại");
    });
  }

  componentDidMount() {
    this.props.navigation.setParams({
      onAdd: this._onAdd.bind(this),
      isAdding: false
    });
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
    return (
      <View style={myStyle.container}>
        <RichTextEditor
          ref={r => (this.richtext = r)}
          style={myStyle.richText}
          titlePlaceholder={"Tiêu đề bài viết"}
          contentPlaceholder={"Nội dung bài viết"}
        />
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

                this.props.navigation.navigate("scmedia", { src: "thembaiviet" , check: 1});
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

          getEditor={() => this.richtext} />
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
    backgroundColor: "#ffffff",
    paddingTop: 15
  },
  richText: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  },
  icon: { marginLeft: 5, marginRight: 10, color: "#fff" },
});

export default AddPost;
