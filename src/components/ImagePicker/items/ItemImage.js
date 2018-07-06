import React, { Component } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableWithoutFeedback
} from "react-native";
import Feather from "react-native-vector-icons/Feather";

class ItemImage extends Component {
  constructor(props) {
    super(props);
    this.state = { checked: false };
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this._onPress}>
        <ImageBackground
          source={{ uri: this.props.src }}
          style={{
            width: this.props.width,
            height: this.props.width,
            marginRight: 10,
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "flex-start"
          }}
        >
          {!this.state.checked && (
            <Feather
              style={{
                color: "#fff",
                margin:10
              }}
              name="circle"
              size={25}
            />
          )}
          {this.state.checked && (
            <TouchableWithoutFeedback onPress={this._onPress}>
            <View
              style={{
                width: this.props.width,
                height: this.props.width,
                backgroundColor: "rgba(100,100,100,0.5)",
                //marginRight: 10,
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "flex-start"
              }}
            >
              <Feather
                style={{
                  color: "#fff",
                  margin:10
                }}
                name="check-circle"
                size={25}
              />
            </View>
            </TouchableWithoutFeedback>
          )}
        </ImageBackground>
      </TouchableWithoutFeedback>
    );
  }

  _onPress = ()=>{
      this.setState({checked:!this.state.checked})
  }
}

export default ItemImage;
