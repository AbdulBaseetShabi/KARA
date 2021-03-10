import React from "react";

const column_representation = {
  column_name: "",
  allows_null: false,
  data_type: "",
  constraint: "",
};

const data_type = ["int", "boolean", "varchar"];

class AddNewTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        table_data: {
          columns: [{ ...column_representation }],
        },
      },
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.addNewColumn = this.addNewColumn.bind(this);
  }

  addNewColumn() {
    this.setState((prevState, prevProps) => {
      let columns = [...prevState.data.table_data.columns];
      columns.push({ ...column_representation });
      return this.updateColumn(columns);
    });
  }

  deleteColumn(index) {
    this.setState((prevState, prevProps) => {
      let columns = [...prevState.data.table_data.columns];
      columns = columns.filter((item, i) => {
        return i !== index;
      });
      console.log(columns);
      return this.updateColumn(columns);
    });
  }

  handleInputChange(event) {
    this.setState((prevState, prevProps) => {
      let updated_column_data = [...prevState.data.table_data.columns];
      const target = event.target;

      let value = target.type === "checkbox" ? target.checked : target.value;
      let key = target.name;
      let index = target.getAttribute("data-key");

      updated_column_data[index][key] = value;
      console.log(updated_column_data);
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
          <div className="modal-options-content">
            <label className="center-label page-label">Add New Table</label>
            <hr className="header-hr" />
            <div>
              {this.state.data.table_data.columns.map((column, index) => {
                return (
                  <div key={index}>
                    <label>Column Name: </label>
                    <input
                      name="column_name"
                      type="text"
                      data-key={index}
                      checked={column.column_name}
                      value={column.column_name}
                      onChange={this.handleInputChange}
                    ></input>
                    <br />
                    <label>Allows Null: {column.name}</label>
                    <input
                      name="allows_null"
                      type="checkbox"
                      data-key={index}
                      value={column.allows_null}
                      onChange={this.handleInputChange}
                    ></input>
                    <br />
                    <label>Data Type: </label>
                    <select
                      name="data_type"
                      data-key={index}
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
                    <br />
                    <div
                      className="button delete-button"
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
