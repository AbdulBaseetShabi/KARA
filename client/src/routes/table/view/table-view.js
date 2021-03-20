import React from "react";
import HTTPCalls from "../../../services/api-connect";
import Global from "../../../services/global";
import DeletePopUp from "../../../widgets/pop-ups/delete-pop-up/delete-pop-up";
import PopUp from "../../../widgets/pop-ups/message-pop-up/pop-ups";
import AddNewTable from "./add-new-table";
import "./table-view.css";

class TableView extends React.Component {
  constructor(props) {
    super(props);
    const urlParams = new URLSearchParams(window.location.search);
    this.db = urlParams.get('db');
    if (this.db === null) {
      window.location.replace('/databases');
    }
    this.state = {
      is_loading: false,
      is_loading_add_new_table: false,
      is_loading_change_table_name: false,
      show_delete_prompt: false,
      show_add_new_table: false,
      show_change_table_name_view: false,
      response: {},
      tables: []
    };
    
    this.table_name_to_change = {
      from: "",
      to: "",
    };
    this.deleteTable = this.deleteTable.bind(this);
    this.deleteEntries = this.deleteEntries.bind(this);
    this.changeDeleteModalState = this.changeDeleteModalState.bind(this);
    this.changeAddTableModalState = this.changeAddTableModalState.bind(this);
    this.changeEditTableNameModalState = this.changeEditTableNameModalState.bind(this);
    this.controlChangeTableName = this.controlChangeTableName.bind(this);
    this.addTable = this.addTable.bind(this);
    this.updatePopUp = this.updatePopUp.bind(this);
    this.delete_table_or_all_entries = false;
    this.table_to_delete = "";
  }

  componentDidMount(){
    HTTPCalls(
      "POST",
      "/table/info",
      {
        user_credential: JSON.parse(sessionStorage.getItem(Global["APP_KEY"])),
        db_name: this.db
      },
      (res) => {
        if (res["status"] === 200) {
          this.setState({ tables: res["response"] });
        } else {
          this.updatePopUp({ type: "error", message: res["response"] });
        }
      }
    );
  }

  changeDeleteModalState(state, table_to_delete, delete_table_or_all_entries) {
    this.table_to_delete = table_to_delete;
    this.delete_table_or_all_entries = delete_table_or_all_entries;
    this.setState({ show_delete_prompt: state });
  }

  changeEditTableNameModalState(state, name) {
    if (name.length === 0) {
      this.table_name_to_change.to = "";
    }
    this.table_name_to_change.from = name;
    this.setState({ show_change_table_name_view: state });
  }

  changeAddTableModalState(state) {
    this.setState({ show_add_new_table: state });
  }

