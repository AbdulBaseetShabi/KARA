import React from "react";
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
    };
  }

  render() {
    return (
      <div id="db-view-container">
        <label className="center-label page-label">
          Databases in Current Server
        </label>
        <hr className="header-hr" />
        <div className="row">
          {mock_data.map((db, index) => {
            return (
              <div key={index} className="col-4 custom-card">
                <label className="center-label db-name-label">{db.db_name}</label>
                <hr className="header-hr" />
                <label>Tables: {db.no_of_tables} found in the database</label>
                <br />
                <label>Size: {db.size}</label>
                <br />
                <label>Date Created: {db.date_created}</label>
                <br />
                <a href="/table">
                  <div id="view-more-button" className="button">View more info</div>
                </a>
                <a href="/databases">
                  <div id="edit-button" className="button">Edit</div>
                </a>
                <a href="/databases">
                  <div id="delete-button" className="button">DELETE</div>
                </a>
              </div>
            );
          })}
          <div key={mock_data.length} className="col-4 custom-card">
            <a href="/databases">
              <label className="center-label" id="add-new-db-label">ADD A NEW DATABASE</label>
              <hr className="header-hr" />
              <i className="fas fa-plus fa-7x"></i>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default DatabasesView;
