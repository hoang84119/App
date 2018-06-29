import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  ToastAndroid,
  Text,
  Alert,
  FlatList
} from "react-native";
import Feather from "react-native-vector-icons/Feather";

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

  componentWillReceiveProps(nextProps) {
  }

  render() {
    return (
      <View style={myStyle.cardItem}>
        <TouchableOpacity onPress={this._xem} style={myStyle.btnNoiDung}>
          <Text style={myStyle.noiDung}>{this.props.data.name}</Text>
          <Text style={myStyle.moTa}>{this.props.data.description}</Text>
        </TouchableOpacity>
        <View style={myStyle.buttons}>
          <TouchableOpacity onPress={this._chinhsua} style={myStyle.btn}>
            <Feather style={myStyle.icon} name="edit" size={15} />
          </TouchableOpacity>
          <TouchableOpacity onPress={this._xoa} style={myStyle.btn}>
            <Feather style={myStyle.icon} name="trash" size={15} />
          </TouchableOpacity>
        </View>
      </View>
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
    borderWidth: 1,
    flexDirection: "row",
    borderColor: "#d3d3d3",
    margin: 5,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 3,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.8,
    elevation: 1,
  },
  btnNoiDung: {paddingLeft:10},
  noiDung: {fontWeight: "200", fontSize:18, color:"#000",marginBottom:5},
  moTa: {fontStyle: "italic"},
  buttons: {flexDirection:"row", alignItems: "flex-end",justifyContent:"flex-end"},
  icon: { marginLeft: 5, marginRight: 10, color: "#868686" }
});

export default ItemCategory;
