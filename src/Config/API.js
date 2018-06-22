export const url = "http://192.168.1.128";
import { AsyncStorage, ToastAndroid } from "react-native";
import Base64 from "./Base64";
module.exports = API = {
  getURL() {
    return url;
  },
  getAllPost() {
    return fetch(`${url}/thuctap/wp-json/wp/v2/posts`)
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        return json;
      })
      .catch(error => {
        console.error(error);
      });
  },
  getCTBaiBao(id) {
    return fetch(`${url}/thuctap/wp-json/wp/v2/posts/${id}`)
      .then(response => {
        return response.json();
      })
      .then(json => {
        return json;
      })
      .catch(error => {
        console.error(error);
      });
  },
  generate_auth_cookie(username, password) {
    return fetch(
      `${url}/thuctap/api/auth/generate_auth_cookie/?username=${username}&password=${password}&seconds=86400&insecure=cool`
    )
      .then(response => {
        return response.json();
      })
      .then(json => {
        return json;
      });
  },
  validate_auth_cookie: async function() {
    try {
      var cookie = await AsyncStorage.getItem("Cookie");
    } catch (e) {
      console.log(e);
    }
    if (cookie == "") return false;
    let response = await fetch(
      `${url}/thuctap/api/auth/validate_auth_cookie/?cookie=${cookie}&insecure=cool`
    );
    let json = await response.json();
    return json.valid;
  },
  UploadImage: async function(path) {
    try {
      let formData = new FormData();
      formData.append("file", path);
      let response = await fetch(
        API.getURL() + "/thuctap/wp-json/wp/v2/media/",
        {
          headers: {
            Authorization:
              "Basic " + Base64.btoa("admin:yEgN NbO6 w6k3 vSuU xBjV E8Ok"),
            "Content-Type": "multipart/form-data"
          },
          body: formData,
          method: "POST"
        }
      );
      if ((response.status === 201)) {
        let json = await response.json();
        return json.guid.rendered;
      }
      console.log("Lỗi");
      return "";
    } catch (e) {
      console.log(e);
    }
  },
  Login: async function(username, password) {
    let base64=Base64.btoa(`${username}:${password}`);
    let response = await fetch(`${API.getURL()}/thuctap/wp-json/wp/v2/users/me`, {
      headers: {
        Authorization: "Basic " + base64,
        "Content-Type": "multipart/form-data"
      },
      method: "GET"
    });
    if (response.status === 200) {
      let json = await response.json();
      await AsyncStorage.setItem("Base64", base64);
      return json;
    } else {
      let json = await response.json();
      if (json.code === "incorrect_password") {
        ToastAndroid.show("Sai mật khẩu", ToastAndroid.LONG);
        return null;
      } else if (json.code === "invalid_username") {
        ToastAndroid.show("Tên người dùng không hợp lệ", ToastAndroid.LONG);
        return null;
      }
    }
  }
};
