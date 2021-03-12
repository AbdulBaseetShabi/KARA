import React from "react";
import AddDB from "../db-edit-add-popup";
import PopUp from "../../../widgets/pop-ups/message-pop-up/pop-ups";
import "./databases-view.css";
import DeletePopUp from "../../../widgets/pop-ups/delete-pop-up/delete-pop-up";

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
      show_delete_prompt: false,
    };
    this.db_to_delete = "";
    this.new_db_name = {
      from: "",
      to: "",
    };
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
    this.new_db_name.to = value;
  }

  controlChangeDataBaseName(value) {
    this.modified_db.current_name = value;
  }

  deleteDataBase() {
    console.log(this.db_to_delete);
    this.setState({ is_loading: true });
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

  createNewDatabase(old_name) {
    this.new_db_name.from = old_name;
    console.log(this.new_db_name);
    if (this.new_db_name.to.length === 0) {
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
          <div key={mock_data.length} className="col-4 custom-card">
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
