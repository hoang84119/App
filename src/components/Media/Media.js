import React, { Component } from "react";
import {
  Alert,FlatList,TouchableOpacity,View,StyleSheet,
  ToastAndroid,ActivityIndicator
} from "react-native";
import API from "../../Config/API";
import ItemImage from "./items/ItemImage";
import IonIcon from "react-native-vector-icons/Ionicons";
import Base64 from '../../Config/Base64'

export default class Media extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noidung: [],
      refreshing: true,
      loading: false,
      selected: new Set(),
      page: 1,
      over:false,
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
      <View style={{ flexDirection: "column" }}>
        <FlatList
          numColumns={3}
          refreshing={this.state.refreshing}
          onRefresh={() => this._refresh()}
          data={this.state.noidung}
          keyExtractor={(x, i) => x.id}
          extraData={this.state.selected}
          renderItem={this._renderItem}
          onEndReachedThreshold={0.1}
          onEndReached={()=>{this._loadMore()}}
          ListFooterComponent={this._renderFooter}
        />
        {this.state.selected.size != 0 && (
          <TouchableOpacity onPress={this._before_Delete} style={myStyle.button}>
            <IonIcon style={{ color: "white" }} name="md-trash" size={27} />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  _refresh() {
    this.setState({page:1,noidung:[],refreshing: true},()=>{this.loadData()});
    //console.log(this.state);
    //this.loadData();
  }

  _loadMore(){
    if(!this.state.over)
    if(!this.state.loading)
     this.setState({page:this.state.page+1,loading:true},()=>{this.loadData()});
    //this.loadData();
  }

  async loadData() {
    //this.setState({ refreshing: true});
    console.log(this.state);
    let response = await fetch(`${API.getURL()}/thuctap/wp-json/wp/v2/media/?page=${this.state.page}`);
    if(response.status===200){
      let responseJson = await response.json();
      this.setState({ noidung:[...this.state.noidung, ...responseJson] , refreshing: false, loading:false, over:false });
    }
    else if(response.status===400){
      ToastAndroid.show("Hết nội dung", ToastAndroid.LONG);
      this.setState({refreshing: false,loading:false, over:true});
    }
    else{
      Alert.alert("Lỗi", "Không có nội dung");
      this.setState({refreshing: false,loading:false});
    }
  }

  _renderFooter = ()=>{
    if(!this.state.loading) return null
    return(
      <View style={{paddingVertical: 10, borderTopWidth:1,borderBottomColor: "white"}}>
        <ActivityIndicator animating size="large"/>
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

  _delete= () =>{
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

  _before_Delete = ()=> {
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
  button: {
    flexDirection: "row",
    position: "absolute",
    width: 50,
    height: 50,
    bottom: 0,
    right: 0,
    backgroundColor: "#088A4B",
    zIndex: 0,
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
