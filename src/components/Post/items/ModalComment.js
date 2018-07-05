import React, { Component } from "react";
import {
  Alert,
  ToastAndroid,
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity
} from "react-native";
import Modal from "react-native-modalbox";
import API from "../../../config/API";
import Base64 from "../../../config/Base64";
import PostDetail from "../PostDetail";

var screen = Dimensions.get("window");
export default class ModalComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      content: ""
    };
  }
  showModal = () => {
    this.refs.myModal.open();
  };
  render() {
    return (
      <Modal
        ref={"myModal"}
        style={{
          justifyContent: "center",
          borderRadius: 15,
          shadowRadius: 10,
          width: screen.width - 80,
          height: 330
        }}
        position="center"
        backdrop={true}
        onClosed={() => {
          this.props.parent.setState({isComment:false})
        }}
      >
        <View style={{ padding: 15 }}>
          <Text
            style={{
              marginBottom: 12,
              marginTop: 8,
              fontSize: 23,
              color: "mediumseagreen"
            }}
          >
            Bình luận
          </Text>
          <TextInput
            placeholderTextColor="#cfcfcf"
            underlineColorAndroid="rgba(0,0,0,0)"
            style={myStyle.ctmInput}
            onChangeText={n => {
              this.setState({ name: n });
            }}
            placeholder="(*)Tên của bạn"
          />
          <TextInput
            placeholderTextColor="#cfcfcf"
            underlineColorAndroid="rgba(0,0,0,0)"
            style={myStyle.ctmInput}
            onChangeText={e => {
              this.setState({ email: e });
            }}
            placeholder="(*)Email của bạn"
          />
          <TextInput
            placeholderTextColor="#cfcfcf"
            underlineColorAndroid="rgba(0,0,0,0)"
            multiline={true}
            style={myStyle.ctmInputContent}
            onChangeText={c => {
              this.setState({ content: c });
            }}
            placeholder="(*)Nội dung bình luận"
          />
          <View style={{ marginTop: 20 }}>
            <Text
              style={{ marginBottom: -35, color: "red", fontStyle: "italic" }}
            >
              Chú ý: (*) Bắt buộc
            </Text>
            <View style={{ alignItems: "flex-end" }}>
              <TouchableOpacity
                style={myStyle.ctmBottom}
                onPress={this._comment}
              >
                <Text style={{ color: "white", fontSize: 18 }}>
                  {" "}
                  Bình luận{" "}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
  _comment = () => {
    let { name, email, content } = this.state;
    this.props.parent._upLoadComment(name, content, email);
    this.refs.myModal.close();
  };
}
const myStyle = StyleSheet.create({
  ctmBottom: {
    marginBottom: 10,
    marginTop: 3,
    borderRadius: 10,
    //fontSize: 20,
    padding: 10,
    backgroundColor: "mediumseagreen",
    //textAlign: "center"
  },
  ctmInputContent: {
    height: 100,
    backgroundColor: "#fafafa",
    fontSize: 18,
    paddingTop: 1,
    paddingBottom: 1,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 10,
    marginBottom: 5
  },
  ctmInput: {
    backgroundColor: "#fafafa",
    fontSize: 18,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 10,
    marginBottom: 5
  }
});
