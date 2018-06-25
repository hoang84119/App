import React, { Component } from "react";
import { TouchableOpacity, View, Image, Text, StyleSheet } from "react-native";
import IonIcon from "react-native-vector-icons/Ionicons";
import PostDetail from "../PostDetail";
import HTML from "react-native-render-html";
import API from "../../../config/API";

class ItemCommentChild extends Component {
  render() {
    return (
      <View>
        <View style={{ flexDirection: "row", marginLeft: 55, margin: 5 }}>

          {/* Avatar */}

          <View style={myStyle.khungAvatar}>
            <Image style={myStyle.avatar} source={{ uri: this.props.data.author_avatar_urls[48] }} />
          </View>
          <View style={{ marginLeft: 5, borderWidth: 1, borderColor: "#fbfbfb", flex: 1, borderRadius: 10 , backgroundColor: "#f9f9f9", overflow: "hidden"}}>

            {/* Thông tin user */}

            <View style={{ flex: 1, height: 40, paddingLeft: 10, paddingRight: 10 }}>
              <Text style={{ color: "#088A4B", fontWeight: "bold", fontSize: 16 }}>
                {this.props.data.author_name}
              </Text>
              <Text style={{ fontSize: 12}}>{this.props.data.date.replace("T", "   ")}</Text>
            </View>

            {/* Comment */}

            <View style={{paddingLeft: 5, paddingRight: 5, flex: 1, marginLeft: 5, marginRight: 5 }} >
              {this.props.loaded && (
                <HTML
                  html={this.props.data.content.rendered}
                  tagsStyles={htmlTitleStyle}
                />
              )}
            </View>

            {/* Tùy chọn comment */}
            <View style={{flexDirection: "row", alignContent: "center", flex: 1 , backgroundColor: "#fcfcfc"}}>
              
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
                  style={{ color: "#088A4B" }}
                  name="ios-create-outline"
                  size={15}
                >
                  {" "}
                  Chỉnh sửa
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
                  style={{ color: "#088A4B" }}
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
      </View>
    );
  }
}

const htmlTitleStyle = {
  span: {
    paddingLeft: 5,
    paddingRight: 5,
    fontWeight: "bold",
    color: "white",
    fontSize: 20
  }
}

const myStyle = StyleSheet.create({
  khungAvatar: {
    borderWidth: 1,
    borderColor: '#cfcfcf',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
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
    width: 32,
    height: 32,
    resizeMode: 'cover'
  }
});

export default ItemCommentChild;
