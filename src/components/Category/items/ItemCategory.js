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
      hasChild: false,
      dataChild: [],
      isOpen: false,
      iconName:"chevron-right",
    };
  }

  componentDidMount() {
    this.setState({ hasChild: false }, this._checkChild());
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps != this.props) {
      this._checkChild();
    }
  }

  _checkChild() {
    fetch(
      `${API.getURL()}/wp-json/wp/v2/categories?parent=${
        this.props.data.id
      }`
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.length === 0) {
          this.setState({ hasChild: false });
        } else {
          this.setState({ dataChild: responseJson, hasChild: true });
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
        <TouchableOpacity
          onPress={this._xem}
          style={[
            myStyle.cardItem,
            {
              backgroundColor: color[this.props.level],
              borderColor: borderColor[this.props.level]
            }
          ]}
        >
          <View style={myStyle.btnNoiDung}>
            <Text style={myStyle.noiDung}>{this.props.data.name}</Text>
            <Text style={myStyle.moTa}>{this.props.data.description}</Text>
          </View>
          {this.state.hasChild && (
            <View style={myStyle.buttons}>
              <TouchableOpacity onPress={this._showChild} style={myStyle.btn}>
                <Feather style={myStyle.icon} name={this.state.iconName} size={24} />
              </TouchableOpacity>
            </View>
          )}
          {this.props.userName === "admin" && (
            <View style={myStyle.buttons}>
              <TouchableOpacity onPress={this._chinhsua} style={myStyle.btn}>
                <FontAwesome style={myStyle.icon} name="edit" size={15} />
              </TouchableOpacity>
              <TouchableOpacity onPress={this._xoa} style={myStyle.btn}>
                <Feather style={myStyle.icon} name="trash" size={15} />
              </TouchableOpacity>
            </View>
          )}
          
        </TouchableOpacity>
        {this.state.isOpen && (
          <FlatList
            data={this.state.dataChild}
            keyExtractor={(item, index) => item.id.toString()}
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
  _showChild = () => {
    if (this.state.isOpen) this.setState({ isOpen: false,iconName:"chevron-right" });
    else this.setState({ isOpen: true,iconName:"chevron-down" });
  };
}

const color = [
  "#FFF0F5", // Đỏ
  "#e0f0f3", // Lam
  "#d5ffd5", // Lục
  "#FFFFE0", // Vàng
  "#ffd3a8", // Da cam
  "#CD96CD" // Tím
];
const borderColor = [
  "#d72626", // Đỏ
  "#0ABFBC", // Lam
  "#3CB371", // Lục
  "#FFEC8B", // Vàng
  "#FFA07A", // Da cam
  "#8B4789" // Tím
];

const myStyle = StyleSheet.create({
  cardItem: {
    borderLeftWidth: 3,
    //borderColor: "#d72626",
    flexDirection: "row",
    padding: 10,
    //backgroundColor: "#FFF0F5",
    justifyContent: "space-between",
    marginVertical: 3,
    marginRight: 4,
    borderRadius: 2,
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
  btnNoiDung: { flex: 5 },
  noiDung: {
    fontSize: 16,
    color: "#000",
    marginBottom: 5
  },
  moTa: { fontStyle: "italic" },
  buttons: {
    //flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight:5
  },
  icon: {
    marginHorizontal: 5,
    color: "#0ABFBC"
  }
});

export default ItemCategory;
