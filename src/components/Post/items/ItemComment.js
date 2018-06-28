import React, { Component } from "react";
import { FlatList, TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";
import IonIcon from "react-native-vector-icons/Ionicons";
import PostDetail from "../PostDetail";
import HTML from "react-native-render-html";
import API from "../../../config/API";
import ItemCommentChild from "./ItemCommentChild";

class ItemComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cmtchild: [],
    };
  }
  componentDidMount() {
    this._loadCommentsChild();
  }
  _loadCommentsChild() {
    fetch(
      API.getURL() +
      "/thuctap/wp-json/wp/v2/comments?post=" +
      this.props.data.post + "&parent=" + this.props.data.id
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson == null) {
          Alert.alert("Lỗi", "Không có nội dung");
        } else {
          this.setState({ cmtchild: responseJson, refreshing: false });
        }
      });
  }
  render() {
    return (
      <View>
        <View style={{ flexDirection: "row", margin: 5 }}>

          {/* Avatar */}

          <View style={myStyle.khungAvatar}>
            <Image style={myStyle.avatar} source={{ uri: this.props.data.author_avatar_urls[96] }} />
          </View>
          <View style={{ marginLeft: 5, borderWidth: 1, borderColor: "#f6f6f6", flex: 1, borderRadius: 10, backgroundColor: "#fefefe" }}>

            {/* Thông tin user */}

            <View style={{ flex: 1, height: 50, paddingLeft: 10, paddingRight: 10 }}>
              <Text style={{ color: "#36BC63", fontWeight: "bold", fontSize: 16 }}>
                {this.props.data.author_name}
              </Text>
              <Text style={{ marginTop: 3, fontSize: 12 }}>{this.props.data.date.replace("T", "   ")}</Text>
            </View>

            {/* Comment */}

            <View style={{ padding: 5, flex: 1, marginBottom: 5, marginLeft: 5, marginRight: 5 }} >
              {this.props.loaded && (
                <HTML
                  html={this.props.data.content.rendered}
                  tagsStyles={htmlTitleStyle}
                />
              )}
            </View>

            {/* Tùy chọn comment */}
            <View style={{ borderTopWidth: 1, borderColor: "#f6f6f6", flexDirection: "row", alignContent: "center", flex: 1 }}>
              <TouchableOpacity style={{
                paddingTop: 7,
                paddingBottom: 7,
                flexDirection: "row",
                justifyContent: "center",
                flex: 1,
                alignItems: "center"
              }} onPress={() => {
                this.props.onClickCmt(this.props.data.author_name);
              }}>
                <IonIcon
                  style={{ color: "#36BC63" }}
                  name="ios-chatbubbles-outline"
                  size={15}
                >
                  {" "}
                  Trả lời
              </IonIcon>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  paddingTop: 7,
                  paddingBottom: 7,
                  flexDirection: "row",
                  justifyContent: "center",
                  flex: 1,
                  alignItems: "center"
                }}
              >
                <IonIcon
                  style={{ color: "#36BC63" }}
                  name="ios-create-outline"
                  size={15}
                >
                  {" "}
                  Chỉnh sửa
              </IonIcon>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.deleteComments(this.props.data.id)}
                style={{
                  paddingTop: 7,
                  paddingBottom: 7,
                  flexDirection: "row",
                  justifyContent: "center",
                  flex: 1,
                  alignItems: "center"
                }}
              >
                <IonIcon
                  style={{ color: "#36BC63" }}
                  name="ios-trash-outline"
                  size={15}
                >
                  {" "}
                  Xóa
              </IonIcon>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <FlatList
          refreshing={this.state.refreshing}
          //refreshing={this.props.refreshing}
          onRefresh={() => this._loadCommentsChild()}
          data={this.state.cmtchild}
          keyExtractor={(x, i) => i.toString()}
          renderItem={({ item }) => <ItemCommentChild data={item} loaded={this.props.loaded} />}
        />
      </View>
    );
  }
}

const htmlTitleStyle = {
  span: {
    padding: 5,
    fontWeight: "bold",
    color: "white",
    fontSize: 20
  },
  p: {
    fontSize: 18
  }
}

const myStyle = StyleSheet.create({
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

export default ItemComment;
