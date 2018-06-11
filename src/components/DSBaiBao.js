import React, { Component } from "react";
import {
  Alert,
  FlatList,
  BackHandler,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ToastAndroid,
  Button
} from "react-native";
import HTMLView from "react-native-htmlview";
import API from "../API";
class DSBaiBao extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noidung: "",
      refeshing: true
    };
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let headerRight = (
      <Button
        title="Chỉnh sửa"
        onPress={() => {
          params.onAdd();
        }}
      />
    );
    return { headerRight };
  };

  _onAdd() {
    if (this.props.navigation.state.params.isAdding == true) return;
    this.props.navigation.setParams({ isAdding: true });
  }

  componentDidMount() {
    this.loadData();
    BackHandler.addEventListener("hardwareBackPress", this.onBackButtonPress);
    this.props.navigation.setParams({
      onAdd: this._onAdd.bind(this),
      isAdding: false
    });
  }

  async loadData() {
    this.setState({ refeshing: true });
    fetch(API.getURL() + "/thuctap/wp-json/wp/v2/posts")
      .then(response => response.json())
      .then(responeJson => {
        if (responeJson == null) {
          Alert.alert("Lỗi", "Không có nội dung");
        } else {
          this.setState({ noidung: responeJson, refeshing: false });
        }
      });
  }

  xem(i, t) {
    this.props.navigation.navigate("chitiet", { id: i });
  }
  xoa(i, t) {
    Alert.alert(
      "Thông báo",
      "Bạn có thật sự muốn xóa ''" + t + "'' không?",
      [
        {
          text: "Xóa",
          onPress: () => {
            fetch(API.getURL() + "/thuctap/wp-json/wp/v2/posts/" + i, {
              headers: {
                Authorization:
                  "Basic " + Base64.btoa("admin:yEgN NbO6 w6k3 vSuU xBjV E8Ok")
              },
              method: "DELETE"
            }).then(response => {
              var t = response.status;
              if (response.status == 200) {
                ToastAndroid.show("Xóa thành công !", ToastAndroid.LONG);
                this.loadData();
              } else Alert.alert("Cảnh báo", "Xóa thất bại!");
            });
          }
        },
        { text: "Hủy", style: "cancel" }
      ],
      { cancelable: false }
    );
    return true;
  }
  chinhsua(i) {
    this.props.navigation.navigate("chinhsua", { id: i });
  }
  render() {
    const { navigate } = this.props.navigation;
    const kieu = {
      tagsStyles: {
        div: { textAlign: "center", fontStyle: "italic", color: "grey" }
      },
      classesStyles: {
        "last-paragraph": {
          textAlign: "right",
          color: "teal",
          fontWeight: "800"
        }
      }
    };

    return (
      <FlatList
        refreshing={this.state.refeshing}
        onRefresh={() => this.refesh()}
        data={this.state.noidung}
        keyExtractor={(x, i) => i.toString()}
        renderItem={({ item }) => (
          <View style={myStyle.baibao}>
            <TouchableOpacity
              onPress={() => this.xem(item.id, item.title.rendered)}
            >
              <View>
                <HTMLView
                  value={"<span>" + item.title.rendered + "</span>"}
                  stylesheet={htmlTitleStyle}
                />
              </View>
              <View style={myStyle.excerpt}>
                <HTMLView value={item.excerpt.rendered} />
              </View>
            </TouchableOpacity>
            <View style={myStyle.edit}>
              <TouchableOpacity
                onPress={() => this.xem(item.id, item.title.rendered)}
                style={myStyle.textEdit}
              >
                <Text style={myStyle.textEdit}>Xem</Text>
              </TouchableOpacity>
              <Text>|</Text>
              <TouchableOpacity
                onPress={() => this.xoa(item.id, item.title.rendered)}
                style={myStyle.textEdit}
              >
                <Text style={myStyle.textEdit}>Xóa</Text>
              </TouchableOpacity>
              <Text>|</Text>
              <TouchableOpacity
                onPress={() => this.chinhsua(item.id)}
                style={myStyle.textEdit}
              >
                <Text style={myStyle.textEdit}>Chỉnh sửa</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    );
  }

  refesh() {
    this.loadData();
  }

  onBackButtonPress = () => {
    Alert.alert(
      "Thoát",
      "Bạn muốn thoát không",
      [
        { text: "Đồng ý", onPress: () => BackHandler.exitApp() },
        { text: "Hủy", style: "cancel" }
      ],
      { cancelable: false }
    );
    return true;
  };
}
const htmlTitleStyle = StyleSheet.create({
  span: {
    color: "#088A4B",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    marginBottom: 0,
    fontSize: 18
  }
});
const myStyle = StyleSheet.create({
    title: {
        color: '#088A4B',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        marginBottom: 0,
        fontSize: 18
    },
    excerpt: {
        //color: '#088A4B',
        paddingLeft: 10,
    },
    edit: {
        borderTopWidth: 1,
        borderColor: '#efefef',
        padding: 7,
        backgroundColor: 'rgba(210,210,210,0.1)',
        flexDirection: 'row',
        borderBottomStartRadius: 8,
        borderBottomEndRadius: 8
    },
    textEdit: {
        fontWeight: 'bold',
        flex: 1,
        color: '#36BC63',
        //color: "lightgreen",
        alignItems: 'center'
    },
    baibao: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginTop: 5,
        marginRight: 5,
        marginLeft: 5,
        backgroundColor: '#fff',
    }
});

const chars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const Base64 = {
  btoa: input => {
    let str = input;
    let output = "";

    for (
      let block = 0, charCode, i = 0, map = chars;
      str.charAt(i | 0) || ((map = "="), i % 1);
      output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
    ) {
      charCode = str.charCodeAt((i += 3 / 4));

      if (charCode > 0xff) {
        throw new Error(
          "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."
        );
      }

      block = (block << 8) | charCode;
    }

    return output;
  },

  atob: input => {
    let str = input.replace(/=+$/, "");
    let output = "";

    if (str.length % 4 == 1) {
      throw new Error(
        "'atob' failed: The string to be decoded is not correctly encoded."
      );
    }
    for (
      let bc = 0, bs = 0, buffer, i = 0;
      (buffer = str.charAt(i++));
      ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
        ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
        : 0
    ) {
      buffer = chars.indexOf(buffer);
    }

    return output;
  }
};

export default DSBaiBao;
