import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  ToastAndroid,
  Text,
  Alert,
  ImageBackground
} from "react-native";
import HTML from "react-native-render-html";
import Base64 from "../../../config/Base64";
import Feather from "react-native-vector-icons/Feather";
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
    if (nextProps.data != this.props.data) {
      this.setState({ loaded: false }, () => {
        this._getFeaturedMedia();
      });
    }
  }
  render() {
    return (
      <View style={myStyle.cardItem}>
        <TouchableOpacity onPress={this._xem} style={myStyle.btnNoiDung}>
          {this.state.loaded && (
            <ImageBackground
              source={{ uri: this.state.featured_media }}
              style={myStyle.hinh}
            >
              <View style={myStyle.title}>
                <HTML
                  html={"<span>" + this.props.data.title.rendered + "</span>"}
                  tagsStyles={htmlStyle}
                />
              </View>
            </ImageBackground>
          )}
          {this.props.data.excerpt.rendered != "" && (
            <HTML
              html={this.formatExcerpt(this.props.data.excerpt.rendered)}
              //tagsStyles={htmlStyle}
              renderers={renderers}
            />
          )}
        </TouchableOpacity>
        <View style={myStyle.footer}>
          <View style={myStyle.date}>
            <Feather style={myStyle.iconClock} name="clock" size={16} />
            <Text style={myStyle.dateContent}>{this._getDate()}</Text>
          </View>

          {this.props.userName === "admin" && (
            <View style={myStyle.buttons}>
              <TouchableOpacity onPress={this._chinhsua}>
                <Feather style={myStyle.icon} name="edit" size={15} />
              </TouchableOpacity>
              <TouchableOpacity onPress={this._xoa}>
                <Feather style={myStyle.icon} name="trash" size={15} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }

  _xem = () => {
    this.props.navigation.navigate("chitiet", { id: this.props.data.id, userName: this.props.userName});
  };
  _xoa = () => {
    this.props.delete(this.props.data.id, this.props.data.title.rendered);
  };
  _chinhsua = () => {
    this.props.navigation.navigate("chinhsua", { id: this.props.data.id });
  };
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

  _getDate = () => {
    let date = new Date(this.props.data.date);
    let localDate = new Date();
    let msPerSecond = 1000;
    let msPerMinute = 60 * 1000;
    let msPerHour = 60 * 60 * 1000;
    let msPerDay = 24 * 60 * 60 * 1000;
    let time = localDate.getTime() - date.getTime();

    let seconds = parseInt(time / msPerSecond);
    if (seconds < 60) return `${seconds}s trước`;

    let minutes = parseInt(time / msPerMinute);
    if (minutes < 60) return `${minutes} phút trước`;

    let hours = parseInt(time / msPerHour);
    if (hours < 24) return `${hours} giờ trước`;

    let days = parseInt(time / msPerDay);
    if (days < 30) return `${days} ngày trước`;
  };

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
    return content.length > 120
      ? content.substring(0, 120) + "...</p>"
      : content;
  }
}

const renderers = {
  p: (htmlAttribs, children) => <Text style={myStyle.noidung}>{children}</Text>
};

const htmlStyle = {
  span: {
    fontWeight: "300",
    fontSize: 18,
    color: "#FFF"
  },
  p: {
    fontSize: 14,
    color: "#9F9F9F"
  }
};
const myStyle = StyleSheet.create({
  cardItem: {
    //borderWidth: 1,
    flexDirection: "column",
    //borderColor: "#f4f4f4",
    marginHorizontal: 5,
    marginVertical: 5,
    //padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
    overflow: "hidden", //không cho item tràn ra ngoài
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.8,
    elevation: 2
  },
  btnNoiDung: { paddingLeft: 0, flex: 1 },
  hinh: {
    flex: 1,
    height: 150,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center"
  },
  title: {
    flex: 1,
    backgroundColor: "rgba(100,100,100,0.3)",
    paddingHorizontal:10,
    paddingVertical: 5
  },
  noidung: {
    padding: 10,
    fontSize: 14,
    color: "#4F4F4F"
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 0.5,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
    //backgroundColor:"#f3f3f3"
  },
  date: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  dateContent: {
    fontSize: 12,
    textAlign: "center"
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  iconClock:{marginRight:5, color: "#868686" },
  icon: { marginRight:10,marginLeft:3, color: "#868686" }
});

export default ItemPost;
