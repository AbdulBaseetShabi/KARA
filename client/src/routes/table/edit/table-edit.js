import React from "react";
import Columns from "./helper-components/columns";
import MetaData from "./helper-components/meta-data";
import TableConstraint from "./helper-components/table-constraint";
import "./table-edit.css";

const mock_data = [
  {
    column_name: "Name",
    data_type: "VARCHAR",
    allows_null: false,
  },
  {
    column_name: "Age",
    data_type: "Integer",
    allows_null: false,
  },
  {
    column_name: "DOB",
    data_type: "Date",
    allows_null: false,
  },
  {
    column_name: "Married",
    data_type: "Boolean",
    allows_null: false,
  },
  {
    column_name: "Spouse",
    data_type: "VARCHAR",
    allows_null: true,
  },
];

const mock_data_2 = [
  {
    column_name: "Married",
    constraint_type: "FOREIGN KEY",
    relation_column: "Studio",
    relation_table: "Dance",
  },
  {
    column_name: "ID",
    constraint_type: "PRIMARY KEY",
    relation_column: "",
    relation_table: "",
  },
];

class TableEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open_meta_data_view: false,
      open_columns_view: false,
      open_constraints_view: false,
      show_columns: [],
    };
    this.showMetaDataView = this.showMetaDataView.bind(this);
    this.showColumnView = this.showColumnView.bind(this);
    this.openColumnInfo = this.openColumnInfo.bind(this);
    this.showConstraintsView = this.showConstraintsView.bind(this);
    this.table_meta_data = {
      no_of_columns: 5,
      no_of_entries: 500,
      table_name: 'Testing', 
      db_name: 'Track',
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

  showConstraintsView() {
    this.setState((prevState, prevProps) => {
      return { open_constraints_view: !prevState.open_constraints_view };
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
        <TableConstraint
          data={mock_data_2}
          open_constraints_view={this.state.open_constraints_view}
          showConstraintsView={this.showConstraintsView}
        />
      </div>
    );
  }
}

export default TableEdit;
