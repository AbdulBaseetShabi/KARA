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
      show_delete_prompt: false,
      show_add_new_table: false,
    };
    this.deleteTable = this.deleteTable.bind(this);
    this.deleteDataInTable = this.deleteDataInTable.bind(this);
    this.changeDeleteModalState = this.changeDeleteModalState.bind(this);
    this.changeAddTableModalState = this.changeAddTableModalState.bind(this);
    this.addTable = this.addTable.bind(this);
    this.delete_table_or_all_entries = false;
    this.table_to_delete = "";
  }

  changeDeleteModalState(state, table_to_delete, delete_table_or_all_entries) {
    this.table_to_delete = table_to_delete;
    this.delete_table_or_all_entries = delete_table_or_all_entries;
    this.setState({ show_delete_prompt: state });
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

  render() {
    return (
      <div id="table-view-container">
        <AddNewTable
          show={this.state.show_add_new_table}
          openModal={this.changeAddTableModalState}
          loading={this.state.is_loading_add_new_table}
          addTable={this.addTable}
        />
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
        <div className="row">
          {mock_data.map((db, index) => {
            return (
              <div key={index} className="col-4 custom-card">
                <label className="center-label db-name-label">
                  {db.table_name}
                </label>
                <hr className="header-hr" />
                <label>Number of Entries: {db.no_of_entries} records</label>
                <br />
                <label>Number of Columns: {db.no_of_colums} columns</label>{" "}
                <br />
                <label>Size: {db.size}</label> <br />
                <label>Date Created: {db.date_created}</label>
                <br />
                <a href="/data">
                  <div className="button view-more-button">View Entries</div>
                </a>
                <a href="/table/edit">
                  <div className="button edit-button">Edit</div>
                </a>
                <div
                  className="button delete-button"
                  onClick={() => {
                    this.changeDeleteModalState(true, db.table_name, true);
                  }}
                >
                  DELETE TABLE
                </div>
                <div
                  className="button delete-button"
                  onClick={() => {
                    this.changeDeleteModalState(true, db.table_name, false);
                  }}
                >
                  Delete all entries
                </div>
              </div>
            );
          })}
          <div key={mock_data.length} className="col-4 custom-card">
            <label className="center-label" id="add-new-db-label">
              ADD A NEW TABLE
            </label>
            <hr className="header-hr" />
            <i className="fas fa-plus fa-7x big-plus" onClick={()=>this.changeAddTableModalState(true)}></i>
          </div>
        </div>
      </div>
    );
  }
}
export default TableView;
