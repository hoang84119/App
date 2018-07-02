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


class StatusBar extends Component {
    state = {  }
    render() {
        return (
            <View style={{height:50, backgroundColor:"blue"}}></View>
        );
    }
}

export default StatusBar;