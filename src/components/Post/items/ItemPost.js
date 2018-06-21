import React, { Component } from "react";
import {View, TouchableOpacity, Image, StyleSheet, ToastAndroid, Text} from "react-native";
import HTML from "react-native-render-html";
import Base64 from '../../Base64';
import IonIcon from 'react-native-vector-icons/Ionicons';
class ItemPost extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#fcfcfc" }}>
        <View style={myStyle.baibao}>
          <TouchableOpacity
            onPress={() => this.xem(this.props.data.id, this.props.data.title.rendered)}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Image
                  style={myStyle.hinh}
                  source={{ uri: this.getSrcImage(this.props.data.content.rendered) }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <View style={myStyle.TieuDe}>
                  <HTML
                    html={"<span>" + this.props.data.title.rendered + "</span>"}
                    tagsStyles={htmlStyle}
                  />
                </View>
                <View style={myStyle.edit}>
                  <TouchableOpacity
                    onPress={() => this.xoa(this.props.data.id, this.props.data.title.rendered)}
                    style={{
                      paddingLeft: 5,
                      flex: 1,
                      alignItems: "center",
                      flexDirection: "row"
                    }}
                  >
                    <IonIcon name="ios-trash-outline" size={20} />
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
                    <IonIcon name="ios-create-outline" size={20} />
                    <Text style={myStyle.textEdit}> Chỉnh sửa</Text>
                  </TouchableOpacity>
                </View>
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
                this.loadData();
              } else Alert.alert("Cảnh báo", "Xóa thất bại!");
            });
          }
        },
        { text: "Hủy", style: "cancel" }
      ],
      { cancelable: false }
    );
    return true;
  }
  chinhsua(i) {
    this.props.navigation.navigate("chinhsua", { id: i });
  }
  // lấy nguồn hình ảnh từ content html
  getSrcImage(content) {
    //tìm thẻ img đầu tiên
    let indexImg = content.toString().indexOf("<img");
    //không tìm thấy trả về đường dẫn mặc định
    if (indexImg == -1)
      return "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR95Iv69vIsfDjhtuBDIAfvKO1e5pyRMwDYXDYeWDpjnLRt5JUe";
    // tìm vị trí mở src
    let indexSrcStart = content.toString().indexOf("src", indexImg) + 5;
    //tìm vị trí đóng src
    let indexSrcEnd = content.toString().indexOf('"', indexSrcStart);
    //lấy đường dẫn
    let src = content.substring(indexSrcStart, indexSrcEnd);
    return src.replace("http://localhost", API.getURL());
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
    paddingLeft: 0,
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
    borderColor: "#fafafa",
    padding: 7,
    backgroundColor: "#fdfdfd",
    flexDirection: "row"
    // borderBottomStartRadius: 8,
    // borderBottomEndRadius: 8
  },
  textEdit: {
    fontSize: 12,
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
    borderColor: "#f6f6f6",
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