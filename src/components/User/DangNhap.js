import React, { Component } from "react";
import {
  Text, View, StyleSheet, TextInput, TouchableOpacity,
  Alert, ActivityIndicator, AsyncStorage, Image,
  ImageBackground
} from "react-native";
import API from "../../config/API";

export default class App extends Component {
  state = {
    user: "",
    pass: "",
    isLoading: false
  };
  async loginNow() {
    this.setState({
      isLoading: true
    });
    if (this.state.user == "") {
      this.setState({
        isLoading: false
      });
      Alert.alert("Lỗi", "Tên đăng nhập không được rỗng");
    } else if (this.state.pass == "") {
      this.setState({
        isLoading: false
      });
      Alert.alert("Lỗi", "Mật khẩu không được rỗng");
    } else {
      try {
        API.generate_auth_cookie(this.state.user, this.state.pass).then(async response => {
          if (response.status == "error") {
            Alert.alert("Lỗi", "Sai tên đăng nhập hoặc mật khẩu");
            this.setState({
              isLoading: false
            });
          } else {
            this.setState({ isLoading: false });
            await AsyncStorage.setItem("Cookie", response.cookie);
            let value = await AsyncStorage.getItem("Cookie");
            this.props.navigation.navigate("MainScreen");
          }
        });
      } catch (e) {
        Alert.alert("Lỗi");
      }
    }
  }
  render() {
    return (
      <ImageBackground style={{ flex: 1 }} source={require('../../image/background.png')}>

        <View style={myStyle.nen}>
          <View style={myStyle.khungDangNhap} />
          <View style={{ alignItems: "center" }}>
            <Image
              style={{ width: 120, height: 120, marginBottom: 50 }}
              source={require("../../image/logo.png")}
            />
            <TextInput
              placeholderTextColor="white"
              underlineColorAndroid="rgba(0,0,0,0)"
              style={myStyle.ctmInput}
              onChangeText={u => {
                this.setState({ user: u });
              }}
              placeholder="Tên tài khoản"
            />
            <TextInput
              placeholderTextColor="white"
              underlineColorAndroid="rgba(0,0,0,0)"
              style={myStyle.ctmInput}
              onChangeText={p => {
                this.setState({ pass: p });
              }}
              placeholder="Mật khẩu"
              secureTextEntry={true}
            />
            {this.state.isLoading ===
              false && (
                <View style={{ height: 50, alignItems: "center" }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.loginNow();
                    }}
                  >
                    <Text style={myStyle.ctmBottom}>Đăng nhập</Text>
                  </TouchableOpacity>
                </View>
              )}
            {this.state.isLoading && (
              <ActivityIndicator size="large" color="white" />
            )}
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const myStyle = StyleSheet.create({
  ctmBottom: {
    borderRadius: 40,
    fontSize: 20,
    //color: "#36BC63",
    color: "#A0522D",
    paddingTop: 10,
    paddingLeft: 20,
    paddingBottom: 10,
    paddingRight: 20,
    backgroundColor: "white",
    textAlign: "center",
    width: 250
  },
  ctmInput: {
    marginBottom: 15,
    backgroundColor: "rgba(255,255,255,0.1)",
    fontSize: 20,
    height: 45,
    width: 250,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 40,
    color: "white"
  },
  nen: {
    flex: 1,
    //backgroundColor: "#36BC63"
  },
  header: {
    fontSize: 30,
    textAlign: "center",
    color: "white",
    marginBottom: 30
  },

  khungDangNhap: {
    flex: 0.4,
    height: 100,
    flexDirection: "row",
    justifyContent: "center"
  }
});
