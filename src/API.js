export const url = "http://192.168.1.125";
import { AsyncStorage } from "react-native";
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
      console.log()
      let formData = new FormData();
      formData.append("file", path);
      let response = await fetch(
        API.getURL() +
          "/thuctap/wp-json/wp/v2/media/",
        {
          headers: {
            Authorization:
              "Basic " + Base64.btoa("admin:yEgN NbO6 w6k3 vSuU xBjV E8Ok"),
            'Content-Type': 'multipart/form-data'
          },
          body: formData,
          method: "POST"
        }
      );
      console.log(response);
      if(response.status= 201 ){
        let json = await response.json();
        console.log(json);
        console.log(json.guid.rendered);
        return json.guid.rendered;
      }
      console.log("Lỗi");
      return "";
    } catch (e) {
      console.log(e);
    }
  }
};

const chars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
const Base64 = {
  btoa: input => {
    let str = input;
    let output = "";

    for (
      let block = 0, charCode, i = 0, map = chars;
      str.charAt(i | 0) || ((map = "="), i % 1);
      output += map.charAt(63 & (block >> (8 - (i % 1) * 8)))
    ) {
      charCode = str.charCodeAt((i += 3 / 4));

      if (charCode > 0xff) {
        throw new Error(
          "'btoa' failed: The string to be encoded contains characters outside of the Latin1 range."
        );
      }

      block = (block << 8) | charCode;
    }

    return output;
  },

  atob: input => {
    let str = input.replace(/=+$/, "");
    let output = "";

    if (str.length % 4 == 1) {
      throw new Error(
        "'atob' failed: The string to be decoded is not correctly encoded."
      );
    }
    for (
      let bc = 0, bs = 0, buffer, i = 0;
      (buffer = str.charAt(i++));
      ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
        ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
        : 0
    ) {
      buffer = chars.indexOf(buffer);
    }

    return output;
  }
};