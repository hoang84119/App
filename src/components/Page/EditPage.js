import React, { Component } from "react";
import {
  ActivityIndicator, View, Text, StyleSheet, Alert, Image, ToastAndroid, TouchableOpacity
} from "react-native";
import { RichTextEditor, RichTextToolbar } from "react-native-zss-rich-text-editor";
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
  cancelButtonTitle: "Hủy",
};

class EditPage extends Component {
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
        "/thuctap/wp-json/wp/v2/pages/" +
        this.props.navigation.getParam("id", ""),
      {
        headers: {
          Authorization:
            "Basic " + Base64.btoa("admin:yEgN NbO6 w6k3 vSuU xBjV E8Ok")//MK135: yEgN NbO6 w6k3 vSuU xBjV E8Ok
        },
        body: formData,
        method: "POST"
      }
    ).then(response => {
      var t = response.status;
      if (response.status == "200") {
        ToastAndroid.show("Lưu thành công", ToastAndroid.LONG);
        //this.props.dispatch({type:'RefreshPost'});
        this.props.navigation.navigate("Page");
      } else Alert.alert("Lỗi", "Thất bại");
    });
  }

  async loadData() {
    fetch(
      API.getURL() +
        "/thuctap/wp-json/wp/v2/pages/" +
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

                    this.props.navigation.navigate("scmedia", {src : "chinhsua", check: 1});
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
  },
  icon: { marginLeft: 5, marginRight: 10, color: "#fff" },
});

export default EditPage;
//export default connect()(CTBaiBao);
