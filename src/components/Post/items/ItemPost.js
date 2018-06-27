import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  ToastAndroid,
  Text,
  Alert
} from "react-native";
import HTML from "react-native-render-html";
import Base64 from "../../../config/Base64";
import IonIcon from "react-native-vector-icons/Ionicons";
const featured_media_default =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR95Iv69vIsfDjhtuBDIAfvKO1e5pyRMwDYXDYeWDpjnLRt5JUe";
class ItemPost extends Component {
  constructor(props) {
    super(props);
    this.state = { featured_media: "", loaded: false };
  }

  componentDidMount() {
    this._getFeaturedMedia();
  }

  componentWillReceiveProps(nextProps) {
    // this.setState({ loaded: false }, () => {
    //   this._getFeaturedMedia();
    // });
    if (nextProps.data != this.props.data)
    {
      this.setState({ loaded: false }, () => {
        this._getFeaturedMedia();
      });
    }
     
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={myStyle.baibao}>
          <TouchableOpacity
            onPress={() =>
              this.xem(this.props.data.id, this.props.data.title.rendered)
            }
          >
            <View style={{ flexDirection: "row" }}>
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                {this.state.loaded && (
                  <View style={myStyle.hinh}>
                    <Image
                      style={myStyle.hinh}
                      source={{ uri: this.state.featured_media }}
                    />
                  </View>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <View style={myStyle.TieuDe}>
                  <HTML
                    html={"<span>" + this.props.data.title.rendered + "</span>"}
                    tagsStyles={htmlStyle}
                  />
                </View>
                {this.props.userName === "admin" && (
                  <View style={myStyle.edit}>
                    <TouchableOpacity
                      onPress={() =>
                        this.props.delete(
                          this.props.data.id,
                          this.props.data.title.rendered
                        )
                      }
                      style={{
                        paddingLeft: 5,
                        flex: 1,
                        alignItems: "center",
                        flexDirection: "row"
                      }}
                    >
                      <IonIcon name="ios-trash-outline" size={16} />
                      <Text style={myStyle.textEdit}> Xóa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => this.chinhsua(this.props.data.id)}
                      style={{
                        flex: 1,
                        alignItems: "center",
                        flexDirection: "row"
                      }}
                    >
                      <IonIcon name="ios-create-outline" size={16} />
                      <Text style={myStyle.textEdit}> Chỉnh sửa</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  xem(i, t) {
    //this.getSrcImage(t);
    this.props.navigation.navigate("chitiet", { id: i });
  }
  xoa(i, t) {
    this.props.delete(i, t);
  }
  chinhsua(i) {
    this.props.navigation.navigate("chinhsua", { id: i });
  }
  async _getFeaturedMedia() {
    if (this.props.data.featured_media != 0) {
      let idImage = this.props.data.featured_media;
      let response = await fetch(
        `${API.getURL()}/thuctap/wp-json/wp/v2/media/${idImage}`
      );
      if (response.status === 200) {
        let json = await response.json();
        let src = json.media_details.sizes.medium.source_url;
        this.setState({
          featured_media: src.replace("http://localhost", API.getURL()),
          loaded: true
        });
      } else {
        this.setState({
          featured_media: featured_media_default,
          loaded: true
        });
      }
    } else {
      let content = this.props.data.content.rendered;
      //tìm thẻ img đầu tiên
      let indexImg = content.toString().indexOf("<img");
      //không tìm thấy trả về đường dẫn mặc định
      var src = featured_media_default;
      if (indexImg != -1) {
        // tìm vị trí mở src
        let indexSrcStart = content.toString().indexOf("src", indexImg) + 5;
        //tìm vị trí đóng src
        let indexSrcEnd = content.toString().indexOf('"', indexSrcStart);
        //lấy đường dẫn
        src = content
          .substring(indexSrcStart, indexSrcEnd)
          .replace("http://localhost", API.getURL());
        let response = await fetch(src);
        if (response.status != 200) src = featured_media_default;
      }
      this.setState({ featured_media: src, loaded: true });
    }
  }

  // Xóa link trong nội dung
  removeLink(content) {
    //tìm thẻ img đầu tiên
    let indexLink = content.toString().indexOf("&hellip");
    //không tìm thấy trả lại nội dung
    if (indexLink == -1) return content;
    // cắt bỏ đường link
    return content.substring(0, indexLink + 8);
  }
  formatExcerpt(content) {
    //Mỗi trích đoạn chỉ lấy tối đa 100 ký tự
    //content = this.removeLink(content);
    return content.length > 100
      ? content.substring(0, 100) + "...</p>"
      : content;
  }
}

const htmlStyle = {
  span: {
    color: "#088A4B",
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 5,
    marginBottom: 0,
    fontSize: 15
  },
  p: {
    paddingRight: 20
  }
};
const myStyle = StyleSheet.create({
  TieuDe: {
    paddingLeft: 5,
    paddingRight: 5,
    height: 70,
    fontSize: 20
  },
  excerpt: {
    //color: '#088A4B',
    paddingLeft: 10
  },
  edit: {
    height: 34,
    borderTopWidth: 1,
    borderColor: "#fefefe",
    padding: 7,
    backgroundColor: "#fefefe",
    flexDirection: "row"
  },
  textEdit: {
    fontSize: 11,
    fontWeight: "100",
    flex: 1,
    //color: "#36BC63",
    color: "#6f6f6f",
    justifyContent: "center",
    alignItems: "center"
  },
  baibao: {
    //borderWidth: 1,
    borderWidth: 1,
    borderColor: "#fefefe",
    marginTop: 5,
    marginRight: 5,
    marginLeft: 5,
    backgroundColor: "#fff"
  },
  hinh: {
    width: 150,
    height: 104
  }
});

export default ItemPost;
