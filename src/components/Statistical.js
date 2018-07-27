import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StatusBar,
  StyleSheet,
  FlatList,
  ScrollView,
  RefreshControl
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

            <View style={{ flexDirection: "row", justifyContent: "center" }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("Post");
                }}
                style={myStyle.buttons}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons
                    name={"ios-paper-outline"}
                    size={30}
                    color={"#0ABFBC"}
                  />
                  <Text style={myStyle.textSoLuong}>{this.state.posts}</Text>
                </View>
                <Text style={{ fontSize: 15, marginTop: 5 }}>Bài viết</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("Page");
                }}
                style={myStyle.buttons}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons
                    name={"ios-book-outline"}
                    size={30}
                    color={"#0ABFBC"}
                  />
                  <Text style={myStyle.textSoLuong}>{this.state.pages}</Text>
                </View>
                <Text style={{ fontSize: 15, marginTop: 5 }}>Trang</Text>
              </TouchableOpacity>
              <TouchableOpacity style={myStyle.buttons}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons
                    name={"ios-chatboxes-outline"}
                    size={30}
                    color={"#0ABFBC"}
                  />
                  <Text style={myStyle.textSoLuong}>{this.state.comments}</Text>
                </View>
                <Text style={{ fontSize: 15, marginTop: 5 }}>Bình luận</Text>
              </TouchableOpacity>
            </View>

            {/* So luong khach */}

            <View
              style={{
                marginLeft: 10,
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <Ionicons name={"ios-eye-outline"} size={30} color={"#0ABFBC"} />
              <Text style={myStyle.text}>
                Tổng số người xem: {this.state.visitor}
              </Text>
            </View>
            <View
              style={{
                marginLeft: 10,
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <Ionicons
                name={"ios-people-outline"}
                size={30}
                color={"#0ABFBC"}
              />
              <Text style={myStyle.text}>
                Tổng số khách viếng thăm: {this.state.visit}
              </Text>
            </View>
          </View>

          {/* Bài viết */}
          <View style={myStyle.cardItem}>
            <Text style={myStyle.text}>Bài viết mới</Text>
            <FlatList
              data={this.state.dataPosts}
              keyExtractor={(item, index) => item.id.toString()}
              renderItem={this._renderPost}
            />
          </View>
          <View style={myStyle.cardItem}>
            <Text style={myStyle.text}>Bình luận mới</Text>
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
        refreshing: false
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
    flexDirection: "column",
    margin: 5,
    //borderWidth: 1,
    borderRadius: 7,
    shadowColor: "#000",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.8,
    elevation: 1.5
  },
  buttons: {
    width: 100,
    height: 100,
    borderColor: "#c0c0c0",
    borderWidth: 1,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    margin: 10
  },
  textSoLuong: { color: "#000", fontSize: 20, marginLeft: 10 },
  text: { color: "#000", fontSize: 16, marginLeft: 10, marginVertical: 5 }
});

export default Statistical;