  deleteTable() {
    this.setState({ is_loading: true });
    HTTPCalls(
      "POST",
      "/table/delete",
      {
        user_credential: JSON.parse(sessionStorage.getItem(Global["APP_KEY"])),
        db_name: this.db,
        table_name: this.table_to_delete
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

  addTable(table_data) {
    console.log(table_data);
    this.setState({ is_loading_add_new_table: true });
  }

  deleteEntries() {
    console.log("Data in " + this.table_to_delete);
    this.setState({ is_loading: true });
    HTTPCalls(
      "POST",
      "/entries/delete",
      {
        user_credential: JSON.parse(sessionStorage.getItem(Global["APP_KEY"])),
        db_name: this.db,
        table_name: this.table_to_delete
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

  controlChangeTableName(event) {
    this.table_name_to_change.to = event.target.value;
  }

  changeTableName() {
    console.log(this.table_name_to_change);
    if (this.table_name_to_change.to.length === 0) {
      this.updatePopUp({ type: "warning", message: "No name specified" });
    }else if(this.table_name_to_change.to.toLowerCase() === this.table_name_to_change.from.toLowerCase()){
      this.updatePopUp({ type: "warning", message: "Using this same name" });
    }else{
      this.setState({ is_loading_change_table_name: true });
      HTTPCalls(
        "POST",
        "/table/rename",
        {
          user_credential: JSON.parse(
            sessionStorage.getItem(Global["APP_KEY"])
          ),
          db_name: this.db,
          table_name: this.table_name_to_change
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
            is_loading_change_table_name: false,
          });
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
      <div id="table-view-container">
        <PopUp
          modaltype={this.state.response.type}
          show={Object.keys(this.state.response).length !== 0}
          closePopUp={this.updatePopUp}
        >
          {this.state.response.message}
        </PopUp>
        <AddNewTable
          show={this.state.show_add_new_table}
          openModal={this.changeAddTableModalState}
          loading={this.state.is_loading_add_new_table}
          addTable={this.addTable}
        />
        {this.state.show_change_table_name_view ? (
          <div className="modal-options">
            <div className="modal-options-content">
              <label className="center-label page-label">
                Change Table Name
              </label>
              <hr className="header-hr" />
              <label className="metadata-label center-label">
                Table Name: {this.table_name_to_change.from}
              </label>

              <input
                type="text"
                style={{ marginBottom: "10px" }}
                onChange={this.controlChangeTableName}
              ></input>
              <div className="row button-row">
                <button
                  className="col"
                  type="button"
                  style={{ margin: "0 auto" }}
                  onClick={
                    this.state.is_loading_change_table_name
                      ? null
                      : () => {
                          this.changeTableName();
                        }
                  }
                >
                  {this.state.is_loading_change_table_name ? (
                    <label style={{ paddingTop: "7px" }}>
                      <span
                        className="spinner-border spinner-border-sm"
                        aria-hidden="true"
                        style={{ margin: "0 5px 3.5px 0px" }}
                      ></span>
                      Loading
                    </label>
                  ) : (
                    "Change Table Name"
                  )}
                </button>
                <button
                  className="col"
                  type="button"
                  style={{ margin: "0 auto" }}
                  onClick={() => this.changeEditTableNameModalState(false, "")}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : null}
        <DeletePopUp
          show={this.state.show_delete_prompt}
          openModal={this.changeDeleteModalState}
          deleteData={
            this.delete_table_or_all_entries
              ? this.deleteTable
              : this.deleteEntries
          }
          delete_name={
            this.delete_table_or_all_entries ? "table" : "table's entries"
          }
          loading={this.state.is_loading}
        />
        <label className="center-label page-label">
          Tables in the <span id="db-name-selected">{this.db}</span> Database
        </label>
        <hr className="header-hr" />
        <div className="row d-flex justify-content-center">
          {this.state.tables.map((table, index) => {
            let last_modified_date = new Date(table.modify_date);
            let date_created = new Date(table.create_date);
            let url = `/data?db=${this.db}&table=${table.table_name}`
            return (
              <div key={index} className="col-3 custom-card">
                <label className="center-label db-name-label">
                  {table.table_name}
                </label>
                <hr className="header-hr" />
                <label className="center-label">Date Last Modified</label>
                <label className="center-label">{last_modified_date.toLocaleDateString() + " " + last_modified_date.toLocaleTimeString()}</label>
                <label className="center-label">Date Created</label>
                <label className="center-label">{date_created.toLocaleDateString() + " " + date_created.toLocaleTimeString()}</label>
                <br />
                <a href={url}>
                  <div className="button view-more-button">View Entries</div>
                </a>
                <div
                  className="button delete-button"
                  onClick={() => {
                    this.changeEditTableNameModalState(true, table.table_name);
                  }}
                >
                  Change name
                </div>
                <a href="/table/edit">
                  <div className="button edit-button">Edit</div>
                </a>
                <div
                  className="button delete-button"
                  onClick={() => {
                    this.changeDeleteModalState(true, table.table_name, true);
                  }}
                >
                  DELETE TABLE
                </div>
                <div
                  className="button delete-button"
                  onClick={() => {
                    this.changeDeleteModalState(true, table.table_name, false);
                  }}
                >
                  Delete all entries
                </div>
              </div>
            );
          })}
          <div key={this.state.tables.length} className="col-3 custom-card">
            <label className="center-label" id="add-new-db-label">
              ADD A NEW TABLE
            </label>
            <hr className="header-hr" />
            <i
              className="fas fa-plus fa-7x big-plus"
              onClick={() => this.changeAddTableModalState(true)}
            ></i>
          </div>
        </div>
      </div>
    );
  }
}
export default TableView;
