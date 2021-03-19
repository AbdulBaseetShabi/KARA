import React from "react";
import DeletePopUp from "../../../widgets/pop-ups/delete-pop-up/delete-pop-up";
import AddNewTable from "./add-new-table";
import "./table-view.css";

const mock_data = [
  {
    table_name: "Tracking",
    size: "1 GB",
    no_of_colums: 5,
    no_of_entries: 500,
    date_created: new Date().toLocaleDateString(),
  },
];

class TableView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      is_loading: false,
      is_loading_add_new_table: false,
      is_loading_change_table_name: false,
      show_delete_prompt: false,
      show_add_new_table: false,
      show_change_table_name_view: false,
    };

    this.table_name_to_change = {
      from: "",
      to: "",
    };
    this.deleteTable = this.deleteTable.bind(this);
    this.deleteDataInTable = this.deleteDataInTable.bind(this);
    this.changeDeleteModalState = this.changeDeleteModalState.bind(this);
    this.changeAddTableModalState = this.changeAddTableModalState.bind(this);
    this.changeEditTableNameModalState = this.changeEditTableNameModalState.bind(this);
    this.controlChangeTableName = this.controlChangeTableName.bind(this);
    this.addTable = this.addTable.bind(this);
    this.delete_table_or_all_entries = false;
    this.table_to_delete = "";
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
    console.log(this.table_to_delete);
    this.setState({ is_loading: true });
  }

  addTable(table_data) {
    console.log(table_data);
    this.setState({ is_loading_add_new_table: true });
  }

  deleteDataInTable() {
    console.log("Data in " + this.table_to_delete);
    this.setState({ is_loading: true });
  }

  controlChangeTableName(event) {
    this.table_name_to_change.to = event.target.value;
  }

  changeDataBaseName() {
    console.log(this.table_name_to_change);
    if (this.table_name_to_change.to.length === 0) {
      alert("Enter a value");
    }
  }

  render() {
    return (
      <div id="table-view-container">
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
                          this.changeDataBaseName();
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
              : this.deleteDataInTable
          }
          delete_name={
            this.delete_table_or_all_entries ? "table" : "table's entries"
          }
          loading={this.state.is_loading}
        />
        <label className="center-label page-label">
          Tables in the <span id="db-name-selected">Trivia</span> Database
        </label>
        <hr className="header-hr" />
        <div className="row d-flex justify-content-center">
          {mock_data.map((table, index) => {
            return (
              <div key={index} className="col-3 custom-card">
                <label className="center-label db-name-label">
                  {table.table_name}
                </label>
                <hr className="header-hr" />
                <label>Number of Entries: {table.no_of_entries} records</label>
                <br />
                <label>
                  Number of Columns: {table.no_of_colums} columns
                </label>{" "}
                <br />
                <label>Size: {table.size}</label> <br />
                <label>Date Created: {table.date_created}</label>
                <br />
                <a href="/data">
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
          <div key={mock_data.length} className="col-3 custom-card">
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
