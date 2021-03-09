import Global from "./global";

function HTTPCalls(method, endpoint, data, callback) {
  const Http = new XMLHttpRequest();
  Http.open(method, Global["HOST_URL"]);
  Http.send();

  Http.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      callback(Http.response);
    }
  };
}

export default HTTPCalls;
