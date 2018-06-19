import React, { Component } from "react";
import {
  Alert,
  FlatList,
  BackHandler,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ToastAndroid,
  Image,
  AsyncStorage,
  Button
} from "react-native";
import HTMLView from "react-native-htmlview";
import HTML from "react-native-render-html"
import API from "../API";
import IonIcon from 'react-native-vector-icons/Ionicons';
class DSBaiBao extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noidung: "",
      refreshing:true
    };
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let headerRight = (
      <View style={{ flexDirection: "row", alignItems: 'center' }}>
        <TouchableOpacity onPress={() => params.onAdd()}>
          {/* <Image
            style={{ width: 32, height: 32 }}
            source={require("../image/ic_post.png")}
          /> */}
          <IonIcon style={{ marginLeft: 10, marginRight: 10 }} name="ios-add-outline" size={42} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => params.onLogout()}>
          {/* <Image
            style={{ width: 32, height: 32, marginLeft: 5, marginRight: 15 }}
            source={require("../image/ic_logout.png")}
          /> */}
          <IonIcon style={{ marginLeft: 5, marginRight: 10 }} name="ios-log-out-outline" size={32} />
        </TouchableOpacity>
      </View>
    );
    return { headerRight };
  };

  _onLogout() {
    AsyncStorage.removeItem("Cookie").then(() => {
      //this.props.navigation.navigate("login");
      //Alert.alert("Đã đăng xuất");
      ToastAndroid.show("Đã đăng xuất", ToastAndroid.LONG);
      BackHandler.exitApp();
    });
  }
  _onAdd() {
    // if (this.props.navigation.state.params.isAdding == true) return;
    // this.props.navigation.setParams({ isAdding: true });
    this.props.navigation.navigate("thembaiviet");
  }


  componentDidMount() {
    //this.loadData();
    //BackHandler.addEventListener("hardwareBackPress", this.onBackButtonPress);
    this.props.navigation.addListener('didFocus', ()=>{
      this.loadData();
    });
    this.props.navigation.setParams({
      onAdd: this._onAdd.bind(this),
      onLogout: this._onLogout.bind(this)
      //,isAdding: false
    });
  }

  async loadData() {
    this.setState({ refreshing: true });
    //this.props.dispatch({type:'RefreshPost'});
    fetch(API.getURL() + "/thuctap/wp-json/wp/v2/posts")
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson == null) {
          Alert.alert("Lỗi", "Không có nội dung");
        } else {
          this.setState({ noidung: responseJson, refreshing: false });
          // this.setState({ noidung: responseJson});
          // this.props.dispatch({type:'DidRefreshPost'});
        }
      });
  }

  xem(i, t) {
    this.getSrcImage(t);
    this.props.navigation.navigate("chitiet", { id: i });
  }
  xoa(i, t) {
    Alert.alert(
      "Thông báo",
      "Bạn có thật sự muốn xóa ''" + t + "'' không?",
      [
        {
          text: "Xóa",
          onPress: () => {
            fetch(API.getURL() + "/thuctap/wp-json/wp/v2/posts/" + i, {
              headers: {
                Authorization:
                  "Basic " + Base64.btoa("admin:yEgN NbO6 w6k3 vSuU xBjV E8Ok")
              },
              method: "DELETE"
            }).then(response => {
              var t = response.status;
              if (response.status == 200) {
                ToastAndroid.show("Xóa thành công !", ToastAndroid.LONG);
                this.loadData();
              } else Alert.alert("Cảnh báo", "Xóa thất bại!");
            });
          }
        },
        { text: "Hủy", style: "cancel" }
      ],
      { cancelable: false }
    );
    return true;
  }
  chinhsua(i) {
    this.props.navigation.navigate("chinhsua", { id: i });
  }
  // lấy nguồn hình ảnh từ content html
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
  // Xóa link trong nội dung
  removeLink(content) {
    //tìm thẻ img đầu tiên
    let indexLink = content.toString().indexOf("&hellip");
    //không tìm thấy trả lại nội dung
    if (indexLink == -1) return content;
    // cắt bỏ đường link
    return content.substring(0, indexLink + 8);
  }
  formatExcerpt(content) {
    //Mỗi trích đoạn chỉ lấy tối đa 100 ký tự
    //content = this.removeLink(content);
    return content.length > 100 ? content.substring(0, 100) + "...</p>" : content;
  }
  render() {
    const { navigate } = this.props.navigation;
    const kieu = {
      tagsStyles: {
        div: { textAlign: "center", fontStyle: "italic", color: "grey" }
      },
      classesStyles: {
        "last-paragraph": {
          textAlign: "right",
          color: "teal",
          fontWeight: "800"
        }
      }
    };

    return (
      <FlatList
        refreshing={this.state.refreshing}
        //refreshing={this.props.refreshing}
        onRefresh={() => this.refresh()}
        data={this.state.noidung}
        keyExtractor={(x, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={{ flex: 1, backgroundColor: "#fcfcfc" }}>
            <View style={myStyle.baibao}>
              <TouchableOpacity
                onPress={() => this.xem(item.id, item.title.rendered)}
              >
                <View style={{ flexDirection: "row" }}>
                  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                      style={myStyle.hinh}
                      source={{ uri: this.getSrcImage(item.content.rendered) }}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={myStyle.TieuDe}>
                      <HTML
                        html={"<span>" + item.title.rendered + "</span>"}
                        tagsStyles={htmlStyle}
                      />
                    </View>

                    {/* Chú thích bài báo
                  <HTML tagsStyles={htmlStyle} html={this.formatExcerpt(item.excerpt.rendered)} /> */}
                    <View style={myStyle.edit}>
                      {/* <TouchableOpacity
                onPress={() => this.xem(item.id, item.content.rendered)}
                style={{ flex: 1, alignItems: "center" }}
              >
                <Text style={myStyle.textEdit}>Xem</Text>
              </TouchableOpacity> */}
                      <TouchableOpacity
                        onPress={() => this.xoa(item.id, item.title.rendered)}
                        style={{ paddingLeft: 5,flex: 1, alignItems: "center", flexDirection: 'row' }}
                      >
                        <IonIcon name="ios-trash-outline" size={20} />
                        <Text style={myStyle.textEdit}>  Xóa</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => this.chinhsua(item.id)}
                        style={{ flex: 1, alignItems: "center", flexDirection: 'row' }}
                      >
                        <IonIcon name="ios-create-outline" size={20} />
                        <Text style={myStyle.textEdit}>  Chỉnh sửa</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    );
  }

  refresh() {
    this.loadData();
  }

  onBackButtonPress = () => {
    Alert.alert(
      "Thoát",
      "Bạn muốn thoát không",
      [
        { text: "Đồng ý", onPress: () => BackHandler.exitApp() },
        { text: "Hủy", style: "cancel" }
      ],
      { cancelable: false }
    );
    return true;
  };
}
const htmlStyle = {
  span: {
    color: "#088A4B",
    paddingLeft: 0,
    paddingRight: 5,
    paddingTop: 5,
    marginBottom: 0,
    fontSize: 15
  },
  p: {
    paddingRight: 20
  }
};
const myStyle = StyleSheet.create({
  TieuDe: {
    paddingLeft: 5,
    paddingRight: 5,
    height: 70,
    fontSize: 20
  },
  excerpt: {
    //color: '#088A4B',
    paddingLeft: 10
  },
  edit: {
    height:34,
    borderTopWidth: 1,
    borderColor: "#fafafa",
    padding: 7,
    backgroundColor: "#fdfdfd",
    flexDirection: "row",
    // borderBottomStartRadius: 8,
    // borderBottomEndRadius: 8
  },
  textEdit: {
    fontSize: 12,
    fontWeight: "100",
    flex: 1,
    //color: "#36BC63",
    color: "#6f6f6f",
    justifyContent: 'center',
    alignItems: "center",
  },
  baibao: {
    //borderWidth: 1,
    borderWidth: 1,
    borderColor: "#f6f6f6",
    marginTop: 5,
    marginRight: 5,
    marginLeft: 5,
    backgroundColor: "#fff"
  },
  hinh: {
    width: 150,
    height: 104
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

export default DSBaiBao;

// function mapStateToProps(state){
//   return {refreshing: state.refreshingPosts}
// }
// export default connect(mapStateToProps)(DSBaiBao);
