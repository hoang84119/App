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
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import API from "../config/API";
import HTML from "react-native-render-html";

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
      refreshing: true,
      isLoadPost: true
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

            <<View style={{ flexDirection: "row", justifyContent: "center" , alignItems:"center"}}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("Post");
              }}
              style={[myStyle.buttons,{borderColor: "#14d160"}]}
            >
              <Ionicons
                  name={"ios-paper"}
                  size={40}
                  color={"#14d160"}
                />
              <Text style={[myStyle.textSoLuong,{color: "#14d160"}]}>{this.state.posts}</Text>
              <Text style={{ fontSize: 12}}>Bài viết</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate("Page");
              }}
              style={[myStyle.buttons,{borderColor: "#fe5605"}]}
            >
            <Ionicons
                  name={"ios-book"}
                  size={40}
                  color={"#fe5605"}
                />
                <Text style={[myStyle.textSoLuong,{color: "#fe5605"}]}>{this.state.pages}</Text>
            <Text style={{ fontSize: 12 }}>Trang</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[myStyle.buttons,{borderColor: "#d213e8"}]}>
              <Ionicons
                  name={"ios-chatboxes"}
                  size={40}
                  color={"#d213e8"}
                />
              <Text style={[myStyle.textSoLuong,{color: "#d213e8"}]}>{this.state.comments}</Text>
              <Text style={{ fontSize: 12}}>Bình luận</Text>
            </TouchableOpacity>
          </View>

          {/* So luong khach */}
          <View style={{flex: 1 , flexDirection:"row", justifyContent:"center"}}>
          <View
            style={{
              margin: 10,
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Ionicons name={"ios-eye"} size={30} color={"#0ABFBC"} />
            <Text style={myStyle.text}>{this.state.visitor} đang xem</Text>
          </View>
          <View
            style={{
              margin: 10,
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Ionicons name={"ios-people"} size={30} color={"#0ABFBC"} />
            <Text style={myStyle.text}>{this.state.visit} lượt truy cập</Text>
          </View>
          </View>
        </View>

        {/* Bài viết */}
        <View style={myStyle.cardItem}>
        <ImageBackground style={{padding: 5}} source={require("../image/tag/img5.jpg")}>
          <Text style={{color: "#fff", fontSize: 16, paddingLeft: 5}}>Bài viết mới</Text>
        </ImageBackground>
          {this.state.isLoadPost&&(
            <View style={{flex:1, justifyContent:"center"}}>
              <ActivityIndicator size={40} color = {"#d73c57"}/>
            </View>
          )}
          {!this.state.isLoadPost&&(
            <FlatList
                data={this.state.dataPosts}
                refreshing={this.state.refreshingPost}
                keyExtractor={(item, index) => item.id.toString()}
                renderItem={this._renderPost}
              />
          )}
        </View>
        <View style={myStyle.cardItem}>
          <ImageBackground style={{padding: 5}} source={require("../image/tag/img5.jpg")}>
            <Text style={{color: "#fff", fontSize: 16, paddingLeft: 5}}>Bình luận mới</Text>
          </ImageBackground>
          <View style={{flex:1, justifyContent:"center"}}>
            <ActivityIndicator size={40} color = {"#d73c57"}/>
          </View>
        </View>
        </ScrollView>
          
      </View>
    );
  }

  _loadData = async () => {
    this.setState({refreshing:true});
    try {
      let response = await fetch(`${API.getURL()}/wp-json/gsoft/thongke`);
      let statistical = await response.json();
      let posts = await fetch(`${API.getURL()}/wp-json/wp/v2/posts?per_page=5`);
      let dataPosts = await posts.json();
      let comments = await fetch(`${API.getURL()}/wp-json/wp/v2/comments?per_page=5`);
      let dataComments = await comments.json();
      this.setState({
        posts: statistical.totalposts,
        pages: statistical.totalpages,
        comments: statistical.totalcomments,
        visitor: statistical.totalvisitor,
        visit: statistical.totalvisit,
        dataPosts: dataPosts,
        dataComments: dataComments,
        refreshing: false,
        isLoadPost: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  _renderPost = ({ item }) => (
    <TouchableOpacity style={{ flexDirection: "row" }}>
      <Text style={myStyle.text}>{this._getDate(item.date_gmt)}</Text>
      <HTML
        html={`<span style="fontSize:16">${item.title.rendered}</span>`}
        renderers={this.renderers}
      />
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
    borderRadius: 1000,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    // shadowColor: "blue",
    // shadowOffset: { width: 0, height: 0 },
    // shadowOpacity: 1,
    // elevation: 3
  },
  textSoLuong: { color: "#0ABFBC", fontSize: 20, fontWeight: "bold"},
  text: {fontSize: 14, marginLeft: 10, marginVertical: 5 }
});

export default Statistical;
