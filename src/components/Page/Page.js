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
import ItemPage from "./item/ItemPage";
import Base64 from "../../config/Base64";
import { connect } from "react-redux";
import Feather from "react-native-vector-icons/Feather";

class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noidung: [],
      refreshing: true,
      loading: false,
      page: 1,
      over: false,
      empty: false
    };
  }

  // static navigationOptions = {
  //   header: null,
  // };

  componentDidMount() {
    //this._loadData();
    //BackHandler.addEventListener("hardwareBackPress", this.onBackButtonPress);
    if (this.props.dataUser.name === "admin")
      this.props.navigation.addListener("didFocus", () => {
        this._refresh();
      });
    else this._refresh();
  }

  render() {
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
          <Text style={myStyle.title}>Quản lý trang</Text>
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
        {this.state.empty && (
          <View style={myStyle.empty}>
            <Feather name="alert-circle" size={60} />
            <Text style={{ margin: 10, fontSize: 16 }}>Không có nội dung</Text>
          </View>
        )}

        {/* Noi dung */}
        {!this.state.empty && (
          <FlatList
            //style={myStyle.item}
            refreshing={this.state.refreshing}
            onRefresh={() => this._refresh()}
            data={this.state.noidung}
            keyExtractor={(item, index) => item.id.toString()}
            renderItem={({ item }) => (
              <ItemPage
                data={item}
                navigation={this.props.navigation}
                delete={this._delete}
                userName={this.props.dataUser.name}
              />
            )}
            onEndReachedThreshold={0.1}
            onEndReached={() => {
              this._loadMore();
            }}
            ListFooterComponent={this._renderFooter}
          />
        )}
      </View>
    );
  }

  _delete = (i, t) => {
    Alert.alert(
      "Thông báo",
      "Bạn có thật sự muốn xóa ''" + t + "'' không?",
      [
        {
          text: "Xóa",
          onPress: () => {
            fetch(API.getURL() + "/wp-json/wp/v2/pages/" + i, {
              headers: {
                Authorization:
                  "Basic " + Base64.btoa("admin:yEgN NbO6 w6k3 vSuU xBjV E8Ok") //MK: SO1H sjHe BmAm jzX1 wQZc 5LlD
              },
              method: "DELETE"
            }).then(response => {
              if (response.status == 200) {
                ToastAndroid.show("Xóa thành công !", ToastAndroid.LONG);
                this.refresh();
              } else Alert.alert("Cảnh báo", "Xóa thất bại!");
            });
          }
        },
        { text: "Hủy", style: "cancel" }
      ],
      { cancelable: false }
    );
  };

  _renderFooter = () => {
    if (this.state.loading)
      return (
        <View style={myStyle.loading}>
          <ActivityIndicator animating size="large" />
        </View>
      );
    else if (this.state.over)
      return (
        <View style={myStyle.loading}>
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

  // _loadData() {
  //   this.setState({ refreshing: true });
  //   API.Page.GetAllPage(1)
  //     .then(responseJson => {
  //       if (responseJson.length === 0) {
  //         this.setState({ empty: true, refreshing: false });
  //       } else {
  //         this.setState({ noidung: responseJson, refreshing: false });
  //       }
  //     });
  // }
  async _loadData() {
    if (this.state.refreshing) {
      let dataTemp = [];
      for (let i = 1; i <= this.state.page; i++) {
        let response = await API.Page.GetAllPage(i);
        if (response != null) {
          if (response.length === 0) {
            this.setState({ empty: true });
            break;
          } else {
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
      let response = await API.Post.GetAllPost(this.state.page);
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
    this.props.navigation.navigate("AddPage");
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
  empty: {
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  loading: {
    paddingVertical: 10,
    alignItems: "center"
  },
  textOver: {
    fontSize: 16
  }
});

//export default Page;

function mapStateToProps(state) {
  return { dataUser: state.dataUser };
}
export default connect(mapStateToProps)(Page);
