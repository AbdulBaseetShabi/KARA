import React from "react";

const column_representation = {
  column_name: "",
  allows_null: false,
  data_type: "",
  constraints: {
    primary_key: {
      is_primary_key: false,
      is_primary_key_selected: false,
    },
    unique_key: {
      is_unique_key: false,
      is_unique_key_selected: false,
    },
    foreign_key: {
      is_foreign_key: false,
      is_foreign_key_selected: false,
      reference_table_name: "",
      reference_column_name: "",
    },
  },
};

const data_type = ["int", "boolean", "varchar"];

class AddNewTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        table_data: {
          columns: [],
        },
      },
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.addNewColumn = this.addNewColumn.bind(this);
  }

  addNewColumn() {
    this.setState((prevState, prevProps) => {
      let columns = JSON.parse(
        JSON.stringify(prevState.data.table_data.columns)
      );
      columns.push(Object.assign({}, column_representation));
      return this.updateColumn(columns);
    });
  }

  deleteColumn(index) {
    this.setState((prevState, prevProps) => {
      let columns = JSON.parse(
        JSON.stringify(prevState.data.table_data.columns)
      );
      columns = columns.filter((item, i) => {
        return i !== index;
      });
      console.log(columns);
      return this.updateColumn(columns);
    });
  }

  handleInputChange(event) {
    this.setState((prevState, prevProps) => {
      let updated_column_data = JSON.parse(
        JSON.stringify(prevState.data.table_data.columns)
      );
      const target = event.target;

      let value = target.type === "checkbox" ? target.checked : target.value;
      let key = target.name;
      let index = parseInt(target.getAttribute("data-key"), 10);

      if (key === "keys") {
        let constraints = Object.assign(
          {},
          updated_column_data[index]["constraints"]
        );
        if (value === "null") {
          constraints["unique_key"]["is_unique_key_selected"] = false;
          constraints["primary_key"]["is_primary_key_selected"] = false;
          constraints["foreign_key"]["is_foreign_key_selected"] = false;
        } else if (value === "unique") {
          constraints["unique_key"]["is_unique_key_selected"] = true;
          constraints["primary_key"]["is_primary_key_selected"] = false;
          constraints["foreign_key"]["is_foreign_key_selected"] = false;
        } else if (value === "primary") {
          constraints["primary_key"]["is_primary_key_selected"] = true;
          constraints["foreign_key"]["is_foreign_key_selected"] = false;
          constraints["unique_key"]["is_unique_key_selected"] = false;
        } else {
          constraints["foreign_key"]["is_foreign_key_selected"] = true;
          constraints["primary_key"]["is_primary_key_selected"] = false;
          constraints["unique_key"]["is_unique_key_selected"] = false;
        }
        updated_column_data[index]["constraints"] = constraints;
      } else {
        updated_column_data[index][key] = value;
      }
      console.log(updated_column_data);
      return this.updateColumn(updated_column_data);
    });
  }

  addConstraint(index) {
    this.setState((prevState, prevProps) => {
      let updated_column_data = JSON.parse(
        JSON.stringify(prevState.data.table_data.columns)
      );
      let constraints = Object.assign(
        {},
        updated_column_data[index]["constraints"]
      );

      if (constraints["unique_key"]["is_unique_key_selected"]) {
        constraints["unique_key"]["is_unique_key"] = true;
        constraints["unique_key"]["is_unique_key_selected"] = false;
      } else if (constraints["primary_key"]["is_primary_key_selected"]) {
        constraints["primary_key"]["is_primary_key"] = true;
        constraints["primary_key"]["is_primary_key_selected"] = false;
      } else if (constraints["foreign_key"]["is_foreign_key_selected"]) {
        constraints["foreign_key"]["is_foreign_key"] = true;
        constraints["foreign_key"]["is_foreign_key_selected"] = false;
      }
      updated_column_data[index]["constraints"] = constraints;
      return this.updateColumn(updated_column_data);
    });
  }

  removeConstraint(event, index) {
    this.setState((prevState, prevProps) => {
      let updated_column_data = JSON.parse(
        JSON.stringify(prevState.data.table_data.columns)
      );
      let constraints = Object.assign(
        {},
        updated_column_data[index]["constraints"]
      );
      let name = event.target.name;

      if (name === "unique") {
        constraints["unique_key"]["is_unique_key"] = false;
      } else if (name === "primary") {
        constraints["primary_key"]["is_primary_key"] = false;
      } else {
        constraints["foreign_key"]["is_foreign_key"] = false;
      }

      updated_column_data[index]["constraints"] = constraints;
      return this.updateColumn(updated_column_data);
    });
  }

  updateColumn(new_column) {
    let updated_state = {
      table_data: {
        columns: new_column,
      },
    };
    return {
      data: updated_state,
    };
  }

  render() {
    if (this.props.show) {
      return (
        <div className="modal-options">
          <div className="modal-options-content column-edit">
            <label className="center-label page-label">Add New Table</label>
            <hr className="header-hr" />
            <label className="center-label">Table Name</label>
            <input type="text"></input>
            <div>
              {this.state.data.table_data.columns.map((column, index) => {
                return (
                  <div key={index} className="column-to-edit">
                    <div className="row">
                      <div className="col">
                        <label className="center-label">Column Name: </label>
                        <input
                          name="column_name"
                          type="text"
                          data-key={index}
                          checked={column.column_name}
                          value={column.column_name}
                          onChange={this.handleInputChange}
                        ></input>
                      </div>
                      <div className="col">
                        <label className="center-label">Allows Null</label>
                        <input
                          name="allows_null"
                          type="checkbox"
                          data-key={index}
                          value={column.allows_null}
                          onChange={this.handleInputChange}
                        ></input>
                      </div>
                      <div className="col">
                        <label className="center-label">Data Type</label>
                        <select
                          name="data_type"
                          data-key={index}
                          className="center-block"
                          onChange={this.handleInputChange}
                        >
                          {data_type.map((type, i) => {
                            let updated_type = type.toUpperCase();
                            return (
                              <option key={i} value={updated_type}>
                                {updated_type}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="center-label">Key Constraints</label>
                      <hr
                        className="header-hr"
                        style={{
                          margin: "0 auto",
                          border: "1.5px solid",
                          borderBottom: "none",
                        }}
                      />
                      {column.constraints.unique_key.is_unique_key ? (
                        <label className="center-label constraint-label">
                          Column is a unique key
                          <button
                            name="unique"
                            className="constraint-delete-button"
                            onClick={(e) => this.removeConstraint(e, index)}
                          >
                            Delete
                          </button>
                        </label>
                      ) : null}
                      {column.constraints.primary_key.is_primary_key ? (
                        <label className="center-label constraint-label">
                          Column is a primary key
                          <button
                            name="primary"
                            className="constraint-delete-button"
                            onClick={(e) => this.removeConstraint(e, index)}
                          >
                            Delete
                          </button>
                        </label>
                      ) : null}
                      <br />
                      {column.constraints.foreign_key.is_foreign_key ? (
                        <label className="center-label constraint-label">
                          Column is a Foreign key -{">"} [
                          {column.constraints.foreign_key.reference_table_name}
                          ].
                          {column.constraints.foreign_key.reference_column_name}
                          <button
                            name="foreign"
                            className="constraint-delete-button"
                            onClick={(e) => this.removeConstraint(e, index)}
                          >
                            Delete
                          </button>
                        </label>
                      ) : null}

                      {column.constraints.primary_key.is_primary_key &&
                      column.constraints.foreign_key.is_foreign_key ? null : (
                        <div className="d-flex justify-content-center">
                          <select
                            name="keys"
                            data-key={index}
                            onChange={this.handleInputChange}
                          >
                            <option value="null"></option>
                            {column.constraints.primary_key.is_primary_key ||
                            column.constraints.unique_key
                              .is_unique_key ? null : (
                              <option value="unique">Unique Key</option>
                            )}
                            {column.constraints.primary_key
                              .is_primary_key ? null : (
                              <option value="primary">Primary Key</option>
                            )}
                            {column.constraints.foreign_key
                              .is_foreign_key ? null : (
                              <option value="foreign">Foreign Key</option>
                            )}
                          </select>
                          <button onClick={(e) => this.addConstraint(index)}>
                            Add Constraint
                          </button>
                          <br />
                        </div>
                      )}

                      {column.constraints.foreign_key.is_foreign_key_selected &&
                      (column.constraints.foreign_key.reference_table_name
                        .length === 0 ||
                        column.constraints.foreign_key.reference_column_name
                          .length === 0) ? (
                        <div
                          className="d-flex justify-content-center"
                          style={{ marginTop: "4px", padding: "2px" }}
                        >
                          <label>References -{">"} </label>
                          <label>[Table]: </label>
                          <select>
                            <option>Table 1</option>
                            <option>Table 2</option>
                            <option>Table 3</option>
                          </select>
                          <label>.Column: </label>
                          <select>
                            <option>Column 1</option>
                            <option>Column 2</option>
                            <option>Column 3</option>
                          </select>
                        </div>
                      ) : null}
                    </div>
                    <div
                      className="button delete-button delete-column-button"
                      onClick={() => this.deleteColumn(index)}
                    >
                      Delete Column
                    </div>
                  </div>
                );
              })}
            </div>
            <div
              className="button view-more-button"
              onClick={this.addNewColumn}
              style={{ marginTop: "2px" }}
            >
              Add New Column
            </div>
            <div className="row button-row">
              <button
                className="col"
                type="button"
                style={{ margin: "0 auto" }}
                onClick={
                  this.props.loading
                    ? null
                    : () => {
                        this.props.addTable();
                      }
                }
              >
                {this.props.loading ? (
                  <label style={{ paddingTop: "7px" }}>
                    <span
                      className="spinner-border spinner-border-sm"
                      aria-hidden="true"
                      style={{ margin: "0 5px 3.5px 0px" }}
                    ></span>
                    Loading
                  </label>
                ) : (
                  "Add New Table"
                )}
              </button>
              <button
                className="col"
                type="button"
                style={{ margin: "0 auto" }}
                onClick={() => this.props.openModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }
}

export default AddNewTable;
