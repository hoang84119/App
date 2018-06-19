import React, { Component } from "react";
import {
  View, Text, StyleSheet, Alert, ScrollView, Image,
  TouchableOpacity, Dimensions, PixelRatio,
  ImageBackground, ActivityIndicator
} from "react-native";
import API from "../API";
import HTML from "react-native-render-html"
import IonIcon from "react-native-vector-icons/Ionicons"

class CTBaiBao extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noidung: [],
      tacgia: [],
      loaded: false
    };
    //const { navigation } = this.props;
  }
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let headerRight = <TouchableOpacity onPress={() => {
      params.onEdit();
    }}
      style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
      {/* <Image
        style={{ width: 21, height: 21 }}
        source={require("../image/ic_edit.png")} /> */}
        <IonIcon style={{ marginLeft: 5, marginRight: 10, color: '#088A4B' }} name="ios-create-outline" size={32} />
    </TouchableOpacity>
    return { headerRight };
  };

  _onEdit() {
    this.props.navigation.navigate("chinhsua", { id: this.props.navigation.getParam("id", "") });
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
          this.setState({ noidung: responseJson });
          this.loadTacGia();
        }
      });
  }
  async loadTacGia() {
    fetch(
      API.getURL() + "/thuctap/wp-json/wp/v2/users/" + this.state.noidung.author
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson == null) {
          Alert.alert("Lỗi", "Không có nội dung");
        } else {
          this.setState({ tacgia: responseJson, loaded: true });
        }
      });
  }

  componentDidMount() {
    this.loadData();
    this.props.navigation.setParams({
      onEdit: this._onEdit.bind(this)
    });
  }

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

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.loaded == false && (
          <View style={myStyle.loadingContainer}>
            {/* <Image
              style={{ width: 32, height: 32 }}
              source={require("../image/loading.gif")}
            /> */}
            <ActivityIndicator size="large" color="#088A4B" />
            <Text style={{color: "#088A4B"}}>Đang tải</Text>
          </View>
        )
        }
        {
          this.state.loaded &&
          <ScrollView style={myStyle.container}>
            <ImageBackground
              style={{ paddingTop: 70, flex: 1, minHeight: 10, resizeMode: "cover" }}
              source={require("../image/header.png")}>
              <View style={myStyle.title}>
                {this.state.loaded && (
                  <HTML
                    html={"<span>" + this.state.noidung.title.rendered + "</span>"}
                    tagsStyles={htmlTitleStyle}
                  //stylesheet={htmlTitleStyle}
                  />
                )}
              </View>
            </ImageBackground>
            <View style={{ paddingLeft: 5, paddingRight: 5 }}>
              <View style={myStyle.content}>
                {this.state.loaded && (
                  <HTML
                    html={
                      "<i>Cập nhật lúc: <b>" +
                      this.state.noidung.modified.replace("T", "   ") +
                      "</b></i>"
                    }
                  //stylesheet={htmlTitleStyle}
                  />
                )}
                {this.state.loaded && (
                  <HTML
                    html={
                      "<i>Người đăng: <b>" + this.state.tacgia.name + "</i></b>"
                    }
                  />
                )}
              </View>
              <View style={{ alignItems: "center", flex: 1, margin: 10 }}>
                <Image
                  style={{ width: 150, height: 11 }}
                  source={require("../image/line.png")} />
              </View>
              <View style={myStyle.content}>
                {this.state.loaded && (
                  <HTML html={this.state.noidung.content.rendered
                    .replace(
                      "http://localhost",
                      API.getURL()
                    )} imagesMaxWidth={Dimensions.get('window').width - 30} />
                )}
              </View>
            </View>
          </ScrollView>
        }
      </View>
    );
  }
}
const pw = PixelRatio.getPixelSizeForLayoutSize(Dimensions.get('window').width);
const ph = PixelRatio.getPixelSizeForLayoutSize(Dimensions.get('window').height);
const htmlTitleStyle = {
  span: {
    padding: 5,
    fontWeight: "bold",
    color: "white",
    fontSize: 20
  },
  p: {
    fontSize: 18
  },
  // img: {
  //   width: 800,
  //   height: 400
  // }
};
const myStyle = StyleSheet.create({
  container: {
    flex: 1,
    //marginTop: (Platform.OS === 'ios') ? 60 : 50,
    borderWidth: 1,
    borderColor: "#dfdfdf",
    backgroundColor: "#fff",
  },
  content: {
    padding: 5,
    flex: 1
  },
  header: {
    padding: 5
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 10
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
  }
});
export default CTBaiBao;
