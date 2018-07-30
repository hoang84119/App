import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StatusBar,
  StyleSheet,
  FlatList,
  ScrollView,
  RefreshControl,
  ImageBackground,
  ActivityIndicator,
  Image
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import API from "../config/API";
import HTML from "react-native-render-html";
import { connect } from "react-redux";
const featured_media_default =
  "https://www.elegantthemes.com/blog/wp-content/uploads/2013/09/background-thumb1.jpg";

class Statistical extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pages: 0,
      posts: 0,
      comments: 0,
      visitor: 0,
      visit: 0,
      dataPosts: [],
      dataComments: [],
      refreshing: true
    };
  }
  componentDidMount() {
    this._loadData();
  }
  render() {
    return (
      <View style={myStyle.container}>
        {/* Status Bar */}

        <View style={{ backgroundColor: "#0ABFBC" }}>
          <StatusBar translucent backgroundColor="rgba(0, 0, 0, 0)" animated />
          <View style={{ height: StatusBar.currentHeight }} />
          <View style={myStyle.headerBar}>
            <View style={myStyle.headerTitle}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.openDrawer();
                }}
              >
                <Feather
                  style={[myStyle.icon, { marginLeft: 15 }]}
                  name="menu"
                  size={25}
                />
              </TouchableOpacity>
              <Text style={myStyle.title}>Thống kê</Text>
            </View>
          </View>
        </View>

        {/* Nội dung */}

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._loadData}
            />
          }
        >
          <View style={myStyle.cardItem}>
            {/* Buttons */}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("Post");
                }}
                style={[
                  myStyle.buttons,
                  { borderColor: "#14d160", backgroundColor: "#F3FFF7" }
                ]}
              >
                <Ionicons name={"ios-paper"} size={40} color={"#14d160"} />
                <Text style={[myStyle.textSoLuong, { color: "#14d160" }]}>
                  {this.state.posts}
                </Text>
                <Text style={{ fontSize: 12 }}>Bài viết</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("Page");
                }}
                style={[
                  myStyle.buttons,
                  { borderColor: "#fe5605", backgroundColor: "#FFFDF8" }
                ]}
              >
                <Ionicons name={"ios-book"} size={40} color={"#fe5605"} />
                <Text style={[myStyle.textSoLuong, { color: "#fe5605" }]}>
                  {this.state.pages}
                </Text>
                <Text style={{ fontSize: 12 }}>Trang</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  myStyle.buttons,
                  { borderColor: "#d213e8", backgroundColor: "#FDEDFD" }
                ]}
              >
                <Ionicons name={"ios-chatboxes"} size={40} color={"#d213e8"} />
                <Text style={[myStyle.textSoLuong, { color: "#d213e8" }]}>
                  {this.state.comments}
                </Text>
                <Text style={{ fontSize: 12 }}>Bình luận</Text>
              </TouchableOpacity>
            </View>

            {/* So luong khach */}
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center"
              }}
            >
              <View
                style={{
                  margin: 10,
                  flexDirection: "row",
                  alignItems: "center"
                }}
              >
                <Ionicons name={"ios-people"} size={20} color={"#0ABFBC"} />
                <Text style={myStyle.text}>
                  {this.state.visitor} viếng thăm
                </Text>
              </View>
              <View
                style={{
                  margin: 10,
                  flexDirection: "row",
                  alignItems: "center"
                }}
              >
                <Ionicons name={"ios-eye"} size={25} color={"#0ABFBC"} />
                <Text style={myStyle.text}>{this.state.visit} lượt xem</Text>
              </View>
            </View>
          </View>

          {/* Bài viết */}

          <View style={myStyle.cardItem}>
            <ImageBackground
              style={{ padding: 5 }}
              source={require("../image/tag/img5.jpg")}
            >
              <Text style={{ color: "#fff", fontSize: 16, paddingLeft: 5 }}>
                Bài viết mới
              </Text>
            </ImageBackground>
            {this.state.refreshing && (
              <View style={{ flex: 1, justifyContent: "center" }}>
                <ActivityIndicator size={40} color={"#d73c57"} />
              </View>
            )}
            {!this.state.refreshing && (
              <FlatList
                data={this.state.dataPosts}
                keyExtractor={(item, index) => item.id.toString()}
                renderItem={this._renderPost}
              />
            )}
          </View>

          {/* Bình luận */}

          <View style={myStyle.cardItem}>
            <ImageBackground
              style={{ padding: 5 }}
              source={require("../image/tag/img5.jpg")}
            >
              <Text style={{ color: "#fff", fontSize: 16, paddingLeft: 5 }}>
                Bình luận mới
              </Text>
            </ImageBackground>
            {this.state.refreshing && (
              <View style={{ flex: 1, justifyContent: "center" }}>
                <ActivityIndicator size={40} color={"#d73c57"} />
              </View>
            )}
            {!this.state.refreshing && (
              <FlatList
                data={this.state.dataComments}
                keyExtractor={(item, index) => item.id.toString()}
                renderItem={this._renderComment}
              />
            )}
          </View>
        </ScrollView>
      </View>
    );
  }

  _loadData = async () => {
    this.setState({ refreshing: true });
    try {
      let response = await fetch(`${API.getURL()}/wp-json/gsoft/thongke`);
      let statistical = await response.json();
      let posts = await fetch(
        `${API.getURL()}/wp-json/wp/v2/posts?per_page=5&orderby=modified`
      );
      let dataPosts = await posts.json();
      let comments = await fetch(
        `${API.getURL()}/wp-json/wp/v2/comments?per_page=5`
      );
      let dataComments = await comments.json();
      this.setState({
        posts: statistical.totalposts,
        pages: statistical.totalpages,
        comments: statistical.totalcomments,
        visitor: statistical.totalvisitor,
        visit: statistical.totalvisit,
        dataPosts: dataPosts,
        dataComments: dataComments,
        refreshing: false
      });
    } catch (error) {
      console.log(error);
    }
  };

  _renderPost = ({ item }) => (
    <TouchableOpacity
      onPress={() => this._xem(item)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderBottomColor: "#c0c0c0",
        borderBottomWidth: 1
      }}
    >
      <Text style={myStyle.text}>{this._getDate(item.modified_gmt)} | </Text>
      <HTML
        html={`<span style="fontSize:16">${item.title.rendered}</span>`}
        renderers={this.renderers}
      />
    </TouchableOpacity>
  );

  _renderComment = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        console.log(item);
        this._xemComment(item.post);
      }}
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderBottomColor: "#c0c0c0",
        borderBottomWidth: 1
      }}
    >
      <Image
        style={myStyle.avatar}
        source={{ uri: item.author_avatar_urls[96] }}
      />

      <View style={{ flexDirection: "column" }}>
        <Text style={myStyle.text}>{item.author_name}</Text>
        <HTML
          html={`<span style="fontSize:16">${item.content.rendered}</span>`}
          renderers={this.renderers}
        />
      </View>
    </TouchableOpacity>
  );

  renderers = {
    span: (htmlAttribs, children) => (
      <Text style={myStyle.text}>{children}</Text>
    )
  };

  _getDate = isoDates => {
    let date = new Date(isoDates);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  _xemComment = idPost => {
    console.log(idPost);
    fetch(`${API.getURL()}/wp-json/wp/v2/posts/${idPost}`)
      .then(response => response.json())
      .then(json => {
        console.log(json);
        this._xem(json);
      });
  };

  _xem = data => {
    this._getFeaturedMedia(data).then(featured_media => {
      this.props.navigation.navigate("chitiet", {
        id: data.id,
        userName: this.props.dataUser.name,
        featured_media: featured_media
      });
    });
  };

  async _getFeaturedMedia(data) {
    if (data.featured_media != 0) {
      let response = await fetch(
        `${API.getURL()}/wp-json/wp/v2/media/${data.featured_media}`
      );
      if (response.status === 200) {
        let json = await response.json();
        let src = json.media_details.sizes.medium.source_url;
        return src.replace(/http:\/\/localhost\/thuctap/g, API.getURL());
      } else {
        return featured_media_default;
      }
    } else {
      let content = data.content.rendered;
      //tìm thẻ img đầu tiên
      let indexImg = content.toString().indexOf("<img");
      //không tìm thấy trả về đường dẫn mặc định
      var src = featured_media_default;
      if (indexImg != -1) {
        // tìm vị trí mở src
        let indexSrcStart = content.toString().indexOf("src", indexImg) + 5;
        //tìm vị trí đóng src
        let indexSrcEnd = content.toString().indexOf('"', indexSrcStart);
        //lấy đường dẫn
        src = content
          .substring(indexSrcStart, indexSrcEnd)
          .replace(/http:\/\/localhost\/thuctap/g, API.getURL());
        let response = await fetch(src);
        if (response.status != 200) src = featured_media_default;
      }
      return src;
    }
  }
}

