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
import FontAwesome from "react-native-vector-icons/FontAwesome";
import ItemPost from "./items/ItemPost";
import Base64 from "../../config/Base64";
import { connect } from "react-redux";
import Feather from "react-native-vector-icons/Feather";

class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noidung: "",
      refreshing: true,
      featured_media: "",
      empty: false,
    };
  }
  static navigationOptions = ({ navigation }) => {
    //let headerTitle = "Thêm chuyên mục";
    let header;
    let headerTitle;
    if (navigation.getParam("idCategory", "") == "") {
      header = null;
    } else {
      headerTitle = navigation.getParam("nameCategory", "");
    }
    return { header, headerTitle };
  };

  // static navigationOptions = {
  //   header: null,
  // };

  componentDidMount() {
    //this._loadData();
    //BackHandler.addEventListener("hardwareBackPress", this.onBackButtonPress);
    if (this.props.dataUser.name === "admin")
      this.props.navigation.addListener("didFocus", () => {
        this._loadData();
      });
    else this._loadData();
    // this.props.navigation.setParams({
    //   onAdd: this._onAdd.bind(this),
    //   onLogout: this._onLogout.bind(this),
    //   onLogin: this._onLogin.bind(this),
    //   userName: this.props.dataUser.name
    //   //,isAdding: false
    // });
  }

  render() {
    if(this.props.navigation.getParam("idCategory", "") == "")
    var ButtonRight =
      this.props.dataUser.name === "admin" ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "rgba(255,255,255,0)"
          }}
        >
          <TouchableOpacity onPress={() => this._onAdd()}>
            <Feather
              style={{ marginRight: 5, color: "#36BC63" }}
              name="plus"
              size={34}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this._onLogout()}>
            <Feather
              style={{ marginRight: 5, color: "#36BC63" }}
              name="log-out"
              size={24}
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
            <FontAwesome
              style={{ marginLeft: 10, marginRight: 10, color: "black" }}
              name="md-contact"
              size={36}
            />
          </TouchableOpacity>
        </View>
      );

    return (
      <View style={{ flex: 1 }}>
        {/* Thanh bar */}
        {this.props.navigation.getParam("idCategory", "") == "" && (
          <View
            style={{
              backgroundColor: "#fff",
              // borderBottomColor: "#fafafa",
              // borderBottomWidth: 1,
              shadowColor: "#efefef",
              shadowOffset: { width: 10, height: 10 },
              shadowOpacity: 0.1,
              // shadowRadius: 10,
              elevation: 3,
              zIndex: 0
            }}
          >
            <View
              style={{
                alignItems: "center",
                height: 45,
                justifyContent: "center",
                flexDirection: "row"
              }}
            >
              <Text style={{ fontSize: 20, color: "#36BC63", fontWeight: "bold" }}>
                Bài viết
              </Text>
            </View>
            <View
              style={{
                alignItems: "center",
                height: 45,
                justifyContent: "flex-end",
                flexDirection: "row",
                marginTop: -45
              }}
            >
              {ButtonRight}
            </View>
          </View>
        )}

        {
          this.state.empty && (<Text>Không có nội dung</Text>)
        }

        {/* Noi dung */}

        <FlatList
          refreshing={this.state.refreshing}
          //refreshing={this.props.refreshing}
          onRefresh={() => this.refresh()}
          data={this.state.noidung}
          keyExtractor={(item, index) => item.id}
          renderItem={({ item }) => (
            <ItemPost
              data={item}
              navigation={this.props.navigation}
              delete={this._delete}
              userName={this.props.dataUser.name}
            />
          )}
        />
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
            fetch(API.getURL() + "/thuctap/wp-json/wp/v2/posts/" + i, {
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

  refresh() {
    this._loadData();
  }

  _loadData() { 
    this.setState({ refreshing: true });
    //this.props.dispatch({type:'RefreshPost'});
    let url = API.getURL() + "/thuctap/wp-json/wp/v2/posts";
    let id = this.props.navigation.getParam("idCategory","")
    if(id != "") url = `${url}?categories=${id}`
    fetch(url)
      .then(response => response.json())
      .then(responseJson => {
        if ( responseJson.length===0 ) {
          this.setState({empty:true,refreshing: false});
        } else {
          this.setState({ noidung: responseJson, refreshing: false });
        }
      });
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

//export default Posts;

function mapStateToProps(state) {
  return { dataUser: state.dataUser };
}
export default connect(mapStateToProps)(Posts);
