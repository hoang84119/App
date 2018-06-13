import React, { Component } from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import LoginToPost from "./src/navigations/LogiToPost";
import PostTo from "./src/navigations/PostTo";
import API from "./src/API";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      logged: false
    };
    console.log("constructor");
  }

  componentDidMount() {
    API.validate_auth_cookie().then(response => {
      this.setState({
        logged: API.validate_auth_cookie(),
        loading: false
      });
    });
  }

  render() {
    let loadingView = (
      <View style={myStyle.nen}>
        <View style={myStyle.khung}>
          <ActivityIndicator size="large" color="white" />
          <Text>Đang tải dữ liệu</Text>
        </View>
      </View>
    );
    let mainView = this.state.loading ? (
      loadingView
    ) : this.state.logged ? (
      <PostTo />
    ) : (
      <LoginToPost />
    );
    return mainView;
  }
}

export default App;
const myStyle = StyleSheet.create({
  nen: {
    flex: 1,
    backgroundColor: "#36BC63"
  },
  khung: {
    flex: 0.4,
    height: 100,
    flexDirection: "row",
    justifyContent: "center"
  }
});
