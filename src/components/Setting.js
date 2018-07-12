import React, { Component } from "react";
import {
  View,
  Text,
  AsyncStorage,
  TextInput,
  TouchableOpacity
} from "react-native";
import API from "../config/API";
import RNRestart from 'react-native-restart';

class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: ""
    };
  }
  componentDidMount(){
    this.setState({url:API.getURL()});
  }
  render() {
    return (
      <View>
        <TextInput
          onChangeText={p => {
            this.setState({ url: p });
          }}
          value={this.state.url}
          placeholder="Địa chỉ trang web"
        />
        <TouchableOpacity onPress={this._addURL}>
          <Text>Lưu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  _addURL = ()=>{
    AsyncStorage.setItem("URL", this.state.url).then(()=>{
        RNRestart.Restart();
    })
  }
}

export default Setting;
