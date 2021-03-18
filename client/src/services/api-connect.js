import Global from "./global";

function HTTPCalls(method, endpoint, data, callback) {
  const HTTP = new XMLHttpRequest();
  HTTP.open(method, `${Global["API_URL"]}${endpoint}`);
  HTTP.setRequestHeader('Content-Type', 'application/json');

  HTTP.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let response = JSON.parse(HTTP.response);
      callback(response);
    }
  };

  let payload = data === null || data === undefined ? null : JSON.stringify(data);
  HTTP.send(payload);
}

export default HTTPCalls;
