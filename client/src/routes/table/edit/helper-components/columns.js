import React from "react";
import Column from "../../../../widgets/column/column";

const data_type = ["int", "boolean", "varchar"];
const column_structure = {
  column_name: "",
  allows_null: false,
  data_type: data_type[0].toUpperCase(),
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

class Columns extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      new_column: Object.assign({}, column_structure),
      show_add_new_column: false,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.removeConstraint = this.removeConstraint.bind(this);
    this.addConstraint = this.addConstraint.bind(this);
    this.addColumn = this.addColumn.bind(this);
    this.removeAddNewColumn = this.removeAddNewColumn.bind(this);
  }

  addConstraint(index) {
    this.setState((prevState, prevProps) => {
      let updated_column_data = Object.assign({}, prevState.new_column);
      let constraints = Object.assign({}, updated_column_data["constraints"]);

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
      updated_column_data["constraints"] = constraints;
      return {
        new_column: updated_column_data,
      };
    });
  }

  removeConstraint(event, index) {
    this.setState((prevState, prevProps) => {
      let updated_column_data = Object.assign({}, prevState.new_column);
      let constraints = Object.assign({}, updated_column_data["constraints"]);
      let name = event.target.name;

      if (name === "unique") {
        constraints["unique_key"]["is_unique_key"] = false;
      } else if (name === "primary") {
        constraints["primary_key"]["is_primary_key"] = false;
      } else {
        constraints["foreign_key"]["is_foreign_key"] = false;
      }

      updated_column_data["constraints"] = constraints;
      return {
        new_column: updated_column_data,
      };
    });
  }

  handleInputChange(event) {
    this.setState((prevState, prevProps) => {
      let updated_column_data = Object.assign({}, prevState.new_column);

      const target = event.target;
      let value = target.type === "checkbox" ? target.checked : target.value;
      let key = target.name;

      if (key === "keys") {
        let constraints = Object.assign({}, updated_column_data["constraints"]);
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
        updated_column_data["constraints"] = constraints;
      } else {
        updated_column_data[key] = value;
      }
      console.log(updated_column_data);
      return {
        new_column: updated_column_data,
      };
    });
  }

  showAddNewColumn(state) {
    this.setState({
      show_add_new_column: state,
      new_column: Object.assign({}, column_structure),
    });
  }

  addColumn() {
    console.log("Add New Column");
    console.log(this.state.new_column);
    this.showAddNewColumn(false);
  }

  removeAddNewColumn() {
    this.showAddNewColumn(false);
  }

  render() {
    return (
      <div className="white-card">
        <label className="center-label page-label">
          Columns
          <label
            className="close-open-button"
            onClick={() => this.props.showColumnView()}
          >
            {!this.props.open_columns_view ? "Open" : "Close"}
          </label>
          {this.props.open_columns_view ? (
            <div>
              <hr className="header-hr" />
              <div
                className="button view-more-button"
                onClick={() => this.showAddNewColumn(true)}
              >
                Add New Column
              </div>
              {this.state.show_add_new_column ? (
                <Column
                  key="-1"
                  index="-1"
                  column={this.state.new_column}
                  data_type={data_type}
                  addColumn={this.addColumn}
                  deleteColumn={this.removeAddNewColumn}
                  addConstraint={this.addConstraint}
                  removeConstraint={this.removeConstraint}
                  handleInputChange={this.handleInputChange}
                />
              ) : null}

              {this.props.data.map((data, index) => {
                return (
                  <div key={index}>
                    <hr />
                    <label>
                      Column Name: {data.column_name}
                      <label
                        className="close-open-button"
                        onClick={() => {
                          this.props.openColumnInfo(index);
                        }}
                      >
                        {!this.props.show_columns[index] ? "Open" : "Close"}
                      </label>
                    </label>
                    {this.props.show_columns[index] ? (
                      <div>
                        <hr className="header-hr" />
                        <label>Data Type: {data.data_type}</label>
                        <br />
                        <label>
                          Allows Null:{" "}
                          {data.allows_null.toString().toUpperCase()}
                        </label>
                      </div>
                    ) : null}
                    <hr />
                  </div>
                );
              })}
            </div>
          ) : null}
        </label>
      </div>
    );
  }
}

export default Columns;
