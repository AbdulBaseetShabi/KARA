import React from "react";
import HTTPCalls from "../../../services/api-connect";
import AddDB from "../db-edit-add-popup";
import PopUp from "../../../widgets/pop-ups/message-pop-up/pop-ups";
import "./databases-view.css";
import DeletePopUp from "../../../widgets/pop-ups/delete-pop-up/delete-pop-up";
import Global from "../../../services/global";

class DatabasesView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      is_loading: false,
      show_add_modal: false,
      creating_new_db: false,
      updating_db_name: false,
      is_add_new_db: false,
      response: {},
      show_delete_prompt: false,
      databases: [],
    };
    this.db_to_delete = "";
    this.new_db_name = "";
    this.modified_db = {
      previous_name: "",
      current_name: "",
    };
    this.changeDeleteModalState = this.changeDeleteModalState.bind(this);
    this.deleteDataBase = this.deleteDataBase.bind(this);
    this.changeMessageModalState = this.changeMessageModalState.bind(this);
    this.createNewDatabase = this.createNewDatabase.bind(this);
    this.changeDataBaseName = this.changeDataBaseName.bind(this);
    this.updatePopUp = this.updatePopUp.bind(this);
    this.controlCreateNewDataBase = this.controlCreateNewDataBase.bind(this);
    this.controlChangeDataBaseName = this.controlChangeDataBaseName.bind(this);
  }

  componentDidMount() {
    HTTPCalls(
      "POST",
      "/db/info",
      {
        user_credential: JSON.parse(sessionStorage.getItem(Global["APP_KEY"])),
      },
      (res) => {
        if (res["status"] === 200) {
          this.setState({ databases: res["response"] });
        } else {
          this.updatePopUp({ type: "error", message: res["response"] });
        }
      }
    );
  }

  changeMessageModalState(state, add_new_or_edit_old, old_name) {
    if (!add_new_or_edit_old) {
      this.modified_db.previous_name = old_name;
    }
    this.setState({
      show_add_modal: state,
      is_add_new_db: add_new_or_edit_old,
    });
  }

  changeDeleteModalState(state, db_to_delete) {
    this.db_to_delete = db_to_delete;
    this.setState({ show_delete_prompt: state });
  }

  controlCreateNewDataBase(value) {
    this.new_db_name = value;
  }

  controlChangeDataBaseName(value) {
    this.modified_db.current_name = value;
  }

  deleteDataBase() {
    this.setState({ is_loading: true });
    HTTPCalls(
      "POST",
      "/db/delete",
      {
        user_credential: JSON.parse(sessionStorage.getItem(Global["APP_KEY"])),
        db_name: this.db_to_delete,
      },
      (res) => {
        this.setState({
          response: {
            type:
              res["status"] === 400
                ? "error"
                : res["status"] === 200
                ? "success"
                : "warning",
            message: res["response"],
          },
          is_loading: false,
        });
      }
    );
  }

  changeDataBaseName() {
    if (this.modified_db.current_name === this.modified_db.previous_name) {
      this.updatePopUp({ type: "error", message: "Using this same name" });
    } else if (this.modified_db.current_name.length === 0) {
      this.updatePopUp({ type: "success", message: "No name specified" });
    } else {
      this.setState({ updating_db_name: true });
      HTTPCalls(
        "POST",
        "/db/rename",
        {
          user_credential: JSON.parse(
            sessionStorage.getItem(Global["APP_KEY"])
          ),
          db_name: this.modified_db,
        },
        (res) => {
          this.setState({
            response: {
              type:
                res["status"] === 400
                  ? "error"
                  : "success",
              message: res["response"],
            },
            updating_db_name: false,
          });
        }
      );
    }
  }

  createNewDatabase() {
    if (this.new_db_name.length === 0) {
      this.updatePopUp({ type: "warning", message: "No name specified" });
    } else {
      this.setState({ creating_new_db: true });
      HTTPCalls(
        "POST",
        "/db/create",
        {
          user_credential: JSON.parse(
            sessionStorage.getItem(Global["APP_KEY"])
          ),
          db_name: this.new_db_name,
        },
        (res) => {
          if (res["status"] === 200) {
            this.setState({
              creating_new_db: false,
              response: {
                type: "success",
                message: res["response"],
              },
            });
          } else {
            this.setState({
              response: {
                type: "error",
                message: res["response"],
              },
              creating_new_db: false,
            });
          }
        }
      );
    }
  }

  updatePopUp(response) {
    if (response === "reload") {
      window.location.reload();
    } else {
      this.setState({ response: response });
    }
  }

  render() {
    return (
      <div id="db-view-container">
        <AddDB
          show={this.state.show_add_modal}
          openModal={this.changeMessageModalState}
          loading={this.state.creating_new_db || this.state.updating_db_name}
          controlCreateNewDatabase={this.controlCreateNewDataBase}
          controlChangeDataBaseName={this.controlChangeDataBaseName}
          createNewDatabase={this.createNewDatabase}
          changeDataBaseName={this.changeDataBaseName}
          is_add_new_db={this.state.is_add_new_db}
          old_name={this.modified_db.previous_name}
        />
        <DeletePopUp
          show={this.state.show_delete_prompt}
          openModal={this.changeDeleteModalState}
          deleteData={this.deleteDataBase}
          delete_name="database"
          loading={this.state.is_loading}
        />
        <PopUp
          modaltype={this.state.response.type}
          show={Object.keys(this.state.response).length !== 0}
          closePopUp={this.updatePopUp}
        >
          {this.state.response.message}
        </PopUp>

        <label className="center-label page-label">
          Databases in Current Server
        </label>
        <hr className="header-hr" />
        <div className="row d-flex justify-content-center">
          {this.state.databases.map((db, index) => {
            let url = `/table/view?db=${db.db_name}`;
            return (
              <div key={index} className="col-3 custom-card">
                <label className="center-label db-name-label">
                  {db.db_name}
                </label>
                <hr className="header-hr" />
                <label>Size: {db.size} MB</label>
                <br />
                <a href={url}>
                  <div className="button view-more-button">View Tables</div>
                </a>
                <div
                  className="button delete-button"
                  onClick={() =>
                    this.changeMessageModalState(true, false, db.db_name)
                  }
                >
                  Change Name
                </div>
                <div
                  className="button delete-button"
                  onClick={() => this.changeDeleteModalState(true, db.db_name)}
                >
                  DELETE
                </div>
              </div>
            );
          })}
          <div key={this.state.length} className="col-3 custom-card">
            <label className="center-label" id="add-new-db-label">
              ADD A NEW DATABASE
            </label>
            <hr className="header-hr" />
            <i
              className="fas fa-plus fa-7x big-plus"
              onClick={() => {
                this.changeMessageModalState(true, true, "");
              }}
            ></i>
          </div>
        </div>
      </div>
    );
  }
}

export default DatabasesView;
