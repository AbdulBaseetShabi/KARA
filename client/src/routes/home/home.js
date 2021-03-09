import React from "react";
import PopUp from "../../widgets/pop-ups/message-pop-up/pop-ups";
import "./home.css";
import HTTPCalls from "../../services/api-connect";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      response: {},
    };
    this.updatePopUp = this.updatePopUp.bind(this);
    this.userData = {
      server: "",
      user_id: "",
      password: "",
    };
  }

  modifyLoginCredentials(credential, value) {
    this.userData[credential] = value;
  }

  updatePopUp(response) {
    this.setState({ loading: false, response: response });
  }

  logIn() {
    this.setState({ loading: true });
    HTTPCalls("GET", "", "", (res) => {
      console.log(res);
      if (res) {
        window.sessionStorage.setItem(
          "user_kara_credentials",
          JSON.stringify(this.userData)
        );
        this.setState({ loading: false });
        window.location.replace("/databases");
      } else {
        this.updatePopUp({ type: "error", message: "Error Occured" });
      }
    });
  }

  render() {
    return (
      <div
        id="home-container"
        className="d-flex justify-content-center align-items-center"
      >
        <PopUp
          modaltype={this.state.response.type}
          show={Object.keys(this.state.response).length !== 0}
          closePopUp={this.updatePopUp}
        >
          {this.state.response.message}
        </PopUp>
        <div id="login-container">
          <label className="center-label" id="auth-label">
            Authentication Page
          </label>
          <hr />
          <label className="center-label">Server</label>
          <input
            className="center-div"
            type="text"
            id="server"
            placeholder="Server..."
            onChange={(e) => {
              this.modifyLoginCredentials("server", e.target.value);
            }}
          ></input>
          <label className="center-label">User ID/Name</label>
          <input
            className="center-div"
            type="text"
            id="user-id"
            placeholder="User ID/Name..."
            onChange={(e) => {
              this.modifyLoginCredentials("user_id", e.target.value);
            }}
          ></input>
          <label className="center-label">Password</label>
          <input
            className="center-div"
            type="password"
            id="password"
            placeholder="Password..."
            onChange={(e) => {
              this.modifyLoginCredentials("password", e.target.value);
            }}
          ></input>
          <hr />
          <div
            id="login-button"
            className="button"
            style={{
              cursor: this.state.loading ? "auto" : "pointer",
              height: this.state.loading ? "auto" : "41px",
              lineHeight: this.state.loading ? "inherit" : "41px",
            }}
            onClick={
              !this.state.loading
                ? () => {
                    this.logIn();
                  }
                : null
            }
          >
            {this.state.loading ? (
              <label style={{ paddingTop: "7px" }}>
                <span
                  className="spinner-border spinner-border-sm"
                  aria-hidden="true"
                  style={{ margin: "0 5px 3.5px 0px" }}
                ></span>
                Loading
              </label>
            ) : (
              "Login"
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
