import React from "react";
import HTTPCalls from "../../../services/api-connect";
import Global from "../../../services/global";
import Column from "../../../widgets/column/column";

const data_type = ["int", "bit", "text", "float", "varchar"];
const column_representation = {
  name: "",
  allows_null: false,
  type: data_type[0].toUpperCase(),
  size: 1,
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

function simplifyTableAndColumnName(array) {
  array.sort((a, b) => {
    return a["TABLE_NAME"].localeCompare(b["TABLE_NAME"]);
  });

  let data = [];

  if (array.length > 0) {
    let previous = array[0];
    let current = array[0];
    let structure = {
      table_name: "",
      columns: [],
    };

    let new_structure = JSON.parse(JSON.stringify(structure));
    new_structure["table_name"] = current["TABLE_NAME"];
    data.push(new_structure);

    for (let i = 0; i < array.length; i++) {
      current = array[i];
      if (previous["TABLE_NAME"].localeCompare(current["TABLE_NAME"]) === 0) {
        data[data.length - 1]["columns"].push(current["COLUMN_NAME"]);
      } else {
        let new_structure = JSON.parse(JSON.stringify(structure));
        new_structure["table_name"] = current["TABLE_NAME"];
        new_structure["columns"].push(current["COLUMN_NAME"]);
        data.push(new_structure);
      }

      previous = current;
    }
  }

  return data.filter((struct) => {
    return struct["columns"].length !== 0;
  });
}

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
    this.removeConstraint = this.removeConstraint.bind(this);
    this.addConstraint = this.addConstraint.bind(this);
    this.deleteColumn = this.deleteColumn.bind(this);
    this.table_name = "";
    this.foreign_keys = [];
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

      return this.updateColumn(columns);
    });
  }

  componentDidMount() {
    HTTPCalls(
      "POST",
      "/table/metadata",
      {
        user_credential: JSON.parse(sessionStorage.getItem(Global["APP_KEY"])),
        db_name: this.props.db,
      },
      (res) => {
        if (res["status"] === 200) {
          this.foreign_keys = simplifyTableAndColumnName(res["response"]);
        }
      }
    );
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
          constraints["foreign_key"]["reference_table_name"] = constraints["foreign_key"]["is_foreign_key"] ? constraints["foreign_key"]["reference_table_name"]  : "";
          constraints["foreign_key"]["reference_column_name"] = constraints["foreign_key"]["is_foreign_key"] ? constraints["foreign_key"]["reference_column_name"]  : "";
          constraints["unique_key"]["is_unique_key_selected"] = false;
          constraints["primary_key"]["is_primary_key_selected"] = false;
          constraints["foreign_key"]["is_foreign_key_selected"] = false;
        } else if (value === "unique") {
          constraints["foreign_key"]["reference_table_name"] = constraints["foreign_key"]["is_foreign_key"] ? constraints["foreign_key"]["reference_table_name"]  : "";
          constraints["foreign_key"]["reference_column_name"] = constraints["foreign_key"]["is_foreign_key"] ? constraints["foreign_key"]["reference_column_name"]  : "";
          constraints["unique_key"]["is_unique_key_selected"] = true;
          constraints["primary_key"]["is_primary_key_selected"] = false;
          constraints["foreign_key"]["is_foreign_key_selected"] = false;
        } else if (value === "primary") {
          constraints["foreign_key"]["reference_table_name"] = constraints["foreign_key"]["is_foreign_key"] ? constraints["foreign_key"]["reference_table_name"]  : "";
          constraints["foreign_key"]["reference_column_name"] = constraints["foreign_key"]["is_foreign_key"] ? constraints["foreign_key"]["reference_column_name"]  : "";;
          constraints["primary_key"]["is_primary_key_selected"] = true;
          constraints["foreign_key"]["is_foreign_key_selected"] = false;
          constraints["unique_key"]["is_unique_key_selected"] = false;
        } else {
          constraints["foreign_key"]["reference_table_name"] =
            this.foreign_keys.length > 0
              ? this.foreign_keys[0]["table_name"]
              : "";
          constraints["foreign_key"]["reference_column_name"] =
            this.foreign_keys.length > 0
              ? this.foreign_keys[0]["columns"][0]
              : "";
          constraints["foreign_key"]["is_foreign_key_selected"] = true;
          constraints["primary_key"]["is_primary_key_selected"] = false;
          constraints["unique_key"]["is_unique_key_selected"] = false;
        }

        updated_column_data[index]["constraints"] = constraints;
      } else if (key === "reference_table_name") {
        let constraints = Object.assign(
          {},
          updated_column_data[index]["constraints"]
        );

        constraints["foreign_key"][key] = value;
        constraints["foreign_key"][
          "reference_column_name"
        ] = this.foreign_keys.find((foreign_key) => {
          return value === foreign_key["table_name"];
        })["columns"][0];
        updated_column_data[index]["constraints"] = constraints;
      } else if (key === "reference_column_name") {
        let constraints = Object.assign(
          {},
          updated_column_data[index]["constraints"]
        );

        constraints["foreign_key"][key] = value;
        updated_column_data[index]["constraints"] = constraints;
      } else if (key === "size") {
        let size = parseInt(value);
        if (!isNaN(size)) {
          if (size > 255) {
            size = 255;
          } else if (size < 1) {
            size = 1;
          }

          updated_column_data[index][key] = size;
        }
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

  updateTableName(value) {
    this.table_name = value;
  }

  render() {
    if (this.props.show) {
      return (
        <div className="modal-options">
          <div className="modal-options-content column-edit">
            <label className="center-label page-label">Add New Table</label>
            <hr className="header-hr" />
            <label className="center-label">Table Name</label>
            <input
              type="text"
              onChange={(e) => this.updateTableName(e.target.value)}
            ></input>
            <div>
              {this.state.data.table_data.columns.map((column, index) => {
                return (
                  <Column
                    key={index}
                    index={index}
                    column={column}
                    data_type={data_type}
                    deleteColumn={this.deleteColumn}
                    addConstraint={this.addConstraint}
                    removeConstraint={this.removeConstraint}
                    handleInputChange={this.handleInputChange}
                    foreign_keys={this.foreign_keys}
                    reference_table_name={
                      column["constraints"]["foreign_key"][
                        "reference_table_name"
                      ]
                    }
                    reference_column_name={
                      column["constraints"]["foreign_key"][
                        "reference_column_name"
                      ]
                    }
                  />
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
                        this.props.addTable(
                          this.table_name,
                          this.state.data.table_data.columns
                        );
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
