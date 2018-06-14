export const url = "http://192.168.1.135";
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
      `${url}/thuctap/api/auth/generate_auth_cookie/?username=${username}&password=${password}&seconds=300&insecure=cool`
    )
      .then(response => {
        return response.json();
      })
      .then(json => {
        return json;
      });
  },
  validate_auth_cookie: async function() {
    try{
      var cookie = await AsyncStorage.getItem("Cookie");
    } catch(e)
    {
      console.log(e);
    }
    if (cookie == "") return false;
    let response = await fetch(`${url}/thuctap/api/auth/validate_auth_cookie/?cookie=${cookie}&insecure=cool`);
    let json = await response.json();
    return json.valid; 
  }
};
