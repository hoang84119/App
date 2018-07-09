import React, { Component } from "react";
import { View, Text, CameraRoll, FlatList, Image,Dimensions } from "react-native";
import ItemImage from './items/ItemImage';

const width = (Dimensions.get("window").width-40)/3;

export default class ImagePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      refreshing: true,
      selectedPhotos: new Set(),
      
    };
  }
  componentDidMount() {
    this._loadImages();
  }

  render() {
    return (
      <View style={{ flex: 1,backgroundColor:"#000",paddingLeft:10,paddingTop:10 }}>
        <FlatList
          numColumns={3}
          refreshing={this.state.refreshing}
          onRefresh={this._refresh}
          data={this.state.photos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this._renderItem}
        />
      </View>
    );
  }

  _refresh = () => {
    this._loadImages();
  };

  _loadImages = () => {
    CameraRoll.getPhotos({
      first: 20,
      assetType: "Photos"
    })
      .then(r => {
        this.setState({ photos: r.edges, refreshing: false });
      })
      .catch(err => {
        console.log(err);
      });
  };

  _renderItem = ({ item, index }) => (
    <ItemImage
      src={item.node.image.uri}
      key={index}
      width={width}
    />
  );
}
