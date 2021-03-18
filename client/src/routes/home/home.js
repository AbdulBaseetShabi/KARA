import React from "react";
import PopUp from "../../widgets/pop-ups/message-pop-up/pop-ups";
import "./home.css";
import HTTPCalls from "../../services/api-connect";
import Global from "../../services/global";

const suggested_drivers = [
  "SQL Server",
  "Microsoft Access Driver (*.mdb, *.accdb)",
  "Microsoft Excel Driver (*.xls, *.xlsx, *.xlsm, *.xlsb)",
  "Microsoft Access Text Driver (*.txt, *.csv)",
  "SQL Server Native Client 11.0",
  "SQL Server Native Client RDA 11.0",
  "ODBC Driver 13 for SQL Server",
  "ODBC Driver 17 for SQL Server",
  "MySQL ODBC 8.0 ANSI Driver",
  "MySQL ODBC 8.0 Unicode Driver",
];

// const instruction = [
//   {
//     text: "Refer to this link to find your ODBC driver for Windows",
//     link:
//       "https://docs.microsoft.com/en-us/sql/database-engine/configure-windows/check-the-odbc-sql-server-driver-version-windows?view=sql-server-ver15",
//   },
//   {
//     text: "Refer to this link to find your ODBC driver for MacOS",
//     link: "http://support.openlinksw.com/support/mac-faq.html#8",
//   },
// ];
class Home extends React.Component {
  constructor(props) {
    super(props);
    if (sessionStorage.getItem(Global["APP_KEY"]) !== null) {
      window.location.replace("/databases");
    }
    this.state = {
      loading: false,
      response: {},
      show_suggestions: false,
      suggestions: [],
      selected_driver: "",
    };
    this.updatePopUp = this.updatePopUp.bind(this);
    this.closeSuggestions = this.closeSuggestions.bind(this);
    this.userData = {
      server: "",
      user_id: "",
      password: "",
      driver: "",
    };
  }

  modifyLoginCredentials(credential, value) {
    this.userData[credential] = value;
    if (credential === "driver") {
      this.setState((prevState, prevProps) => {
        let new_state = {
          show_suggestions: false,
          suggestions: [],
          selected_driver: "",
        };
        let lowercase_value = value.toLowerCase();
        if (value.length !== 0) {
          new_state.show_suggestions = true;
          new_state.suggestions = suggested_drivers.filter((suggestion) => {
            return suggestion.toLowerCase().startsWith(lowercase_value);
          });
          new_state.selected_driver = value;
        }

        return new_state;
      });
    }
  }

  closeSuggestions() {
    if (this.state.show_suggestions) {
      this.setState({
        show_suggestions: false,
      });
    }
  }

  updatePopUp(response) {
    this.setState({ loading: false, response: response });
  }

  selectDriver(index) {
    this.setState((prevState, prevProps) => {
      let selected_driver = prevState.suggestions[index];
      this.userData["driver"] = selected_driver;
      return {
        show_suggestions: false,
        suggestions: [],
        selected_driver: selected_driver,
      };
    });
  }

  logIn() {
    this.setState({ loading: true, show_suggestions: false });
    HTTPCalls(
      "POST",
      "/login",
      { user_credential: this.userData },
      (res) => {
        if (res["status"] === 200) {
          window.sessionStorage.setItem(
            Global["APP_KEY"],
            JSON.stringify(this.userData)
          );
          window.location.replace("/databases");
        } else {
          this.updatePopUp({ type: "error", message: res["response"] });
        }
      }
    );
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
          <div style={{ width: "100%", position: "relative" }}>
            <label className="center-label">Driver</label>
            <input
              autoComplete="off"
              className="center-div"
              type="text"
              id="driver"
              value={this.state.selected_driver}
              placeholder="Driver..."
              onChange={(e) => {
                this.modifyLoginCredentials("driver", e.target.value);
              }}
            ></input>
            {this.state.show_suggestions ? (
              <div className="suggestions">
                {this.state.suggestions.map((suggestion, index) => {
                  return (
                    <div
                      className="suggestion-items"
                      key={index}
                      onClick={(e) => this.selectDriver(index)}
                    >
                      {suggestion}
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>

          <label className="center-label">Server</label>
          <input
            className="center-div"
            type="text"
            id="server"
            placeholder="Server..."
            onChange={(e) => {
              this.modifyLoginCredentials("server", e.target.value);
            }}
            onFocus={this.closeSuggestions}
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
            onFocus={this.closeSuggestions}
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
            onFocus={this.closeSuggestions}
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