const myStyle = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  icon: { marginLeft: 5, marginRight: 10, color: "#fff" },
  headerBar: {
    backgroundColor: "#0ABFBC",
    flexDirection: "row",
    zIndex: 0
  },
  headerTitle: {
    //paddingLeft: 20,
    alignItems: "center",
    height: 50,
    flexDirection: "row",
    flex: 3
  },
  title: { fontSize: 20, color: "#fff", fontWeight: "500", marginLeft: 5 },
  cardItem: {
    flex: 1,
    flexDirection: "column",
    margin: 5,
    borderWidth: 1,
    borderRadius: 5,
    overflow: "hidden",
    borderColor: "#d0d0d0"
    // shadowColor: "#000",
    // shadowOffset: { width: 10, height: 10 },
    // shadowOpacity: 0.8,
    // elevation: 1.5
  },
  buttons: {
    padding: 15,
    width: 110,
    height: 110,
    //borderColor: "#0ABFBC",
    borderWidth: 2.5,
    borderRadius: 110 / 2,
    justifyContent: "center",
    alignItems: "center",
    margin: 10
    // shadowColor: "blue",
    // shadowOffset: { width: 0, height: 0 },
    // shadowOpacity: 1,
    // elevation: 3
  },
  textSoLuong: { color: "#0ABFBC", fontSize: 20, fontWeight: "bold" },
  text: { fontSize: 12, marginLeft: 10, marginVertical: 5 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginLeft: 5
    //resizeMode: "cover"
  }
});

function mapStateToProps(state) {
  return { dataUser: state.dataUser };
}
export default connect(mapStateToProps)(Statistical);
