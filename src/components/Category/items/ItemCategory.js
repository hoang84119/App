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
import IonIcon from "react-native-vector-icons/Ionicons";

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
      <View>
        <View
          style={{
            flex: 1,
            backgroundColor: "#fcfcfc",
            marginLeft: 20 * this.props.level
          }}
        >
          <View style={myStyle.noidung}>
            <TouchableOpacity
              onPress={() => this.xem(this.props.data.id, this.props.data.name)}
            >
              <View style={{ flexDirection: "column" }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center"
                  }}
                >
                  <Text style={myStyle.TieuDe}>{this.props.data.name}</Text>
                </View>
                {this.props.userName === "admin" && (
                  <View style={myStyle.edit}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.delete(
                          this.props.data.id,
                          this.props.data.name
                        )
                      }
                      style={{
                        paddingLeft: 5,
                        flex: 1,
                        alignItems: "center",
                        flexDirection: "row"
                      }}
                    >
                      <IonIcon name="ios-trash-outline" size={20} />
                      <Text style={myStyle.textEdit}> Xóa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.chinhsua(this.props.data.id)}
                      style={{
                        flex: 1,
                        alignItems: "center",
                        flexDirection: "row"
                      }}
                    >
                      <IonIcon name="ios-create-outline" size={20} />
                      <Text style={myStyle.textEdit}> Chỉnh sửa</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {this.state.loaded && (
          <FlatList
            //refreshing={!this.state.loaded}
            //onRefresh={() => this._checkChild()}
            data={this.state.dataChild}
            keyExtractor={(item, index) => item.id}
            renderItem={
              ({ item }) => (
                //item.parent === 0 && (
                <ItemCategory
                  data={item}
                  navigation={this.props.navigation}
                  delete={(id, title) => this.props.delete(id, title)}
                  userName={this.props.userName}
                  level={this.props.level + 1}
                />
              )
              //)
            }
          />
        )}
      </View>
    );
  }

  xem(i, t) {
    //this.getSrcImage(t);
    //this.props.navigation.navigate("chitiet", { id: i });
  }
  xoa(i, t) {
    this.props.delete(i, t);
  }
  chinhsua(i) {
    this.props.navigation.navigate("EditCategory", { id: i });
  }
}

const myStyle = StyleSheet.create({
  TieuDe: {
    // paddingLeft: 5,
    // paddingRight: 5,
    //height: 70,
    padding:10,
    fontSize: 20,
    fontWeight: "bold"
  },
  excerpt: {
    //color: '#088A4B',
    paddingLeft: 10
  },
  edit: {
    height: 34,
    borderTopWidth: 1,
    borderColor: "#fafafa",
    padding: 7,
    backgroundColor: "#fdfdfd",
    flexDirection: "row"
    // borderBottomStartRadius: 8,
    // borderBottomEndRadius: 8
  },
  textEdit: {
    fontSize: 12,
    fontWeight: "100",
    flex: 1,
    //color: "#36BC63",
    color: "#6f6f6f",
    justifyContent: "center",
    alignItems: "center"
  },
  noidung: {
    //borderWidth: 1,
    borderWidth: 1,
    borderColor: "#f6f6f6",
    marginTop: 5,
    marginRight: 5,
    marginLeft: 5,
    backgroundColor: "#fff"
  },
  hinh: {
    width: 150,
    height: 104
  }
});

export default ItemCategory;
