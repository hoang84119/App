import React, { Component } from "react";
import {
  View,
  Text,
  CameraRoll,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import ItemImage from "./items/ItemImage";
import Feather from "react-native-vector-icons/Feather";

const width = (Dimensions.get("window").width - 40) / 3;

export default class ImagePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      refreshing: true,
      selectedPhotos: new Set()
    };
  }
  componentDidMount() {
    this._loadImages();
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#000",
          paddingLeft: 10,
          paddingTop: 10
        }}
      >
        <FlatList
          numColumns={3}
          refreshing={this.state.refreshing}
          onRefresh={this._refresh}
          data={this.state.photos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this._renderItem}
        />
        <TouchableOpacity
          onPress={this._selectedPhotos}
          style={myStyle.selectButton}
        >
          <Feather
            style={{ color: "white" }}
            name="send"
            size={25}
          />
          {/* <Text style={{
              marginLeft: -12,
              marginBottom: -20,
              width: 17,
              height: 17,
              textAlign: 'center',
              backgroundColor: "#000",
              color: "#fff",
              borderRadius: 10,
              padding: 1,
              fontSize: 11
            }}>{this.state.selectedPhotos.size}</Text> */}
        </TouchableOpacity>
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
      item={item}
      key={index}
      width={width}
      addPhoto={this._addPhoto}
      removePhoto={this._removePhoto}
    />
  );

  _addPhoto = photo => {
    //this.setState({ selectedPhotos: this.state.selectedPhotos.add(photo) });
    this.setState(state=>{
      const selectedPhotos =new Set(state.selectedPhotos);
      selectedPhotos.add(photo);
      return {selectedPhotos};
    })
  };

  _removePhoto = photo => {
    //this.setState({ selectedPhotos: this.state.selectedPhotos.delete(photo) });
    this.setState(state=>{
      const selectedPhotos =new Set(state.selectedPhotos);
      selectedPhotos.delete(photo);
      return {selectedPhotos};
    })
  };

  _selectedPhotos = ()=>{

  }
}

const myStyle = StyleSheet.create({
  selectButton: {
    flexDirection: "row",
    position: "absolute",
    width: 50,
    height: 50,
    bottom: 0,
    right: 0,
    backgroundColor: "#FF3333",
    zIndex: 1,
    margin: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 20, height: 20 },
    shadowOpacity: 1.0,
    shadowRadius: 10,
    elevation: 5
  },
});
