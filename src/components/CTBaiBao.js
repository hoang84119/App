import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Header,
  ScrollView,
  Image,
  Button
} from "react-native";
import API from "../API";
import HTMLView from "react-native-htmlview";
import { title } from "react-navigation";
import { NavigationActions } from "react-navigation";

class CTBaiBao extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noidung: [],
      tacgia: [],
      loaded: false
    };
    //const { navigation } = this.props;
  }
  static navigationOptions = ({ navigation }) => {
    //title: `${navigation.state.params.title}`,
    // headerTitleStyle: {
    //   fontSize: 18,
    //   backgroundColor: "white"
    //   //textAlign: 'center',alignSelf:'center'
    // }
    //let headerTitle = navigation.state.params.title;
    let headerRight = <Button title="Chỉnh sửa" onPress={() => {
      this.props.navigation.navigate("chinhsua", { id: this.props.navigation.getParam("id", "") });
    }} />;
    return { headerRight };
  };
  async loadData() {
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
          this.setState({ noidung: responseJson});
          this.loadTacGia();
        }
      });
    // API.getCTBaiBao(this.props.navigation.getParam("id", "")).then(response => {
    //   if (response == null) {
    //     Alert.alert("Lỗi", "Không có nội dung");
    //   } else {
    //     this.setState({ noidung: response, loaded: true });
    //     this.loadTacGia();
    //   }
    // });
  }
  async loadTacGia() {
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

  componentDidMount() {
    this.loadData();
  }

  render() {
    return (
      <View style={{ flex: 1, padding: 5 }}>
        {this.state.loaded === false && (
          <View style={myStyle.loadingContainer}>
            <Image
              style={{ width: 32, height: 32 }}
              source={require("../image/loading.gif")}
            />
            <Text>Đang tải</Text>
          </View>
        )}

        <ScrollView style={myStyle.container}>
          <View style={myStyle.content}>
            {this.state.loaded && (
              <HTMLView
                value={"<span>" + this.state.noidung.title.rendered + "</span>"}
                stylesheet={htmlTitleStyle}
              />
            )}
            {this.state.loaded && (
              <HTMLView
                value={
                  "<i>Cập nhật lúc: <b>" +
                  this.state.noidung.modified.replace("T", "   ") +
                  "</b></i>"
                }
                stylesheet={htmlTitleStyle}
              />
            )}
            {this.state.loaded && (
              <HTMLView
                value={
                  "<i>Người đăng: <b>" + this.state.tacgia.name + "</i></b>"
                }
              />
            )}
          </View>
          <View style={myStyle.content}>
            {this.state.loaded && (
              <HTMLView
                value={this.state.noidung.content.rendered.replace(
                  "http://localhost",
                  API.getURL()
                )}
                stylesheet={htmlTitleStyle}
              />
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}
const htmlTitleStyle = StyleSheet.create({
  span: {
    borderRadius: 8,
    color: "#088A4B",
    fontSize: 18
  },
  p: {
    fontSize: 16
  },
  img: {
    width: 800,
    height: 400
  }
});
const myStyle = StyleSheet.create({
  container: {
    flex: 1,
    //marginTop: (Platform.OS === 'ios') ? 60 : 50,
    borderWidth: 1,
    borderColor: "#dfdfdf",
    borderRadius: 8,
    backgroundColor: "#fff"
  },
  content: {
    padding: 10,
    borderColor: 8,
    flex: 1
  },
  header: {
    padding: 5
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 10
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
export default CTBaiBao;
