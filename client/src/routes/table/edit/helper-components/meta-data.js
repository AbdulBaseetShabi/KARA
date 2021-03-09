import React from "react";

class MetaData extends React.Component {
  render() {
    return (
      <div className="white-card">
        <label className="center-label page-label">
          Meta Data
          <label
            className="close-open-button"
            onClick={() => {
              this.props.showMetaDataView();
            }}
          >
            {!this.props.open_meta_data_view ? "Open" : "Close"}
          </label>
        </label>
        {this.props.open_meta_data_view ? (
          <div>
            <hr className="header-hr" />
            <div className="metadata">
              <label className="metadata-label">Database Name</label>
              <input type="text"></input>
            </div>
            <div className="metadata">
              <label className="metadata-label">Table Name</label>
              <input type="text"></input>
            </div>
            <div className="metadata">
              <label className="metadata-label">Number of Entries</label>
              <input
                type="text"
                disabled="disabled"
                value={this.props.table_meta_data.no_of_entries}
              ></input>
            </div>
            <div className="metadata">
              <label className="metadata-label">Number of Columns</label>
              <input
                type="text"
                disabled="disabled"
                value={this.props.table_meta_data.no_of_columns}
              ></input>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default MetaData;
