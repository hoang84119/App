import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import API from "../../API";
import IonIcon from "react-native-vector-icons/Ionicons";
import ItemComment from "./items/ItemComment";
import ItemContentPost from "./items/ItemContentPost";

class PostDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noidung: [],
      tacgia: [],
      binhluan: [],
      loaded: false,
      refreshing: true
    };
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
        <IonIcon
          style={{ marginLeft: 5, marginRight: 10, color: "#088A4B" }}
          name="ios-create-outline"
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
          <ScrollView style={myStyle.container}>
            <ItemContentPost noidung={this.state.noidung} tacgia={this.state.tacgia} loaded={this.state.loaded}/>
            {/* Bình luận bài viết */}
            <View style={{ padding: 5 }}>
              <Text style={{ padding: 5, fontSize: 20, color: "#088A4B" }}>
                Bình luận
              </Text>
              <FlatList
                refreshing={this.state.refreshing}
                //refreshing={this.props.refreshing}
                onRefresh={() => this._loadComments()}
                data={this.state.binhluan}
                keyExtractor={(x, i) => i.toString()}
                renderItem={({ item }) => <ItemComment data={item} />}
              />
            </View>
          </ScrollView>
        )}
      </View>
    );
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
        this.props.navigation.getParam("id", "")
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

// const pw = PixelRatio.getPixelSizeForLayoutSize(Dimensions.get("window").width);
// const ph = PixelRatio.getPixelSizeForLayoutSize(
//   Dimensions.get("window").height
// );
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
  }
});
export default PostDetail;
