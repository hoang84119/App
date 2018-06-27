import React, { Component } from "react";
import { ImageBackground, View, Image,StyleSheet,Dimensions } from "react-native";
import HTML from "react-native-render-html";
import API from "../../../config/API";

class ItemContentPost extends Component {
  render() {
    return (
      <View>
        <ImageBackground
          style={{
            paddingTop: 70,
            flex: 1,
            minHeight: 10,
            //resizeMode: "cover"
          }}
          source={require("../../../image/header.png")}
        >
          <View style={myStyle.title}>
            {this.props.loaded && (
              <HTML
                html={"<span>" + this.props.noidung.title.rendered + "</span>"}
                tagsStyles={htmlTitleStyle}
              />
            )}
          </View>
        </ImageBackground>
        <View style={{ paddingLeft: 5, paddingRight: 5 }}>
          <View style={myStyle.content}>
            {this.props.loaded && (
              <HTML
                html={
                  "<i>Cập nhật lúc: <b>" +
                  this.props.noidung.modified.replace("T", "   ") +
                  "</b></i>"
                }
                //stylesheet={htmlTitleStyle}
              />
            )}
            {this.props.loaded && (
              <HTML
                html={
                  "<i>Người đăng: <b>" + this.props.tacgia.name + "</i></b>"
                }
              />
            )}
          </View>
          <View style={{ alignItems: "center", flex: 1, margin: 10 }}>
            <Image
              style={{ width: 150, height: 11 }}
              source={require("../../../image/line.png")}
            />
          </View>
          <View style={myStyle.content}>
            {this.props.loaded && (
              <HTML
                html={this.props.noidung.content.rendered.replace(
                  "http://localhost",
                  API.getURL()
                )}
                imagesMaxWidth={Dimensions.get("window").width - 20}
              />
            )}
          </View>
        </View>
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
  // img: {
  //   width: 800,
  //   height: 400
  // }
};
const myStyle = StyleSheet.create({
  content: {
    padding: 5,
    flex: 1
  },
  title: {
    margin: 10
  },
});

export default ItemContentPost;
