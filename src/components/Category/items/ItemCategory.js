import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  FlatList
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import API from "../../../config/API";
import Feather from "react-native-vector-icons/Feather";
import Categories from "../Categories";

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
    this.setState({ loaded: false }, this._checkChild());
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps != this.props) {
      this._checkChild();
    }
  }

  _checkChild() {
    //this.setState({ loaded: false });
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
      <View
        style={{
          marginLeft: 4 + this.props.level
        }}
      >
        <TouchableOpacity onPress={this._xem} style={[myStyle.cardItem,{backgroundColor:color[this.props.level],borderColor:borderColor[this.props.level]}]}>
          <View style={myStyle.btnNoiDung}>
            <Text style={myStyle.noiDung}>{this.props.data.name}</Text>
            <Text style={myStyle.moTa}>{this.props.data.description}</Text>
          </View>
          {this.props.userName === "admin" && (
            <View style={myStyle.buttons}>
              <TouchableOpacity onPress={this._chinhsua} style={myStyle.btn}>
                <FontAwesome style={myStyle.icon} name="edit" size={20} />
              </TouchableOpacity>
              <TouchableOpacity onPress={this._xoa} style={myStyle.btn}>
                <Feather style={myStyle.icon} name="trash" size={20} />
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>

        {/* {this.props.level === 0 && (
          <TouchableOpacity onPress={this._xem} style={myStyle.cardItem}>
            <View style={myStyle.btnNoiDung}>

              <Text style={myStyle.noiDung}>{this.props.data.name}</Text>
              <Text style={myStyle.moTa}>{this.props.data.description}</Text>
            </View>
            {this.props.userName === "admin" && (
              <View style={myStyle.buttons}>
                <TouchableOpacity onPress={this._chinhsua} style={myStyle.btn}>
                  <FontAwesome style={myStyle.icon} name="edit" size={20} />
                </TouchableOpacity>
                <TouchableOpacity onPress={this._xoa} style={myStyle.btn}>
                  <Feather style={myStyle.icon} name="trash" size={20} />
                </TouchableOpacity>
              </View>
            )}

          </TouchableOpacity>
        )}

        {this.props.level != 0 &&
          (this.props.level % 2 == 0 && (
            <TouchableOpacity onPress={this._xem} style={myStyle.cardItemChild}>
              <View style={myStyle.btnNoiDung}>
                <Text style={myStyle.noiDung}>
                  {" " + this.props.data.name}
                </Text>
                <Text style={myStyle.moTa}>{this.props.data.description}</Text>
              </View>
              <View style={myStyle.buttons}>
                <TouchableOpacity onPress={this._chinhsua} style={myStyle.btn}>
                  <FontAwesome style={myStyle.icon} name="edit" size={20} />
                </TouchableOpacity>
                <TouchableOpacity onPress={this._xoa} style={myStyle.btn}>
                  <Feather style={myStyle.icon} name="trash" size={20} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}

        {this.props.level != 0 &&
          (this.props.level % 2 != 0 && (
            <TouchableOpacity onPress={this._xem} style={[myStyle.cardItemChild, { borderColor: "#0ABFBC", backgroundColor: "#e0f0f3" }]}>
              <View style={myStyle.btnNoiDung}>
                <Text style={myStyle.noiDung}>
                  {" " + this.props.data.name}
                </Text>
                <Text style={myStyle.moTa}>{this.props.data.description}</Text>
              </View>
              <View style={myStyle.buttons}>
                <TouchableOpacity onPress={this._chinhsua} style={myStyle.btn}>
                  <FontAwesome style={myStyle.icon} name="edit" size={20} />
                </TouchableOpacity>
                <TouchableOpacity onPress={this._xoa} style={myStyle.btn}>
                  <Feather style={myStyle.icon} name="trash" size={20} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))} */}

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

const color = [
  "#FFF0F5",
  "#e0f0f3",
  "#FFFFE0",
  "#d5ffd5",
  "#ffd3a8",
  "#ffff9f"
];
const borderColor = [
  "#d72626",
  "#0ABFBC",
  "#FFEC8B",
  "#008B00",
  "#ff8000",
  "#ffff00"
];

const myStyle = StyleSheet.create({
  cardItem: {
    borderLeftWidth: 3,
    //borderColor: "#d72626",
    flexDirection: "row",
    padding: 10,
    //backgroundColor: "#FFF0F5",
    justifyContent: "space-between",
    marginVertical: 2,
    marginRight: 4
  },
  cardItemChild: {
    borderLeftWidth: 3,
    flexDirection: "row",
    borderColor: "#FFEC8B",
    padding: 5,
    marginVertical: 2,
    marginRight: 4,
    backgroundColor: "#FFFFE0",
    justifyContent: "space-between"
  },
  btnNoiDung: {},
  noiDung: {
    //fontWeight: "bold",
    fontSize: 16,
    color: "#000",
    marginBottom: 5
  },
  moTa: { fontStyle: "italic" },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  icon: {
    marginLeft: 5,
    marginRight: 10,
    color: "#0ABFBC"
  }
});

export default ItemCategory;
