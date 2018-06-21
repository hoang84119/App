import React, { Component } from "react";
import { ImageBackground, Image, View, ActivityIndicator, Text, StyleSheet } from "react-native";
import LoginToPost from "./src/navigations/LogiToPost";
//import PostTo from "./src/navigations/PostTo";
import Tab from "./src/navigations/TabNavigator"
import API from "./src/API";

//Tạo store trong redux
// const defaultState={refreshingPosts: true};
// const reducer = (state = defaultState, action)=>{
//   if(action.type==='RefreshPost') return {refreshingPosts:true};
//   if(action.type==='DidRefreshPost') return {refreshingPosts:false}
//   return state;
// }
//const store = createStore(reducer);

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
      <ImageBackground style={{flex:1}} source={require('./src/image/background_blur.png')}>
        <View style={{ flex: 1, padding: 5}}>
          <View style={myStyle.khung}>
            <Image
              style={{ width: 100, height: 100, marginBottom: 25 }}
              source={require("./src/image/logo.png")}
            />
            <ActivityIndicator size="large" color="white" />
          </View>
        </View>
      </ImageBackground>
    );
    let mainView = this.state.loading ? (
      loadingView
    ) : this.state.logged ? (
      <Tab />
    ) : (
          <LoginToPost />
        );
    return mainView;
      //<Provider store={store}>
      //</Provider>
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
