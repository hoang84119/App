import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ToastAndroid,
  Text,
} from "react-native";
import {
  RichTextEditor,
  RichTextToolbar
} from "react-native-zss-rich-text-editor";
import Feather from "react-native-vector-icons/Feather";
import Base64 from "../../config/Base64";
import ImagePicker from "react-native-image-crop-picker";
import Modal from "react-native-modalbox";
import Ionicons from "react-native-vector-icons/Ionicons";
import API from "../../config/API";

class AddPost extends Component {
  constructor(props) {
    super(props);
    this.getHTML = this.getHTML.bind(this);
    this.setFocusHandlers = this.setFocusHandlers.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    //let headerTitle = navigation.state.params.title;
    const { params = {} } = navigation.state;
    let headerRight = (
      <TouchableOpacity
        onPress={() => params.onAdd()}
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Feather style={myStyle.icon} name="save" size={24} />
      </TouchableOpacity>
    );
    return { headerRight };
  };

  componentDidMount() {
    this.props.navigation.setParams({
      onAdd: this._onAdd.bind(this),
      isAdding: false
    });
    this.props.navigation.addListener("willFocus", () => {
      let srcImage = this.props.navigation.getParam("srcImage", "");
      if (srcImage != "") {
        this.refs.myModal.close();
        this.richtext.insertImage({ src: srcImage });
        this.props.navigation.setParams({ srcImage: "" });
      }
    });
  }

  render() {
    return (
      <View style={myStyle.container}>
        <Modal ref={"myModal"} style={myStyle.modal} position="bottom">
          <View>
            <TouchableOpacity onPress={this._openCamera} style={myStyle.button}>
              <Feather style={myStyle.iconImage} name="camera" size={20} />
              <Text style={myStyle.textImage}>Chụp ảnh</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._openPicker} style={myStyle.button}>
              <Feather style={myStyle.iconImage} name="image" size={20} />
              <Text style={myStyle.textImage}>Chọn hình từ thư viện</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this._openLibraryWP}
              style={myStyle.button}
            >
              <Ionicons
                style={myStyle.iconImage}
                name="logo-wordpress"
                size={25}
              />
              <Text style={myStyle.textImage}>
                Chọn hình từ thư viện WordPress
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <RichTextEditor
          ref={r => (this.richtext = r)}
          style={myStyle.richText}
          titlePlaceholder={"Tiêu đề bài viết"}
          contentPlaceholder={"Nội dung bài viết"}
        />
        <RichTextToolbar
          onPressAddImage={() => {this.refs.myModal.open();}}
          getEditor={() => this.richtext}
        />
      </View>
    );
  }

  async getHTML() {
    const titleHtml = await this.richtext.getTitleHtml();
    const contentHtml = await this.richtext.getContentHtml();
    alert(titleHtml + " " + contentHtml);
  }

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
  _openCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true
    }).then(image => {
      console.log(image);
      this._uploadImage(image);
    });
  };

  _openPicker = () => {
    ImagePicker.openPicker({
      multiple: true,
      mediaType: "photo"
    }).then(images => {
      images.forEach(item => {
        console.log(item);
        this._uploadImage(item);
      });
    });
  };

  _openLibraryWP = () => {
    this.props.navigation.navigate("scmedia", {
      src: "thembaiviet",
      check: 1
    });
  };

  _uploadImage = item => {
    var file = {
      uri: item.path,
      name: item.path.replace(/^.*[\\\/]/, ""),
      type: item.mime
    };
    API.Image.UploadImage(file).then(pathImage => {
      if (pathImage != "") {
        pathImage = pathImage.replace("http://localhost", API.getURL());
        this.richtext.insertImage({ src: pathImage });
      }
    });
  };
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
  modal: {
    flexDirection: "column",
    alignItems: "flex-start",
    height: 150
  },
  iconImage: {
    color: "#808080",
    marginRight: 10
  },
  textImage: { fontSize: 16 },
  button: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center"
  }
});

export default AddPost;
