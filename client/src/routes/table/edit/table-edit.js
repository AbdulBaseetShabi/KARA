import React from "react";
import Columns from "./helper-components/columns";
import MetaData from "./helper-components/meta-data";
import "./table-edit.css";

const mock_data = [
  {
    column_name: "Name",
    data_type: "VARCHAR",
    default_value: "",
    constraints: "Value != null",
  },
  {
    column_name: "Age",
    data_type: "Integer",
    default_value: "n/a",
    constraints: "Value > 10",
  },
  {
    column_name: "DOB",
    data_type: "Date",
    default_value: "Today Date",
    constraints: "n/a",
  },
  {
    column_name: "Married",
    data_type: "Boolean",
    default_value: "false",
    constraints: "n/a",
  },
  {
    column_name: "Spouse",
    data_type: "VARCHAR",
    default_value: "NULL",
    constraints: "n/a",
  },
];

class TableEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open_meta_data_view: false,
      open_columns_view: false,
      show_columns: [],
    };
    this.showMetaDataView = this.showMetaDataView.bind(this);
    this.showColumnView = this.showColumnView.bind(this);
    this.openColumnInfo = this.openColumnInfo.bind(this);
    this.table_meta_data = {
      no_of_columns: 5,
      no_of_entries: 500,
    };
  }

  showMetaDataView() {
    this.setState((prevState, prevProps) => {
      return { open_meta_data_view: !prevState.open_meta_data_view };
    });
  }

  showColumnView() {
    this.setState((prevState, prevProps) => {
      return { open_columns_view: !prevState.open_columns_view };
    });
  }

  populateShowColumn(n) {
    for (let i = 0; i < n; i++) {
      this.state.show_columns.push(false);
    }
  }

  openColumnInfo(index) {
    this.setState((prevState, prevProps) => {
      let prev_value = this.state.show_columns[index];
      let new_show_column = [];
      for (let i = 0; i < this.state.show_columns.length; i++) {
        new_show_column.push(false);
      }

      new_show_column[index] = !prev_value;
      return { show_columns: new_show_column };
    });
  }

  render() {
    this.populateShowColumn(mock_data.length);
    return (
      <div id="table-edit-container">
        <MetaData
          open_meta_data_view={this.state.open_meta_data_view}
          showMetaDataView={this.showMetaDataView}
          table_meta_data={this.table_meta_data}
        />
        <Columns
          open_columns_view={this.state.open_columns_view}
          data={mock_data}
          show_columns={this.state.show_columns}
          showColumnView={this.showColumnView}
          openColumnInfo={this.openColumnInfo}
        />
        <label>Relatioional Relationship</label>
        <br />
        <label>Table Columns</label> <label>Relationship</label>{" "}
        <label>Table: Column</label> <label>Delete Relationship</label>
      </div>
    );
  }
}

export default TableEdit;
