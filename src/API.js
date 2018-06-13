export const url = "http://192.168.1.135";
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
  login(username, password) {
    return fetch(`${url}/thuctap/api/auth/generate_auth_cookie/?username=${username}&password=${password}&insecure=cool`)
      .then(response => {
        return response.json();
      })
      .then(json => {
        return json;
      });
  }
};
