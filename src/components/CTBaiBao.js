import React, { Component } from "react";
import {
  View, Text, StyleSheet, Alert, ScrollView, Image,
  TouchableOpacity, Dimensions, PixelRatio,
  ImageBackground, ActivityIndicator,FlatList,ToastAndroid
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
      binhluan: [],
      loaded: false,
      refreshing:true
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
    this.loadComments();
    this.props.navigation.setParams({
      onEdit: this._onEdit.bind(this)
    });
  }

  loadComments() {
    fetch(
      API.getURL() + "/thuctap/wp-json/wp/v2/comments?post=" + this.props.navigation.getParam("id", "")
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson == null) {
          Alert.alert("Lỗi", "Không có nội dung");
        } else {
          this.setState({ binhluan: responseJson, refreshing: false });
        }
      });
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
            <Text style={{ color: "#088A4B" }}>Đang tải</Text>
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
            {/* Bình luận bài viết */}
            <View style={{ padding: 5 }}>
              <Text style={{ padding: 5, fontSize: 20, color: '#088A4B' }}>Bình luận</Text>
              <FlatList
                refreshing={this.state.refreshing}
                //refreshing={this.props.refreshing}
                onRefresh={() => this.refresh()}
                data={this.state.binhluan}
                keyExtractor={(x, i) => i.toString()}
                renderItem={({ item }) => (
                    <View style={{ flexDirection: "row", margin: 5 }}>
                      {/* Avatar */}
                      <View style={myStyle.khungAvatar}>
                        <Image
                          style={myStyle.avatar}
                          source={{uri: item.author_avatar_urls }} />
                      </View>
                      <View style={{ marginLeft: 5, borderWidth: 1, borderColor: "#f6f6f6", flex: 1, borderRadius: 10 }}>
                        {/* Thông tin user */}
                        <View style={{ flex: 1, height: 50, paddingLeft: 10, paddingRight: 10 }}>
                          <Text style={{ color: '#088A4B', fontWeight: 'bold', fontSize: 16 }}>{item.author_name}</Text>
                          <Text style={{ marginTop: 3 }}>2018-06-20T13:46:19</Text>
                        </View>
                        {/* Comment */}
                        <View style={{ padding: 5, flex: 1, marginBottom: 5, marginLeft: 5, marginRight: 5 }}>
                          <Text style={{ fontSize: 18 }}>{item.content.rendered}</Text>
                        </View>

                        {/* Tùy chọn comment */}
                        <View style={{ borderTopWidth: 1, borderColor: "#f6f6f6", flexDirection: 'row', alignContent: 'center', flex: 1 }}>
                          <View style={{ paddingTop: 7, paddingBottom: 7, flexDirection: 'row', justifyContent: 'center', flex: 1, alignItems: 'center' }}>
                            <IonIcon style={{ color: '#088A4B' }} name="ios-heart-outline" size={15}> Thích</IonIcon>
                          </View>
                          <View style={{ paddingTop: 7, paddingBottom: 7, flexDirection: 'row', justifyContent: 'center', flex: 1, alignItems: 'center' }}>
                            <IonIcon style={{ color: '#088A4B' }} name="ios-chatbubbles-outline" size={15}> Trả lời</IonIcon>
                          </View>
                          <View style={{ paddingTop: 7, paddingBottom: 7, flexDirection: 'row', justifyContent: 'center', flex: 1, alignItems: 'center' }}>
                            <IonIcon style={{ color: '#088A4B' }} name="ios-create-outline" size={15}> Sửa</IonIcon>
                          </View>
                          <View style={{ paddingTop: 7, paddingBottom: 7, flexDirection: 'row', justifyContent: 'center', flex: 1, alignItems: 'center' }}>
                            <IonIcon style={{ color: '#088A4B' }} name="ios-trash-outline" size={15}> Xóa</IonIcon>
                          </View>
                        </View>
                      </View>
                    </View>
                )}
              />
            </View>
          </ScrollView>
        }
      </View>
    );
  }
  refresh() {
    this.loadComments();
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
  },
  khungAvatar: {
    borderWidth: 1,
    borderColor: '#cfcfcf',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 30,
    //backgroundColor: "#afafaf",
    overflow: 'hidden',
    shadowOffset: { width: 2, height: 2, },
    shadowColor: 'black',
    shadowOpacity: 0,
    shadowRadius: 2,
    elevation: 5,

  },
  avatar: {
    width: 50,
    height: 50,
    resizeMode: 'cover'
  }
});
export default CTBaiBao;
