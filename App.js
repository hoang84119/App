import React, { Component } from "react";
import {
  StatusBar,
  ImageBackground,
  Image,
  View,
  ActivityIndicator,
  Text,
  StyleSheet
} from "react-native";
import LoginToPost from "./src/navigations/LogiToPost";
import Tab from "./src/navigations/TabNavigator";
import API from "./src/config/API";
import { createStore } from "redux";
import { Provider } from "react-redux";
import PostTo from "./src/navigations/PostTo";
import DrawerNavigator from "./src/navigations/DrawerNavigator";

//Tạo store trong redux
const defaultState = { dataUser: [] };
const reducer = (state = defaultState, action) => {
  if (action.type === "SetDataUser") {
    return { dataUser: action.data };
    //{...,dataUser:action.data}
  }
  if (action.type === "DeleteDataUser") return { dataUser: [] };
  return state;
};
const store = createStore(reducer);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      logged: false
    };
  }

  componentDidMount() {
    API.validate_account().then(response => {
      if (response != null) {
        store.dispatch({
          type: "SetDataUser",
          data: response
        });
        this.setState({
          loading: false,
          logged: true
        });
      }
      else {
        this.setState({
          loading: false,
          logged: false
        });
      }
    });
  }

  render() {
    let loadingView = (
      <ImageBackground
        style={{ flex: 1 }}
        source={require("./src/image/background/Miaka.jpg")}
      >
        <StatusBar
          translucent
          backgroundColor="rgba(0, 0, 0, 0)"
          animated
        />
        <View style={{ flex: 1, padding: 5 }}>
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
    ) : <DrawerNavigator />
    // this.state.logged ? (
    //   <Tab />
    // ) : (
    //       <PostTo />
    //     );
    return (
      <Provider store={store}>
        {/* {mainView} */}
        {mainView}
      </Provider>
    );
  }
}

export default App;
const myStyle = StyleSheet.create({
  khung: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
