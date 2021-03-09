import React from "react";

class Columns extends React.Component {
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
              <div className="button view-more-button">Add New Column</div>
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
                        <label>Default Value: {data.default_value}</label>
                        <br />
                        <label>Constraint: {data.constraints}</label>
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