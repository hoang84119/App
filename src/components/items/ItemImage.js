import React, { Component } from 'react';
import { View,TouchableOpacity,Text,Image,ToastAndroid } from 'react-native';

class ItemImage extends Component {
  _onLongPress = () => {
    this.props.onLongPressItem(this.props.id);
  };
  _onPress = () => {
    if (this.props.hasSelected) this.props.onLongPressItem(this.props.id);
    else {
      this.props.navigation.navigate("scchitiet", { id: this.props.id });
      //ToastAndroid.show(this.props.title + "", ToastAndroid.SHORT);
    }
  };
  render() {
    const ColorSelected = this.props.selected ? "red" : "rgba(255,255,255,0.3)";
    return (
      <View style={{ flex: 1, margin: 2 }}>
        <TouchableOpacity
          onLongPress={this._onLongPress}
          onPress={this._onPress}
        >
          <Image
            source={{
              uri: this.props.guid
            }}
            style={{ weight: 1, height: 200, resizeMode: "cover" }}
          />
          <Text
            style={{
              padding: 2,
              height: 22,
              marginTop: -50,
              //backgroundColor: "rgba(255,255,255,0.3)"
              backgroundColor: ColorSelected
            }}
          >
            {this.props.title}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default ItemImage