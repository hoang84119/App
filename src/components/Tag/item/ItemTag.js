import React, { Component } from "react";
import {
  View,ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Text
} from "react-native";
import Feather from "react-native-vector-icons/Feather";

var randomImages = [
  require('../../../image/tag/img0.jpg'),
  require('../../../image/tag/img1.jpg'),
  require('../../../image/tag/img2.jpg'),
  //require('../../../image/tag/img3.jpg'),
  require('../../../image/tag/img4.jpg'),
  require('../../../image/tag/img5.jpg'),
  require('../../../image/tag/img6.jpg'),
  require('../../../image/tag/img7.jpg'),
  require('../../../image/tag/img8.jpg'),
  //require('../../../image/tag/img9.jpg'),
];

class ItemCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      featured_media: "",
      loaded: false,
      hasChild: false,
      dataChild: []
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  render() {
    return (
      <ImageBackground source={randomImages[Math.floor(Math.random()*randomImages.length)]} style={myStyle.cardItem}>
        <TouchableOpacity onPress={this._xem} style={myStyle.btnNoiDung}>
          <Text style={myStyle.noiDung}>{this.props.data.name}</Text>
          <Text style={myStyle.moTa}>{this.props.data.description}</Text>
        </TouchableOpacity>
        {this.props.userName === "admin" && (
          <View style={myStyle.buttons}>
            <TouchableOpacity onPress={this._chinhsua} style={myStyle.btn}>
              <Feather style={myStyle.icon} name="edit" size={15} />
            </TouchableOpacity>
            <TouchableOpacity onPress={this._xoa} style={myStyle.btn}>
              <Feather style={myStyle.icon} name="trash" size={15} />
            </TouchableOpacity>
          </View>
        )}
      </ImageBackground>
    );
  }

  _xem = () => {
    this.props.navigation.navigate("Posts", {
      idTag: this.props.data.id,
      nameTag: this.props.data.name
    });
  };

  _xoa = () => {
    this.props.delete(this.props.data.id, this.props.data.name);
  };

  _chinhsua = () => {
    this.props.navigation.navigate("EditTag", { id: this.props.data.id });
  };
}

const myStyle = StyleSheet.create({
  cardItem: {
    overflow: 'hidden',
    flexDirection: "row",
    marginTop: 8,
    marginBottom: 2,
    marginHorizontal: 8,
    padding: 10,
    paddingVertical: 25,
    borderRadius: 8,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.8,
    elevation: 2
  },
  btnNoiDung: { paddingLeft: 20 },
  noiDung: {
    fontWeight: "bold", 
    fontSize: 18, 
    color: "#fff", 
    marginBottom: 10 },
  moTa: { 
    fontStyle: "italic", 
    color: "#fafafa" },
  buttons: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end"
  },
  icon: { marginLeft: 5, marginRight: 10, color: "#fafafa" }
});

export default ItemCategory;
