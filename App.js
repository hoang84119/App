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
  }

  componentDidMount() {
    API.validate_auth_cookie().then(response => {
      this.setState({
        logged: response,
        loading: false
      });
    });

  }

  render() {
    let loadingView = (
      <View style={{ flex: 1, padding: 5, backgroundColor:'#36BC63' }}>
        <View style={myStyle.khung}>
          <ActivityIndicator size="large" color="white" />
          <Text style={{color:"white"}}>Đang tải dữ liệu...</Text>
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
  khung: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    
  }
});
