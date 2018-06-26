import React, { Component } from "react";
import {
  Alert,
  FlatList,
  BackHandler,
  View,
  TouchableOpacity,
  ToastAndroid,
  AsyncStorage,
  Text
} from "react-native";
import API from "../../config/API";
import IonIcon from "react-native-vector-icons/Ionicons";
import ItemCategory from "./items/ItemCategory";
import Base64 from "../../config/Base64";
import { connect } from "react-redux";

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: "",
      refreshing: true
    };
  }
  componentDidMount() {
    this._loadData();
  }
  render() {
    let ButtonRight =
      this.props.dataUser.name === "admin" ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0)"
          }}
        >
          <TouchableOpacity onPress={() => this._onAdd()}>
            <IonIcon
              style={{ marginLeft: 10, marginRight: 10, color: "#088A4B" }}
              name="ios-add-outline"
              size={42}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this._onLogout()}>
            <IonIcon
              style={{ marginLeft: 5, marginRight: 10, color: "#088A4B" }}
              name="ios-log-out-outline"
              size={32}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0)"
          }}
        >
          <TouchableOpacity onPress={() => this._onLogin()}>
            <IonIcon
              style={{ marginLeft: 10, marginRight: 10, color: "black" }}
              name="md-contact"
              size={36}
            />
          </TouchableOpacity>
        </View>
      );
    return (
      <View style={{ flex: 1, backgroundColor: "#fcfcfc" }}>
        <View
          style={{
            height: 50,
            color: "white",
            justifyContent: "space-between",
            flexDirection: "row"
          }}
        >
          <Text style={{ justifyContent: "center" }}>Bài viết</Text>
          {ButtonRight}
        </View>
        <FlatList
          refreshing={this.state.refreshing}
          onRefresh={() => this._loadData()}
          data={this.state.data}
          keyExtractor={(item, index) => item.id}
          renderItem={({ item }) =>
            item.parent === 0 && (
              <ItemCategory
                data={item}
                navigation={this.props.navigation}
                delete={this._delete}
                userName={this.props.dataUser.name}
                level={0}
              />
            )
          }
        />
      </View>
    );
  }

  _loadData() {
    this.setState({ refreshing: true });
    fetch(API.getURL() + "/thuctap/wp-json/wp/v2/categories")
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson == null) {
          Alert.alert("Lỗi", "Không có nội dung");
        } else {
          this.setState({ data: responseJson, refreshing: false });
        }
      });
  }

  _delete = (i, t) => {

    Alert.alert(
      "Thông báo",
      "Bạn có thật sự muốn xóa ''" + t + "'' không?",
      [
        {
          text: "Xóa",
          onPress: () => {
            API.RemoveCategory(i).then(response => {
              if (response === true) {
                ToastAndroid.show("Xóa thành công !", ToastAndroid.LONG);
                this._loadData();
              } else Alert.alert("Cảnh báo", "Xóa thất bại!");
            });
          }
        },
        { text: "Hủy", style: "cancel" }
      ],
      { cancelable: false }
    );
  };
}

function mapStateToProps(state) {
  return { dataUser: state.dataUser };
}
export default connect(mapStateToProps)(Categories);
