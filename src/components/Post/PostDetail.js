import React, { Component } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  PixelRatio,
  Dimensions
} from "react-native";
import API from "../../config/API";
import IonIcon from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import ItemComment from "./items/ItemComment";
import ItemContentPost from "./items/ItemContentPost";
import ModalComment from "./items/ModalComment"

class PostDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noidung: [],
      tacgia: [],
      binhluan: [],
      loaded: false,
      refreshing: true,
      repcmt: false,
      rep: ''
    };
    this._onOpenModal = this._onOpenModal.bind(this)
    //const { navigation } = this.props;
  }
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    let headerRight = (
      <TouchableOpacity
        onPress={() => {
          params.onEdit();
        }}
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <FontAwesome
          style={{ marginLeft: 5, marginRight: 5, color: "#36BC63" }}
          name="edit"
          size={32}
        />
      </TouchableOpacity>
    );
    return { headerRight };
  };

  componentDidMount() {
    this._loadData();
    this._loadComments();
    this.props.navigation.setParams({
      onEdit: this._onEdit.bind(this)
    });
  }
  // _renderComment() {
  //   if (this.state.repcmt == true)
  //     return (
  //       <View style={myStyle.canLe}>
  //         <TouchableOpacity onPress={() => this.setState({ repcmt: false })}>
  //           <IonIcon style={{ color: "#088A4B", padding: 14, backgroundColor: "rgba(240,240,240,0.9)", }} name="md-arrow-round-back" size={28} />
  //         </TouchableOpacity>
  //         <Text style={{ backgroundColor: "#rgba(255,255,255,0.5)" }}>Bình luận</Text>
  //         <IonIcon style={{ color: "#088A4B", padding: 14, backgroundColor: "rgba(240,240,240,0.9)", }} name="md-send" size={28} />
  //       </View >
  //     )
  //   else
  //     return (
  //       <TouchableOpacity style={myStyle.canLe} >
  //         <IonIcon style={{ color: "#fff"}} name="ios-chatbubbles-outline" size={24} />
  //       </TouchableOpacity>
  //     )
  // }
  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.loaded == false && (
          <View style={myStyle.loadingContainer}>
            <ActivityIndicator size="large" color="#088A4B" />
            <Text style={{ color: "#088A4B" }}>Đang tải</Text>
          </View>
        )}
        {this.state.loaded && (
          <View style={{ flex: 1 }}>
            <ScrollView style={myStyle.container}>
              <ItemContentPost noidung={this.state.noidung} tacgia={this.state.tacgia} loaded={this.state.loaded} />
              {/* Bình luận bài viết */}
              <View style={{ padding: 5 }}>
                <Text style={{ margin: 5, paddingLeft: 5, marginBottom: 10, fontSize: 20, color: "#36BC63", borderBottomWidth: 3, borderBottomColor: "#36BC63" }}>
                  Bình luận
              </Text>
                <FlatList
                  refreshing={this.state.refreshing}
                  //refreshing={this.props.refreshing}
                  onRefresh={() => this._loadComments()}
                  data={this.state.binhluan}
                  keyExtractor={(x, i) => i.toString()}
                  renderItem={({ item }) => <ItemComment data={item} onClickCmt={this._onClickCmt} loaded={this.state.loaded} />}
                />
              </View>
            </ScrollView>
            <ModalComment ref={'addModal'} style={{zIndex: 1}} noidung={this.state.noidung}/>
          </View>
        )}
        {this.state.loaded && (
          <TouchableOpacity style={myStyle.canLe} onPress={() => this._onOpenModal()}>
            <IonIcon style={{ color: "#fff" }} name="ios-chatbubbles-outline" size={28} />
          </TouchableOpacity>
        )}
      </View>
    );
  }
  _onOpenModal() {
    this.refs.addModal.showModal()
  }
  _onClickCmt = (a) => {
    this.setState({ repcmt: true, rep: a })
  }

  _onEdit() {
    this.props.navigation.navigate("chinhsua", {
      id: this.props.navigation.getParam("id", "")
    });
  }
  _loadData() {
    fetch(
      API.getURL() +
      "/thuctap/wp-json/wp/v2/posts/" +
      this.props.navigation.getParam("id", "")
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson == null) {
          Alert.alert("Lỗi", "Không có nội dung");
        } else {
          this.setState({ noidung: responseJson });
          this._loadTacGia();
        }
      });
  }
  _loadTacGia() {
    fetch(
      API.getURL() + "/thuctap/wp-json/wp/v2/users/" + this.state.noidung.author
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson == null) {
          Alert.alert("Lỗi", "Không có nội dung");
        } else {
          this.setState({ tacgia: responseJson, loaded: true });
        }
      });
  }

  _loadComments() {
    fetch(
      API.getURL() +
      "/thuctap/wp-json/wp/v2/comments?post=" +
      this.props.navigation.getParam("id", "") + "&parent=0"
    )
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson == null) {
          Alert.alert("Lỗi", "Không có nội dung");
        } else {
          this.setState({ binhluan: responseJson, refreshing: false });
        }
      });
  }

}
const height_cmt = 49;
const pw = Dimensions.get('window').width;
//const ph = PixelRatio.getPixelSizeForLayoutSize(Dimensions.get("window").height);
const myStyle = StyleSheet.create({
  container: {
    flex: 1,
    //marginTop: (Platform.OS === 'ios') ? 60 : 50,
    borderWidth: 1,
    borderColor: "#dfdfdf",
    backgroundColor: "#fff"
  },
  header: {
    padding: 5
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center"
  },
  ctmInput: {
    backgroundColor: "rgba(255,255,255,0.9)",
    fontSize: 18,
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
  },
  canLe: {
    flexDirection: "row",
    position: "absolute",
    width: 45,
    height: 45,
    bottom: 0,
    right: 0,
    backgroundColor: "#36BC63",
    zIndex: 0,
    margin: 10,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 20, height: 20 },
    shadowOpacity: 1.0,
    shadowRadius: 10,
    elevation: 5
  }
});
export default PostDetail;
