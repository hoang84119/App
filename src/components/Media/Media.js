import React, { Component } from "react";
import {
  StatusBar,
  Alert, FlatList, TouchableOpacity, View, StyleSheet,
  ToastAndroid, ActivityIndicator, Text
} from "react-native";
import API from "../../config/API";
import ItemImage from "./items/ItemImage";
import IonIcon from "react-native-vector-icons/Ionicons";
import Base64 from '../../config/Base64'
var ImagePicker = require("react-native-image-picker");

var options = {
  title: "Chọn hình ảnh",
  takePhotoButtonTitle: "Máy ảnh",
  chooseFromLibraryButtonTitle: "Chọn hình ảnh sẵn có",
  cancelButtonTitle: "Hủy"
};

export default class Media extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noidung: [],
      refreshing: true,
      loading: false,
      selected: new Set(),
      page: 1,
      over: false,
    };
  }

  componentDidMount() {
    this.props.navigation.addListener("didFocus", () => {
      this._refresh();
    });
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>



        {/* {this.props.navigation.getParam("check", 0) != 1 && */}
          <View style={{ backgroundColor: "#0ABFBC" }}>
            <StatusBar
              translucent
              backgroundColor="rgba(0, 0, 0, 0)"
              animated
            />
            <View style={{ height: StatusBar.currentHeight }}></View>
            <View style={{backgroundColor: "#0ABFBC"}} >
              <View style={{
                  alignItems: "center",
                  height: 50,
                  justifyContent: "center",
                  flexDirection: "row"
                }}>
                <Text style={{ fontSize: 20, color: "#fff", fontWeight: "bold" }}>Thư viện của bạn</Text>
              </View>
              {/* Buttom bên phải */}
              <View style={{
                  alignItems: "center",
                  height: 50,
                  justifyContent: "flex-end",
                  flexDirection: "row",
                  marginTop: -50
                }}
              >
                {/* {ButtonRight} */}
              </View>
            </View>
          </View>
        {/* } */}

        <View style={{ paddingHorizontal: 2, flexDirection: "column", flex: 1 }}>
          <FlatList
            numColumns={3}
            refreshing={this.state.refreshing}
            onRefresh={() => this._refresh()}
            data={this.state.noidung}
            keyExtractor={(x, i) => x.id}
            extraData={this.state.selected}
            renderItem={this._renderItem}
            onEndReachedThreshold={0.1}
            onEndReached={() => { this._loadMore() }}
            ListFooterComponent={this._renderFooter}
          />
        </View>
        {this.state.selected.size != 0 && (
          <TouchableOpacity onPress={this._before_Delete} style={myStyle.deleteSelect}>
            <IonIcon style={{ color: "white", marginLeft: 6 }} name="md-trash" size={32} />
            <Text style={{
              // borderWidth: 1,
              // borderColor: "#FF3030",
              marginLeft: -12,
              marginBottom: -20,
              width: 17,
              height: 17,
              textAlign: 'center',
              backgroundColor: "#000",
              color: "#fff",
              borderRadius: 10,
              padding: 1,
              fontSize: 11
            }}>{this.state.selected.size}</Text>
          </TouchableOpacity>
        )}
        {this.state.selected.size == 0 && (
          <TouchableOpacity onPress={this._upload_Selected} style={myStyle.uploadSelect}>
            <IonIcon style={{ color: "white" }} name="ios-cloud-upload-outline" size={32} />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  _refresh() {
    this.setState({ page: 1, noidung: [], refreshing: true }, () => { this.loadData() });
    //console.log(this.state);
    //this.loadData();
  }

  _loadMore() {
    if (!this.state.over)
      if (!this.state.loading)
        this.setState({ page: this.state.page + 1, loading: true }, () => { this.loadData() });
    //this.loadData();
  }

  async loadData() {
    //this.setState({ refreshing: true});
    let response = await fetch(`${API.getURL()}/thuctap/wp-json/wp/v2/media/?page=${this.state.page}`);
    if (response.status === 200) {
      let responseJson = await response.json();
      this.setState({ noidung: [...this.state.noidung, ...responseJson], refreshing: false, loading: false, over: false });
    }
    else if (response.status === 400) {
      ToastAndroid.show("Cuối trang", ToastAndroid.SHORT);
      this.setState({ refreshing: false, loading: false, over: true });
    }
    else {
      Alert.alert("Lỗi", "Không có nội dung");
      this.setState({ refreshing: false, loading: false });
    }
  }

  _renderFooter = () => {
    if (!this.state.loading) return null
    return (
      <View style={{ paddingVertical: 10 }}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  //xử lý khi nhấn lâu vào một item
  _onLongPressItem = id => {
    this.setState(state => {
      const selected = new Set(state.selected);
      this.state.selected.has(id) ? selected.delete(id) : selected.add(id);
      //selected.set(id, !selected.get(id));
      return { selected };
    });
  };

  _renderItem = ({ item }) => (
    <ItemImage
      id={item.id}
      guid={item.media_details.sizes.medium.source_url.replace("http://localhost", API.getURL())}
      title={item.title.rendered}
      onLongPressItem={this._onLongPressItem}
      selected={this.state.selected.has(item.id)}
      hasSelected={this.state.selected.size === 0 ? false : true}
      navigation={this.props.navigation}
    />
  );

  _delete = () => {
    this.state.selected.forEach(value => {
      fetch(`${API.getURL()}/thuctap/wp-json/wp/v2/media/${value}?force=true`, {
        headers: {
          Authorization:
            "Basic " + Base64.btoa("admin:yEgN NbO6 w6k3 vSuU xBjV E8Ok")//MK: SO1H sjHe BmAm jzX1 wQZc 5LlD
        },
        method: "DELETE"
      }).then(response => {
        var t = response.status;
        if (response.status == 200) {
          this.state.selected.clear();
          ToastAndroid.show("Xóa thành công !", ToastAndroid.LONG);
          this._refresh();
        } else Alert.alert("Cảnh báo", "Xóa thất bại!");
      })
    });
  }

  _upload_Selected = () => {
    ImagePicker.showImagePicker(options, response => {
      //console.log('Response = ', response);
      if (response.didCancel) {
        ToastAndroid.show("Đã hủy", ToastAndroid.SHORT);
      } else if (response.error) {
        ToastAndroid.show(
          "Lỗi Image Picker: " + response.error,
          ToastAndroid.SHORT
        );
      }
      else {
        var file = {
          uri: response.uri,
          name: response.fileName,
          fileName: response.path,
          type: response.type
        };
        API.UploadImage(file).then(pathImage => {
          if (pathImage != "") {
            ToastAndroid.show("Đang xử lý...", ToastAndroid.LONG)
            this._refresh();
            ToastAndroid.show("Upload thành công!", ToastAndroid.SHORT)
            // pathImage = pathImage.replace(
            //   "http://localhost",
            //   API.getURL()
            // );
          }
        });
      }
    });

  }
  _before_Delete = () => {
    Alert.alert(
      "Thông báo",
      "Bạn sẽ xóa vĩnh viễn những hình này trong trang web của bạn",
      [
        {
          text: "Xóa",
          onPress: this._delete
        },
        { text: "Hủy", style: "cancel" }
      ],
      { cancelable: false }
    );
    return true
  }
}

const myStyle = StyleSheet.create({
  deleteSelect: {
    flexDirection: "row",
    position: "absolute",
    width: 50,
    height: 50,
    bottom: 0,
    right: 0,
    backgroundColor: "#FF3333",
    zIndex: 1,
    margin: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 20, height: 20 },
    shadowOpacity: 1.0,
    shadowRadius: 10,
    elevation: 5
  },
  uploadSelect: {
    flexDirection: "row",
    position: "absolute",
    width: 50,
    height: 50,
    bottom: 0,
    right: 0,
    backgroundColor: "#0ABFBC",
    zIndex: 1,
    margin: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 20, height: 20 },
    shadowOpacity: 1.0,
    shadowRadius: 10,
    elevation: 5
  }
});
