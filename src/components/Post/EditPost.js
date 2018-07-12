import React, { Component } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  Alert,
  ToastAndroid,
  TouchableOpacity
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

class EditPost extends Component {
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
        <Feather style={myStyle.icon} name="save" size={24} />
      </TouchableOpacity>
    );
    return { headerRight };
  };

  componentDidMount() {
    this.props.navigation.setParams({
      onSave: this._onSave.bind(this),
      isSaving: false
    });
    this.loadData();

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
        <Modal ref={"myModal"} style={myStyle.modal} position="bottom" onRequestClose={() => null}>
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
        {this.state.loaded && (
          <RichTextEditor
            ref={r => (this.richtext = r)}
            style={myStyle.richText}
            initialTitleHTML={this.state.noidung.title.rendered}
            initialContentHTML={this.state.noidung.content.rendered.replace(
              "http://localhost/thuctap",
              API.getURL()
            )}
          />
        )}
        {this.state.loaded && (
          <RichTextToolbar
            onPressAddImage={() => {
              this.refs.myModal.open();
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

  async _onSave() {
    if (this.props.navigation.state.params.isSaving == true) return;
    this.props.navigation.setParams({ isSaving: true });
    //var formData = new FormData();
    let id = this.props.navigation.getParam("id", "");
    let title = await this.richtext.getTitleHtml();
    let content = await this.richtext.getContentHtml();
    // formData.append("title", title);
    // formData.append("content", content);
    // fetch(
    //   API.getURL() +
    //     "/wp-json/wp/v2/posts/" +
    //     this.props.navigation.getParam("id", ""),
    //   {
    //     headers: {
    //       Authorization:
    //         "Basic " + Base64.btoa("admin:yEgN NbO6 w6k3 vSuU xBjV E8Ok") //MK135: yEgN NbO6 w6k3 vSuU xBjV E8Ok
    //     },
    //     body: formData,
    //     method: "POST"
    //   }
    // )
    API.Post.Save(id,title,content).then(response => {
      if (response) {
        ToastAndroid.show("Lưu thành công", ToastAndroid.LONG);
        this.props.navigation.navigate("main");
      } else {
        ToastAndroid.show(response.message, ToastAndroid.LONG);
        this.props.navigation.setParams({ isSaving: false });
      }
    });
  }

  async loadData() {
    fetch(
      API.getURL() +
        "/wp-json/wp/v2/posts/" +
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

  _openCamera = async () => {
    let image = await ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true
    });
    await this._uploadImage(image);
    this.refs.myModal.close();
  };

  _openPicker = async () => {
    let images = await ImagePicker.openPicker({
      multiple: true,
      mediaType: "photo"
    });
    for (let item of images) {
      await this._uploadImage(item);
    }
    this.refs.myModal.close();
  };

  _openLibraryWP = () => {
    this.props.navigation.navigate("scmedia", {
      src: "chinhsua",
      check: 1
    });
  };

  _uploadImage = async item => {
    var file = {
      uri: item.path,
      name: item.path.replace(/^.*[\\\/]/, ""),
      type: item.mime
    };
    await API.Image.UploadImage(file).then(pathImage => {
      if (pathImage != "") {
        pathImage = pathImage.replace("http://localhost/thuctap", API.getURL());
        this.richtext.insertImage({ src: pathImage });
      }
    });
  };
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

export default EditPost;
//export default connect()(CTBaiBao);
