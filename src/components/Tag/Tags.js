import React, { Component } from "react";
import {
  Alert,
  FlatList,
  View,
  TouchableOpacity,
  ToastAndroid,
  Text,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import API from "../../config/API";
import Feather from "react-native-vector-icons/Feather";
import ItemTag from "./item/ItemTag";
import { connect } from "react-redux";

class Tags extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      refreshing: true,
      page: 1,
      over: false,
      loading: false
    };
  }
  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    this.props.navigation.addListener("didFocus", () => {
      this._refreshing();
    });
  }
  render() {
    let ButtonRight =
      this.props.dataUser.name === "admin" ? (
        <View style={myStyle.buttons}>
          <TouchableOpacity onPress={() => this._onAdd()}>
            <Feather style={myStyle.icon} name="plus" size={34} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this._onLogout()}>
            <Feather style={myStyle.icon} name="log-out" size={24} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={myStyle.buttons}>
          <TouchableOpacity onPress={() => this._onLogin()}>
            <Feather style={myStyle.icon} name="user" size={34} />
          </TouchableOpacity>
        </View>
      );
    return (
      <View style={myStyle.container}>
        {/* Thanh bar */}
        <View style={myStyle.headerTitleBar}>
          <View style={myStyle.headerTitle}>
            <Text style={myStyle.title}>Quản lý Thẻ</Text>
          </View>
          {ButtonRight}
        </View>

        {/* Noi dung */}
        <FlatList
          style={myStyle.item}
          refreshing={this.state.refreshing}
          onRefresh={() => this._refreshing()}
          data={this.state.data}
          keyExtractor={(item, index) => item.id}
          renderItem={({ item }) => (
            <ItemTag
              data={item}
              navigation={this.props.navigation}
              delete={this._delete}
              userName={this.props.dataUser.name}
            />
          )}
          onEndReachedThreshold={0.1}
          onEndReached={() => { this._loadMore()}}
          ListFooterComponent={this._renderFooter}
        />
      </View>
    );
  }

  _renderFooter = () => {
    if (!this.state.loading) return null
    return (
      <View style={myStyle.loading}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  _refreshing(){
    //let p = this.state.page;
    //for(i=1; i<=p;i++){
      this.setState({ page: 1, data: [], refreshing: true }, () => { this._loadData() });
    //}
  }

  _loadMore(){
    if (!this.state.over)
    if (!this.state.loading)
      this.setState({ page: this.state.page + 1, loading: true }, () => { this._loadData() });
  }

  async _loadData() {
    let response = await fetch(
      `${API.getURL()}/thuctap/wp-json/wp/v2/tags?page=${this.state.page}`
    );
    if (response.status === 200) {
      let responseJson = await response.json();
      if (responseJson.length === 0) {
        if (this.state.page == 1)ToastAndroid.show("Không có nội dung", ToastAndroid.LONG);
        else ToastAndroid.show("Cuối trang", ToastAndroid.SHORT);
        this.setState({ refreshing: false, loading: false, over: true });
      } else {
        this.setState({
          data: this.state.data.concat(responseJson),
          refreshing: false,
          loading: false,
          over: false,
        });
      }
    } else if (response.status === 400) {
      ToastAndroid.show("Lỗi", ToastAndroid.SHORT);
    }
  }

  _onAdd() {
    this.props.navigation.navigate("AddTag");
  }

  _delete = (i, t) => {
    Alert.alert(
      "Thông báo",
      "Bạn có thật sự muốn xóa ''" + t + "'' không?",
      [
        {
          text: "Xóa",
          onPress: () => {
            API.Tag.Remove(i).then(response => {
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
const myStyle = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  icon: { marginLeft: 5, marginRight: 10, color: "#868686" },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end"
  },
  headerTitleBar: {
    backgroundColor: "#fff",
    borderBottomColor: "#fafafa",
    borderBottomWidth: 1,
    flexDirection: "row",
    shadowColor: "#efefef",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.1,
    elevation: 3,
    zIndex: 0
  },
  headerTitle: {
    paddingLeft: 20,
    alignItems: "center",
    height: 50,
    //justifyContent: "center",
    flexDirection: "row",
    flex: 4
  },
  title: { fontSize: 20, color: "#000", fontWeight: "500" },
  item: { marginTop: 5 },
  loading: { paddingVertical: 10 }
});

function mapStateToProps(state) {
  return { dataUser: state.dataUser };
}
export default connect(mapStateToProps)(Tags);
