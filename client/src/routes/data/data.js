import React from "react";
import "./data.css";
import PopUp from "../../widgets/pop-ups/message-pop-up/pop-ups";
import RowOptions from "../../widgets/pop-ups//row-option/row-option";
import DeletePopUp from "../../widgets/pop-ups/delete-pop-up/delete-pop-up";
import AddNewRow from "./add-new-row";
import HTTPCalls from "../../services/api-connect";
import Global from "../../services/global";

function convertObjectToArray(data) {
  let keys = Object.keys(data[0]);
  let array_data = data.map((a) => {
    let array = [];
    for (let i = 0; i < keys.length; i++) {
      array.push(a[keys[i]]);
    }
    return array;
  });
  let return_value = {
    keys: keys,
    data: array_data,
  };

  return return_value;
}

class Data extends React.Component {
  constructor(props) {
    super(props);
    const urlParams = new URLSearchParams(window.location.search);
    this.db = urlParams.get("db");
    this.table_name = urlParams.get("table");

    if (this.db === null) {
      window.location.replace("/databases");
    } else if (this.table_name === null) {
      window.location.replace(`/table/view?db=${this.db}`);
    }

    this.state = {
      show_row_option: false,
      row_options: [],
      entries: [],
      response: {},
      is_loading: false,
      show_delete_prompt: false,
      is_loading_add_new_row: false,
      should_show_add_row: false,
    };
    this.deleteRow = this.deleteRow.bind(this);
    this.changeDeleteModalState = this.changeDeleteModalState.bind(this);
    this.updatePopUp = this.updatePopUp.bind(this);
    this.shouldShowRowOptions = this.shouldShowRowOptions.bind(this);
    this.updateRowValue = this.updateRowValue.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.updateAddRowValue = this.updateAddRowValue.bind(this);
    this.addRow = this.addRow.bind(this);
    this.shouldShowAddRow = this.shouldShowAddRow.bind(this);
    this.updated_row_values = [];
    this.new_row_values = {};
    this.keys = [];
    this.data = [];
    this.edit_row_number = null;
    this.row_to_delete = null;
  }

  componentDidMount(){
    HTTPCalls(
      "POST",
      "/table/entries",
      {
        user_credential: JSON.parse(sessionStorage.getItem(Global["APP_KEY"])),
        db_name: this.db,
        table_name: this.table_name
      },
      (res) => {
        if (res["status"] === 200) {
          const response = res["response"];
          let data = response.length > 0 ? convertObjectToArray(res["response"]) : [];
          this.keys = response.length > 0 ? data["keys"] : res["row_headers"];
          this.data = response.length > 0 ? data["data"] : [];
          this.setState({ entries: res["response"] });
        } else {
          this.updatePopUp({ type: "error", message: res["response"] });
        }
      }
    );
  }

  shouldShowRowOptions(row, boolean, edit_row_number) {
    if (!boolean) {
      this.updated_row_values = [];
    } else {
      for (let i = 0; i < this.keys.length; i++) {
        this.updated_row_values.push({
          column_name: this.keys[i],
          old_value: "",
          new_value: "",
        });
      }
    }
    this.edit_row_number = edit_row_number;
    if (edit_row_number !== undefined || edit_row_number !== null) {
      this.row_to_delete = this.data[this.edit_row_number];
    }
    this.setState({ row_options: row, show_row_option: boolean });
  }

  updateRowValue(index, oldValue, newValue) {
    this.updated_row_values[index]["old_value"] = oldValue;
    this.updated_row_values[index]["new_value"] = newValue;
  }

  updateAddRowValue(column, value) {
    this.new_row_values[column] = value;
  }

  deleteRow() {
    this.setState({ is_loading: true });
  }

  changeDeleteModalState(state) {
    console.log(this.row_to_delete);
    this.setState({ show_delete_prompt: state });
  }

  saveChanges() {
    this.updated_row_values = this.updated_row_values.map((row) => {
      if (row["old_value"].length === 0 && row["new_value"].length === 0) {
        let index = this.keys.indexOf(row["column_name"]);
        let old_value = this.data[this.edit_row_number][index];
        let value = {
          column_name: row["column_name"],
          old_value: old_value,
          new_value: old_value,
        };
        return value;
      } else {
        return row;
      }
    });
    console.log(this.updated_row_values);
    this.updatePopUp({ type: "error", message: "Error Occured" });
    this.shouldShowRowOptions([], false, null);
  }

  updatePopUp(response) {
    this.setState({ response: response });
  }

  shouldShowAddRow(state) {
    this.new_row_values = {};
    this.setState({ should_show_add_row: state });
  }

  addRow() {
    console.log(this.new_row_values);
    this.setState({ is_loading_add_new_row: true });
  }

  render() {
    return (
      <div id="data-container">
        <RowOptions
          keys={this.keys}
          row_options={this.state.row_options}
          show_row_option={this.state.show_row_option}
          shouldShowRowOptions={this.shouldShowRowOptions}
          updateRowValue={this.updateRowValue}
          saveChanges={this.saveChanges}
          openDeleteModal={this.changeDeleteModalState}
        ></RowOptions>
        <AddNewRow
          show={this.state.should_show_add_row}
          addRow={this.addRow}
          updateAddRowValue={this.updateAddRowValue}
          shouldShowAddRow={this.shouldShowAddRow}
          keys={this.keys}
          loading={this.state.is_loading_add_new_row}
        />
        <DeletePopUp
          show={this.state.show_delete_prompt}
          openModal={this.changeDeleteModalState}
          deleteData={this.deleteRow}
          delete_name="row"
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
          <label className="center-label page-label">
            <span id="db-name-selected">{this.db}</span> Database{" "}
          </label>
          Entries in the <span id="db-name-selected">{this.table_name}</span>{" "}
          Table
        </label>
        <hr className="header-hr" />
        <table>
          <thead>
            <tr>
              {this.keys.map((key, index) => {
                return <th key={index}>{key}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {this.data.map((row, i) => {
              return (
                <tr
                  key={i}
                  onClick={() => {
                    this.shouldShowRowOptions(row, true, i);
                  }}
                >
                  {row.map((row_data, index) => {
                    if (row_data === null) {
                      return <td key={index}>NULL</td>;
                    }else{
                      let modified_row_data = row_data.toString().trim()
                      return <td key={index}>{modified_row_data.length > 0 ? modified_row_data : "Empty String"}</td>;
                    }
                  })}
                </tr>
              );
            })}
            <tr id="last-row-expection">
              <td colSpan={this.keys.length}>
                <div onClick={() => this.shouldShowAddRow(true)}>
                  Add New Row
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default Data;
