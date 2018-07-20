import React, { Component } from "react";
import {
  StatusBar,
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
import ItemCategory from "./items/ItemCategory";
import { connect } from "react-redux";

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: "",
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
    let ButtonRight = this.props.dataUser.name === "admin" && (
      <View style={myStyle.buttons}>
        <TouchableOpacity onPress={() => this._onAdd()}>
          <Feather style={myStyle.icon} name="plus" size={34} />
        </TouchableOpacity>
      </View>
    );
    return (
      <View style={myStyle.container}>
        <StatusBar translucent backgroundColor="rgba(0, 0, 0, 0)" animated />
        <View style={{ backgroundColor: "#0ABFBC" }}>
          <View style={{ height: StatusBar.currentHeight }} />
          {/* Thanh bar */}
          <View style={myStyle.headerTitleBar}>
            <View style={myStyle.headerTitle}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.openDrawer();
                }}
              >
                <Feather
                  style={[myStyle.icon, { marginLeft: 5, marginRight: 10 }]}
                  name="menu"
                  size={25}
                />
              </TouchableOpacity>
              <Text style={myStyle.title}>Chuyên mục</Text>
            </View>
            {ButtonRight}
          </View>
        </View>

        {/* Noi dung */}
        <FlatList
          style={myStyle.item}
          refreshing={this.state.refreshing}
          onRefresh={() => this._refreshing()}
          data={this.state.data}
          ListEmptyComponent={this._renderEmpty}
          keyExtractor={(item, index) => item.id.toString()}
          renderItem={({ item }) => (
            <ItemCategory
              data={item}
              navigation={this.props.navigation}
              delete={this._delete}
              userName={this.props.dataUser.name}
              level={0}
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

  _refreshing() {
    //let p = this.state.page;
    //for(i=1; i<=p;i++){
    this.setState({ refreshing: true }, () => {
      this._loadData();
    });
    //}
  }

  _loadMore() {
    if (!this.state.over)
      if (!this.state.loading)
        this.setState({ page: this.state.page + 1, loading: true }, () => {
          this._loadData();
        });
  }

  async _loadData() {
    if (this.state.refreshing) {
      let dataTemp = [];
      for (let i = 1; i <= this.state.page; i++) {
        let response = await API.Category.GetAllCategory(i);
        if (response != null) {
          if (response.length != 0) {
            dataTemp = dataTemp.concat(response);
          }
        } else{
          ToastAndroid.show("Lỗi", ToastAndroid.SHORT);
        }
      }
      this.setState({
        data: dataTemp,
        refreshing: false,
        loading: false,
        over: false
      });
    } else {
      let response = await API.Category.GetAllCategory(this.state.page);
      if (response != null) {
        if (response.length === 0) {
          this.setState({
            refreshing: false,
            loading: false,
            over: true,
            page: this.state.page - 1
          });
        } else {
          this.setState({
            data: this.state.data.concat(response),
            refreshing: false,
            loading: false,
            over: false
          });
        }
      } else{
        ToastAndroid.show("Lỗi", ToastAndroid.SHORT);
      }
    }
  }

  _onAdd() {
    this.props.navigation.navigate("AddCategory");
  }

  _delete = (i, t) => {
    Alert.alert(
      "Thông báo",
      "Bạn có thật sự muốn xóa ''" + t + "'' không?",
      [
        {
          text: "Xóa",
          onPress: () => {
            API.Category.Remove(i).then(response => {
              if (response === true) {
                ToastAndroid.show("Xóa thành công !", ToastAndroid.LONG);
                this._refreshing();
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
  icon: {
    marginLeft: 5,
    marginRight: 10,
    color: "#fff"
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end"
  },
  headerTitleBar: {
    flexDirection: "row",
    shadowColor: "#efefef",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.1,
    elevation: 3,
    zIndex: 0
  },
  headerTitle: {
    paddingLeft: 10,
    alignItems: "center",
    height: 50,
    //justifyContent: "center",
    flexDirection: "row",
    flex: 4
  },
  title: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold"
  },
  textOver: {
    fontSize: 16
  },
  loading: {
    paddingVertical: 10,
    alignItems: "center"
  },
  textOver: {
    fontSize: 16
  },
  empty: {
    flexDirection: "column",
    marginTop:20,
    alignItems: "center",
    justifyContent: "center"
  },
});

function mapStateToProps(state) {
  return { dataUser: state.dataUser };
}
export default connect(mapStateToProps)(Categories);
