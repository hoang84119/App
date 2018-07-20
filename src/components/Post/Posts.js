import React, { Component } from "react";
import {
  Alert,
  StatusBar,
  FlatList,
  BackHandler,
  View,
  TouchableOpacity,
  ToastAndroid,
  AsyncStorage,
  Text,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import API from "../../config/API";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import ItemPost from "./items/ItemPost";
import Base64 from "../../config/Base64";
import { connect } from "react-redux";
import Feather from "react-native-vector-icons/Feather";

class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noidung: [],
      refreshing: true,
      loading: false,
      page: 1,
      over: false
    };
  }
  static navigationOptions = ({ navigation }) => {
    let idCategory = navigation.getParam("idCategory", "");
    let idTag = navigation.getParam("idTag", "");
    let headerTransparent = true;
    //let headerTitle = "Thêm chuyên mục";
    if (idCategory != "" || idTag != "") {
      let headerTitle;
      let headerLeft = (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack(null);
          }}
        >
          <Feather
            style={[myStyle.icon, { marginLeft: 15 }]}
            name="arrow-left"
            size={25}
          />
        </TouchableOpacity>
      );
      if (idCategory != "") {
        headerTitle = navigation.getParam("nameCategory", "");
        headerTransparent = false;
      } else if (idTag != "") {
        headerTitle = navigation.getParam("nameTag", "");
        headerTransparent = false;
      }
      return { headerTitle, headerTransparent, headerLeft };
    }
    return { headerTransparent };
  };

  componentDidMount() {
    if (this.props.dataUser.name === "admin")
      this.props.navigation.addListener("didFocus", () => {
        this._refresh();
      });
    else this._refresh();
  }

  render() {
    if (
      this.props.navigation.getParam("idCategory", "") == "" &&
      this.props.navigation.getParam("idTag", "") == ""
    )
      var headerBar = (
        <View style={myStyle.headerTitleBar}>
          <View style={myStyle.headerTitle}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.openDrawer();
              }}
            >
              <Feather
                style={[myStyle.icon, { marginLeft: 15 }]}
                name="menu"
                size={25}
              />
            </TouchableOpacity>
            <Text style={myStyle.title}>Bài viết</Text>
          </View>
          {this.props.dataUser.name === "admin" && (
            <TouchableOpacity
              style={myStyle.buttons}
              onPress={() => this._onAdd()}
            >
              <Feather style={myStyle.icon} name="plus" size={34} />
            </TouchableOpacity>
          )}
        </View>
      );
    return (
      <View style={myStyle.container}>
        {/* Thanh bar */}
        {headerBar}

        {/* Noi dung */}
        <FlatList
          //style={{flex:1, justifyContent:"center", alignItems:"center"}}
          refreshing={this.state.refreshing}
          onRefresh={() => this._refresh()}
          data={this.state.noidung}
          ListEmptyComponent={this._renderEmpty}
          keyExtractor={(item, index) => item.id.toString()}
          renderItem={({ item }) => (
            <ItemPost
              data={item}
              navigation={this.props.navigation}
              delete={this._beforeDelete}
              userName={this.props.dataUser.name}
            />
          )}
          onEndReachedThreshold={0.1}
          onEndReached={() => {
            this._loadMore();
          }}
          ListFooterComponent={this._renderFooter}
        />
      </View>
    );
  }

  _renderEmpty = () => {
    if(this.state.refreshing) return null;
    return (
      <View style={myStyle.empty}>
        <Feather name="alert-circle" size={60} />
        <Text style={{ margin: 10, fontSize: 16 }}>Không có nội dung</Text>
      </View>
    );
  };

  _renderFooter = () => {
    if (this.state.loading)
      return (
        <View style={{ paddingVertical: 10 }}>
          <ActivityIndicator animating size="large" />
        </View>
      );
    else if (this.state.over)
      return (
        <View style={{ paddingVertical: 10, alignItems: "center" }}>
          <Text style={myStyle.textOver}>Hết nội dung</Text>
        </View>
      );
    else return null;
  };

  _refresh() {
    this.setState({ refreshing: true }, () => {
      this._loadData();
    });
  }

  _loadMore() {
    if (!this.state.over)
      if (!this.state.loading)
        this.setState({ page: this.state.page + 1, loading: true }, () => {
          this._loadData();
        });
  }

  _beforeDelete = (id, t) => {
    Alert.alert(
      "Thông báo",
      "Bạn có thật sự muốn xóa ''" + t + "'' không?",
      [
        {
          text: "Xóa",
          onPress: this._delete(id)
        },
        { text: "Hủy", style: "cancel" }
      ],
      { cancelable: false }
    );
  };

  _delete = id => {
    API.Post.Delete(id).then(response => {
      if (response) {
        ToastAndroid.show("Xóa thành công !", ToastAndroid.LONG);
        this._refresh();
      } else Alert.alert("Cảnh báo", "Xóa thất bại!");
    });
  };

  // _refresh() {
  //   this._loadData();
  // }

  async _loadData() {
    let idCategory = this.props.navigation.getParam("idCategory", "");
    let idTag = this.props.navigation.getParam("idTag", "");
    if (this.state.refreshing) {
      let dataTemp = [];
      for (let i = 1; i <= this.state.page; i++) {
        let response = await API.Post.GetAllPost(idCategory, idTag, i);
        if (response != null) {
          if (response.length != 0) {
            dataTemp = dataTemp.concat(response);
          }
        }
      }
      this.setState({
        noidung: dataTemp,
        refreshing: false,
        loading: false,
        over: false
      });
    } else {
      let response = await API.Post.GetAllPost(
        idCategory,
        idTag,
        this.state.page
      );
      if (response != null) {
        this.setState({
          noidung: [...this.state.noidung, ...response],
          refreshing: false,
          loading: false,
          over: false
        });
      } else {
        this.setState({
          refreshing: false,
          loading: false,
          over: true,
          page: this.state.page - 1
        });
      }
    }
  }

  _onLogin() {
    this.props.navigation.navigate("login");
  }

  _onLogout() {
    AsyncStorage.removeItem("Base64").then(() => {
      this.props.dispatch({
        type: "DeleteDataUser"
      });
      ToastAndroid.show("Đã đăng xuất", ToastAndroid.LONG);
      //BackHandler.exitApp();
    });
  }
  _onAdd() {
    // if (this.props.navigation.state.params.isAdding == true) return;
    // this.props.navigation.setParams({ isAdding: true });
    this.props.navigation.navigate("thembaiviet");
  }

  onBackButtonPress = () => {
    Alert.alert(
      "Thoát",
      "Bạn muốn thoát không",
      [
        { text: "Đồng ý", onPress: () => BackHandler.exitApp() },
        { text: "Hủy", style: "cancel" }
      ],
      { cancelable: false }
    );
    return true;
  };
}
const myStyle = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  icon: { marginLeft: 5, marginRight: 10, color: "#fff" },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end"
  },
  headerTitleBar: {
    backgroundColor: "#0ABFBC",
    flexDirection: "row",
    zIndex: 0
  },
  headerTitle: {
    //paddingLeft: 20,
    alignItems: "center",
    height: 50,
    flexDirection: "row",
    flex: 4
  },
  title: { fontSize: 20, color: "#fff", fontWeight: "500", marginLeft: 5 },
  loading: { paddingVertical: 10 },
  empty: {
    flexDirection: "column",
    marginTop:20,
    alignItems: "center",
    justifyContent: "center"
  },
  textOver: {
    fontSize: 16
  }
});

//export default Posts;

function mapStateToProps(state) {
  return { dataUser: state.dataUser };
}
export default connect(mapStateToProps)(Posts);
