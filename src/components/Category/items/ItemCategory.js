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
import HTML from "react-native-render-html";
import Base64 from "../../../config/Base64";
import API from "../../../config/API";
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

  componentDidMount() {
    this._checkChild();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data != this.props.data) {
      this._checkChild();
    }
  }

  _checkChild() {
    this.setState({ loaded: false });
    fetch(
      `${API.getURL()}/thuctap/wp-json/wp/v2/categories?parent=${
        this.props.data.id
      }`
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson == null) {
          //this.setState(da)
        } else {
          this.setState({ dataChild: responseJson, loaded: true });
        }
      });
  }

  render() {
    return (
      <View style={{marginLeft: 20*this.props.level}}>
        <View style={myStyle.cardItem}>
          <TouchableOpacity onPress={this._xem} style={myStyle.btnNoiDung}>
            <Text style={myStyle.noiDung}>{this.props.data.name}</Text>
            <Text style={myStyle.moTa}>{this.props.data.description}</Text>
          </TouchableOpacity>
          <View style={myStyle.buttons}>
            <TouchableOpacity onPress={this._chinhsua} style={myStyle.btn}>
              <Feather style={myStyle.icon} name="edit-2" size={20} />
            </TouchableOpacity>
            <TouchableOpacity onPress={this._xoa} style={myStyle.btn}>
              <Feather style={myStyle.icon} name="trash" size={20} />
            </TouchableOpacity>
          </View>
        </View>
        {this.state.loaded && (
          <FlatList
            data={this.state.dataChild}
            keyExtractor={(item, index) => item.id}
            renderItem={({ item }) => (
              <ItemCategory
                data={item}
                navigation={this.props.navigation}
                delete={(id, title) => this.props.delete(id, title)}
                userName={this.props.userName}
                level={this.props.level + 1}
              />
            )}
          />
        )}
      </View>
    );
  }

  _xem = () => {
    //this.getSrcImage(t);
    this.props.navigation.navigate("Posts", {
      idCategory: this.props.data.id,
      nameCategory: this.props.data.name
    });
  };
  _xoa = () => {
    this.props.delete(this.props.data.id, this.props.data.name);
  };
  _chinhsua = () => {
    this.props.navigation.navigate("EditCategory", { id: this.props.data.id });
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
    borderRadius: 5,
    justifyContent: "space-between"
  },
  btnNoiDung: {},
  noiDung: { fontWeight: "bold", fontSize: 20, color: "#000", marginBottom: 5 },
  moTa: { fontStyle: "italic" },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  icon: { marginLeft: 5, marginRight: 10, color: "#088A4B" }
});

export default ItemCategory;
