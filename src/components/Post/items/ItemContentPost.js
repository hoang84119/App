import React, { Component } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  ImageBackground
} from "react-native";
import HTML from "react-native-render-html";
import API from "../../../config/API";

class ItemContentPost extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        {/* <ImageBackground
          style={{ width: Dimensions.get("window").width, height: 200 }}
          source={{ uri: this.props.featured_media }}
          resizeMode="cover"
        /> */}
        <ImageBackground
          source={{ uri: this.props.featured_media }}
          style={myStyle.imageCover}
        >
          <View style={myStyle.viewUser}>
            <View style={myStyle.user}>
              <Image
                style={myStyle.avatar}
                source={{ uri: this.props.tacgia.avatar_urls[96] }}
              />
              <Text style={myStyle.tenTacGia}>{this.props.tacgia.name}</Text>
            </View>
          </View>
        </ImageBackground>

        <View style={myStyle.container}>
          <Text style={myStyle.title}>{this.props.noidung.title.rendered}</Text>
          <Text style={myStyle.textCapNhat}>
            Cập nhật lúc: {this._getDate()}
          </Text>

          <View style={{ alignItems: "center", flex: 1, margin: 10 }}>
            <Image
              style={{ width: 150, height: 11 }}
              source={require("../../../image/line.png")}
            />
          </View>

          <HTML
            html={this.props.noidung.content.rendered.replace(
              "http://localhost",
              API.getURL()
            )}
            imagesMaxWidth={Dimensions.get("window").width - 10}
            tagsStyles={htmlContentStyle}
          />
        </View>
      </View>

      // <View style={{ flexDirection: "column", flex:1,alignItems: "center" }}>
      //   <ImageBackground
      //     style={{
      //       paddingTop: 70,
      //       flex: 1,
      //       minHeight: 10
      //     }}
      //     source={require("../../../image/background/Miaka.jpg")}
      //   >
      //     <View style={myStyle.title}>
      //       {this.props.loaded && (
      //         <HTML
      //           html={"<span>" + this.props.noidung.title.rendered + "</span>"}
      //           tagsStyles={htmlTitleStyle}
      //         />
      //       )}
      //     </View>
      //   </ImageBackground>
      //   <View style={{ paddingLeft: 5, paddingRight: 5 }}>
      //     <View>
      //       {this.props.loaded && (
      //         <HTML
      //           html={
      //             "<i>Cập nhật lúc: <b>" +
      //             this.props.noidung.modified.replace("T", "   ") +
      //             "</b></i>"
      //           }
      //           //stylesheet={htmlTitleStyle}
      //         />
      //       )}
      //       {this.props.loaded && (
      //         <HTML
      //           html={
      //             "<i>Người đăng: <b>" + this.props.tacgia.name + "</i></b>"
      //           }
      //         />
      //       )}
      //     </View>
      //     <View style={{ alignItems: "center", flex: 1, margin: 10 }}>
      //       <Image
      //         style={{ width: 150, height: 11 }}
      //         source={require("../../../image/line.png")}
      //       />
      //     </View>
      //     <View style={myStyle.content}>
      //       {this.props.loaded && (
      //         <HTML
      //           html={this.props.noidung.content.rendered.replace(
      //             "http://localhost",
      //             API.getURL()
      //           )}
      //           tagsStyles={htmlTitleStyle}
      //           imagesMaxWidth={Dimensions.get("window").width - 10}
      //           //renderers={this.renderers}
      //         />
      //       )}
      //     </View>
      //   </View>
      // </View>
    );
  }

  _getDate() {
    let date = new Date(this.props.noidung.modified);
    let day = String(date.getDate());
    if (day.length < 2) day = "0" + day;
    let month = String(date.getMonth() + 1);
    if (month.length < 2) month = "0" + month;
    let year = String(date.getFullYear());
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    return `${day}-${month}-${year} ${hour}:${minute}:${second}`;
  }
}

const htmlContentStyle = {
  span: {
    padding: 5,
    fontWeight: "bold",
    color: "white",
    fontSize: 20
  },
  p: {
    fontSize: 16,
    fontWeight: "100",
    margin: 5,
    color: "#000"
  }
  // img: {
  //   // width: 800,
  //   // height: 400
  //   // borderColor: "black",
  //   // borderWidth: 1
  // }
};
const myStyle = StyleSheet.create({
  imageCover: {
    flex: 1,
    height: 150
  },
  viewUser: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
    flex: 1,
    height: 150,
    padding: 10
  },
  user: {
    flexDirection: "row",
    alignItems: "center"
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50
  },
  tenTacGia: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 10,
    color: "#fff"
  },
  container: {
    margin: 10
    // flexDirection:"column",
    // alignItems:"center"
  },
  content: {
    padding: 5,
    flex: 1,
    flexDirection: "column"
    //alignItems: "center"
  },
  title: {
    fontSize: 20,
    fontWeight: "500",
    color: "#282828"
  },
  textCapNhat: {
    fontSize: 14,
    marginBottom: 10
  }
});

export default ItemContentPost;
