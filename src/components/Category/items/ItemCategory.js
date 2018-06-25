import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  ToastAndroid,
  Text,
  Alert
} from "react-native";
import HTML from "react-native-render-html";
import Base64 from "../../../config/Base64";
import IonIcon from "react-native-vector-icons/Ionicons";

class ItemPost extends Component {
  constructor(props) {
    super(props);
    this.state = { featured_media: "", loaded: false };
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#fcfcfc" }}>
        <View style={myStyle.noidung}>
          <TouchableOpacity
            onPress={() =>
              this.xem(this.props.data.id, this.props.data.name)
            }
          >
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                <View style={myStyle.TieuDe}>
                  <Text>{this.props.data.name}</Text>
                </View>
                {this.props.userName === "admin" && (
                  <View style={myStyle.edit}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.delete(
                          this.props.data.id,
                          this.props.data.title.rendered
                        )
                      }
                      style={{
                        paddingLeft: 5,
                        flex: 1,
                        alignItems: "center",
                        flexDirection: "row"
                      }}
                    >
                      <IonIcon name="ios-trash-outline" size={20} />
                      <Text style={myStyle.textEdit}> Xóa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.chinhsua(this.props.data.id)}
                      style={{
                        flex: 1,
                        alignItems: "center",
                        flexDirection: "row"
                      }}
                    >
                      <IonIcon name="ios-create-outline" size={20} />
                      <Text style={myStyle.textEdit}> Chỉnh sửa</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  xem(i, t) {
    //this.getSrcImage(t);
    this.props.navigation.navigate("chitiet", { id: i });
  }
  xoa(i, t) {
    this.props.delete(i, t);
  }
  chinhsua(i) {
    this.props.navigation.navigate("chinhsua", { id: i });
  }
}

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
    height: 34,
    borderTopWidth: 1,
    borderColor: "#fafafa",
    padding: 7,
    backgroundColor: "#fdfdfd",
    flexDirection: "row"
    // borderBottomStartRadius: 8,
    // borderBottomEndRadius: 8
  },
  textEdit: {
    fontSize: 12,
    fontWeight: "100",
    flex: 1,
    //color: "#36BC63",
    color: "#6f6f6f",
    justifyContent: "center",
    alignItems: "center"
  },
  noidung: {
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

export default ItemPost;
