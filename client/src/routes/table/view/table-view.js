import React from "react";
import "./table-view.css";

const mock_data = [
  {
    table_name: "Tracking Table",
    size: "1 GB",
    no_of_colums: 5,
    no_of_entries: 500,
    date_created: new Date().toLocaleDateString(),
  },
];

function TableView() {
  return (
    <div id="table-view-container">
      <label className="center-label page-label">
        Tables in the Trivia Database
      </label>
      <hr className="header-hr" />
      <div className="row">
      {mock_data.map((db, index) => {
            return (
              <div index={index} className="col-4 card">
                <label className="center-label db-name-label">{db.table_name}</label>
                <hr className="header-hr" />
                <label>Number of Entries: {db.no_of_entries} records</label>
                <label>Number of Columns: {db.no_of_colums} columns</label>
                <br />
                <label>Size: {db.size}</label>
                <br />
                <label>Date Created: {db.date_created}</label>
                <br />
                <a href="/table">
                  <div id="view-more-button" className="button">View Data</div>
                </a>
                <a href="/table">
                  <div id="edit-button" className="button">Edit</div>
                </a>
                <a href="/table">
                  <div id="delete-button" className="button">DELETE</div>
                </a>
              </div>
            );
          })}
          <div className="col-4 card">
            <a href="/databases">
              <label className="center-label" id="add-new-db-label">ADD A NEW TABLE</label>
              <hr className="header-hr" />
              <i className="fas fa-plus fa-7x"></i>
            </a>
          </div>
        </div>
      </div>
  );
}

export default TableView;