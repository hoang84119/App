import React, { Component } from "react";
import {View,Image,Text,StyleSheet} from "react-native";
import IonIcon from "react-native-vector-icons/Ionicons";

class ItemComment extends Component {
  render() {
    return (
      <View style={{ flexDirection: "row", margin: 5 }}>
        {/* Avatar */}
        <View style={myStyle.khungAvatar}>
          <Image
            style={myStyle.avatar}
            source={{ uri: this.props.data.author_avatar_urls[96] }}
          />
        </View>
        <View
          style={{
            marginLeft: 5,
            borderWidth: 1,
            borderColor: "#f6f6f6",
            flex: 1,
            borderRadius: 10
          }}
        >
          {/* Thông tin user */}
          <View
            style={{ flex: 1, height: 50, paddingLeft: 10, paddingRight: 10 }}
          >
            <Text
              style={{ color: "#088A4B", fontWeight: "bold", fontSize: 16 }}
            >
              {this.props.data.author_name}
            </Text>
            <Text style={{ marginTop: 3 }}>2018-06-20T13:46:19</Text>
          </View>
          {/* Comment */}
          <View
            style={{
              padding: 5,
              flex: 1,
              marginBottom: 5,
              marginLeft: 5,
              marginRight: 5
            }}
          >
            <Text style={{ fontSize: 18 }}>{this.props.data.content.rendered}</Text>
          </View>

          {/* Tùy chọn comment */}
          <View
            style={{
              borderTopWidth: 1,
              borderColor: "#f6f6f6",
              flexDirection: "row",
              alignContent: "center",
              flex: 1
            }}
          >
            <View
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
                name="ios-heart-outline"
                size={15}
              >
                {" "}
                Thích
              </IonIcon>
            </View>
            <View
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
                name="ios-chatbubbles-outline"
                size={15}
              >
                {" "}
                Trả lời
              </IonIcon>
            </View>
            <View
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
                Sửa
              </IonIcon>
            </View>
            <View
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
            </View>
          </View>
        </View>
      </View>
    );
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
