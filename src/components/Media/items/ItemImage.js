// Hiển thị hình ảnh trong media
import React, { Component } from 'react';
import { View, Text, Image, TouchableWithoutFeedback } from 'react-native';
import IonIcon from "react-native-vector-icons/Ionicons"

class ItemImage extends Component {
  _onLongPress = () => {
    this.props.onLongPressItem(this.props.id);
  };
  _onPress = () => {
    if (this.props.hasSelected) this.props.onLongPressItem(this.props.id);
    else {
      this.props.navigation.navigate("scchitiet", { id: this.props.id });
  }
  };
  render() {
    const zIndexAuTo = this.props.selected? 1:-1

    return (
      <View style={{ margin: 2,flex: 1, }}>
        <TouchableWithoutFeedback
          onLongPress={this._onLongPress}
          onPress={this._onPress}
        >
          <View>
            <Image
              source={{
                uri: this.props.guid
              }}
              style={{ weight: 1, height: 200, resizeMode: "cover" }}
            />
            <View style={{
              weight: 1,
              height: 200,
              marginTop: -200,
              zIndex: zIndexAuTo,
              backgroundColor: "rgba(255,255,255,0.9)",
              justifyContent: "center",
              alignItems: "center",
            }}>
              <IonIcon style={{marginTop:-25, color: '#afafaf'}} name= "ios-close-circle-outline" size ={50}/>
            </View>
            <Text
              style={{
                zIndex: 0,
                padding: 2,
                height: 22,
                marginTop: -50,
                backgroundColor: "rgba(255,255,255,0.3)"
              }}
            >
              {this.props.title}
            </Text>
            
          </View>

        </TouchableWithoutFeedback>
      </View>
    );
  }
}

export default ItemImage