import React, { Component } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Image,
  TouchableOpacity,
  Text,
  AsyncStorage,
  ToastAndroid
} from "react-native";
import { connect } from "react-redux";
import Feather from "react-native-vector-icons/Feather";

class SlideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    var accountView =
      this.props.dataUser.length != 0 ? (
        <ImageBackground
          source={require("../image/Material-Background.png")}
          style={myStyle.imageBackground}
        >
          <Image
            style={myStyle.avatar}
            source={{ uri: this.props.dataUser.avatar_urls[96] }}
          />
          <Text style={myStyle.name}>{this.props.dataUser.name}</Text>
        </ImageBackground>
      ) : (
        <TouchableOpacity onPress={()=>this.props.navigation.navigate("Login")} style={myStyle.button}>
          <Feather style={myStyle.icon} name="log-in" size={25} />
          <Text>Đăng nhập</Text>
        </TouchableOpacity>
      );
    return (
      <ScrollView>
        <View style={myStyle.container}>
          {accountView}
          <TouchableOpacity onPress={()=>this.props.navigation.navigate("Home")} style={myStyle.button}>
            <Feather style={myStyle.icon} name="home" size={25} />
            <Text>Trang chủ</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.props.navigation.navigate("Account")} style={myStyle.button}>
            <Feather style={myStyle.icon} name="user" size={25} />
            <Text>Tài khoản</Text>
          </TouchableOpacity>
          <TouchableOpacity style={myStyle.button}>
            <Feather style={myStyle.icon} name="settings" size={25} />
            <Text>Cài đặt</Text>
          </TouchableOpacity>
          <TouchableOpacity style={myStyle.button}>
            <Feather style={myStyle.icon} name="info" size={25} />
            <Text>Giới thiệu</Text>
          </TouchableOpacity>
          {this.props.dataUser.length != 0 && (
            <TouchableOpacity onPress={this._onLogout} style={myStyle.button}>
              <Feather style={myStyle.icon} name="log-out" size={25} />
              <Text>Đăng xuất</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    );
  }
  _onLogout = () => {
    AsyncStorage.removeItem("Base64").then(() => {
      this.props.dispatch({
        type: "DeleteDataUser"
      });
      ToastAndroid.show("Đã đăng xuất", ToastAndroid.LONG);
      //BackHandler.exitApp();
    });
  }
}

const myStyle = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
    //backgroundColor: 'blue',
  },
  imageBackground: {
    height: 150,
    flexDirection: "column",
    //alignItems: "flex-end",
    justifyContent: "flex-end"
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    margin: 10
  },
  name: {
    color: "#fff",
    margin: 10,
    fontSize: 16
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    paddingHorizontal: 10
  },
  icon: {
    marginRight: 10,
    marginLeft: 3,
    color: "#868686"
  }
});

function mapStateToProps(state) {
  return { dataUser: state.dataUser };
}
export default connect(mapStateToProps)(SlideMenu);