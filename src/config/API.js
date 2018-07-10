export const url = "http://192.168.1.128";
import { AsyncStorage, ToastAndroid } from "react-native";
import Base64 from "./Base64";

Category = {
  Remove: async function(id) {
    try {
      var base64 = await AsyncStorage.getItem("Base64", "");
    } catch (e) {
      console.log(e);
    }
    try {
      let response = await fetch(
        `${url}/thuctap/wp-json/wp/v2/categories/${id}?force=true`,
        {
          headers: {
            Authorization: "Basic " + base64
          },
          method: "DELETE"
        }
      );
      if (response.status === 200) {
        return true;
      }
      return false;
    } catch (e) {
      console.log(e);
    }
  },
  Save: async function(id, name, slug, description, parent) {
    var urlTemp = `${url}/thuctap/wp-json/wp/v2/categories`;
    var base64 = await AsyncStorage.getItem("Base64", "");
    var formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("description", description);
    formData.append("parent", parent);
    if (id != "") urlTemp = `${urlTemp}/${id}`;
    let response = await fetch(`${urlTemp}`, {
      headers: {
        Authorization: "Basic " + base64
      },
      body: formData,
      method: "POST"
    });
    if (response.status === 200) {
      return true;
    } else if (response.status === 201) {
      return true;
    } else {
      return response.json();
    }
  }
};

Tag = {
  Remove: async function(id) {
    try {
      var base64 = await AsyncStorage.getItem("Base64", "");
    } catch (e) {
      console.log(e);
    }
    try {
      let response = await fetch(
        `${url}/thuctap/wp-json/wp/v2/tags/${id}?force=true`,
        {
          headers: {
            Authorization: "Basic " + base64
          },
          method: "DELETE"
        }
      );
      if (response.status === 200) {
        return true;
      }
      return false;
    } catch (e) {
      console.log(e);
    }
  },
  Save: async function(id, name, slug, description) {
    var urlTemp = `${url}/thuctap/wp-json/wp/v2/tags`;
    var base64 = await AsyncStorage.getItem("Base64", "");
    var formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("description", description);
    if (id != "") urlTemp = `${urlTemp}/${id}`;
    let response = await fetch(`${urlTemp}`, {
      headers: {
        Authorization: "Basic " + base64
      },
      body: formData,
      method: "POST"
    });
    if (response.status === 200) {
      return true;
    } else if (response.status === 201) {
      return true;
    } else {
      return response.json();
    }
  }
};

Image = {
  UploadImage: async function(path) {
    try {
      var base64 = await AsyncStorage.getItem("Base64", "");
    } catch (e) {
      console.log(e);
    }
    try {
      let formData = new FormData();
      formData.append("file", path);
      let response = await fetch(url + "/thuctap/wp-json/wp/v2/media/", {
        headers: {
          Authorization: "Basic " + base64,
          "Content-Type": "multipart/form-data"
        },
        body: formData,
        method: "POST"
      });
      if (response.status === 201) {
        let json = await response.json();
        return json.guid.rendered;
      }
      console.log("Lỗi");
      return "";
    } catch (e) {
      console.log(e);
    }
  },
  DeleteImage: async function(id){
    try {
      var base64 = await AsyncStorage.getItem("Base64", "");
    } catch (e) {
      console.log(e);
    }
    return await fetch(`${url}/thuctap/wp-json/wp/v2/media/${id}?force=true`, {
      headers: {
        Authorization:
          "Basic " + base64 //MK: SO1H sjHe BmAm jzX1 wQZc 5LlD
      },
      method: "DELETE"
    });
  }
};

Page ={
  Remove: async function(id) {
    try {
      var base64 = await AsyncStorage.getItem("Base64", "");
    } catch (e) {
      console.log(e);
    }
    try {
      let response = await fetch(
        `${url}/thuctap/wp-json/wp/v2/pages/${id}?force=true`,
        {
          headers: {
            Authorization: "Basic " + base64
          },
          method: "DELETE"
        }
      );
      if (response.status === 200) {
        return true;
      }
      return false;
    } catch (e) {
      console.log(e);
    }
  },
  Save: async function(id, name, slug, description) {
    var urlTemp = `${url}/thuctap/wp-json/wp/v2/pages`;
    var base64 = await AsyncStorage.getItem("Base64", "");
    var formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("description", description);
    if (id != "") urlTemp = `${urlTemp}/${id}`;
    let response = await fetch(`${urlTemp}`, {
      headers: {
        Authorization: "Basic " + base64
      },
      body: formData,
      method: "POST"
    });
    if (response.status === 200) {
      return true;
    } else if (response.status === 201){
      return true
    } else {
      return response.json();
    }
  },
}

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
  validate_account: async function() {
    try {
      var base64 = await AsyncStorage.getItem("Base64", "");
    } catch (e) {
      console.log(e);
    }
    if (base64 == "") return null;
    let response = await fetch(`${url}/thuctap/wp-json/wp/v2/users/me`, {
      headers: {
        Authorization: "Basic " + base64
      },
      method: "GET"
    });
    if (response.status === 200) {
      let json = await response.json();
      return json;
    } else {
      return null;
    }
  },
  Login: async function(username, password) {
    let base64 = Base64.btoa(`${username}:${password}`);
    let response = await fetch(`${url}/thuctap/wp-json/wp/v2/users/me`, {
      headers: {
        Authorization: "Basic " + base64
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
  },
  Category: Category,
  Tag: Tag,
  Image: Image
};
