import React from "react";
import AddDB from "../db-edit-add-popup";
import PopUp from "../../../widgets/pop-ups/pop-ups";
import "./databases-view.css";

const mock_data = [
  {
    db_name: "Tracking",
    size: "12 GB",
    no_of_tables: 5,
    date_created: new Date().toLocaleDateString(),
  },
];

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
    };
    this.new_db_name = "";
    this.modified_db = {
      previous_name: "",
      current_name: "",
    };
    this.changeModalState = this.changeModalState.bind(this);
    this.createNewDatabase = this.createNewDatabase.bind(this);
    this.changeDataBaseName = this.changeDataBaseName.bind(this);
    this.updatePopUp = this.updatePopUp.bind(this);
    this.controlCreateNewDataBase = this.controlCreateNewDataBase.bind(this);
    this.controlChangeDataBaseName = this.controlChangeDataBaseName.bind(this);
  }

  changeModalState(state, add_new_or_edit_old, old_name) {
    if (!add_new_or_edit_old) {
      this.modified_db.previous_name = old_name;
    }
    this.setState({
      show_add_modal: state,
      is_add_new_db: add_new_or_edit_old,
    });
  }

  controlCreateNewDataBase(value) {
    this.new_db_name = value;
  }

  controlChangeDataBaseName(value) {
    this.modified_db.current_name = value;
  }

  changeDataBaseName() {
    console.log(this.modified_db);
    if (this.modified_db.current_name === this.modified_db.previous_name) {
      this.updatePopUp({ type: "error", message: "Using this same name" });
    } else if (this.modified_db.current_name.length === 0) {
      this.updatePopUp({ type: "success", message: "No name specified" });
    } else {
      this.setState({ updating_db_name: true });
    }
  }

  createNewDatabase() {
    console.log(this.new_db_name);
    if (this.new_db_name.length === 0) {
      this.updatePopUp({ type: "warning", message: "No name specified" });
    } else {
      this.setState({ creating_new_db: true });
    }
  }

  updatePopUp(response) {
    this.setState({ response: response });
  }
  render() {
    return (
      <div id="db-view-container">
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
        <div className="row">
          {mock_data.map((db, index) => {
            return (
              <div key={index} className="col-4 custom-card">
                <label className="center-label db-name-label">
                  {db.db_name}
                </label>
                <hr className="header-hr" />
                <label>Tables: {db.no_of_tables} found in the database</label>
                <br />
                <label>Size: {db.size}</label>
                <br />
                <label>Date Created: {db.date_created}</label>
                <br />
                <a href="/table">
                  <div className="button view-more-button">View more info</div>
                </a>
                <div
                  className="button delete-button"
                  onClick={() => this.changeModalState(true, false, db.db_name)}
                >
                  Change Name
                </div>
                <a href="/databases">
                  <div className="button delete-button">DELETE</div>
                </a>
              </div>
            );
          })}
          <div key={mock_data.length} className="col-4 custom-card">
            <label className="center-label" id="add-new-db-label">
              ADD A NEW DATABASE
            </label>
            <hr className="header-hr" />
            <i
              className="fas fa-plus fa-7x big-plus"
              onClick={() => {
                this.changeModalState(true, true, "");
              }}
            ></i>
          </div>
        </div>
        <AddDB
          show={this.state.show_add_modal}
          openModal={this.changeModalState}
          loading={this.state.creating_new_db || this.state.updating_db_name}
          controlCreateNewDatabase={this.controlCreateNewDataBase}
          controlChangeDataBaseName={this.controlChangeDataBaseName}
          createNewDatabase={this.createNewDatabase}
          changeDataBaseName={this.changeDataBaseName}
          is_add_new_db={this.state.is_add_new_db}
          old_name={this.modified_db.previous_name}
        />
      </div>
    );
  }
}

export default DatabasesView;
