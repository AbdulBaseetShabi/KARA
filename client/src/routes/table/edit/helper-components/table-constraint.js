import React from "react";
import DeletePopUp from "../../../../widgets/pop-ups/delete-pop-up/delete-pop-up";

class TableConstraints extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show_delete_prompt: false,
      is_loading: false,
    };
    this.changeDeleteModalState = this.changeDeleteModalState.bind(this);
    this.dropConstraint = this.dropConstraint.bind(this);
    this.constraint_to_delete = {};
  }

  changeDeleteModalState(state, constraint_to_delete) {
    this.constraint_to_delete = constraint_to_delete;
    this.setState({ show_delete_prompt: state });
  }

  dropConstraint() {
    console.log(this.constraint_to_delete);
    this.setState({ is_loading: true });
  }

  render() {
    return (
      <div className="white-card">
        <DeletePopUp
          show={this.state.show_delete_prompt}
          openModal={this.changeDeleteModalState}
          deleteData={this.dropConstraint}
          delete_name="constraint"
          loading={this.state.is_loading}
        />
        <label className="center-label page-label">
          Table Constraints
          <label
            className="close-open-button"
            onClick={() => this.props.showConstraintsView()}
          >
            {!this.props.open_constraints_view ? "Open" : "Close"}
          </label>
        </label>
        {this.props.open_constraints_view ? (
          <div>
            <hr className="header-hr" />
            <label className="center-label">
              <span style={{fontWeight: "600"}}>NOTE:</span> Click on relationship to delete
            </label>
            <table>
              <thead>
                <tr>
                  <th>Table Column</th>
                  <th>Constraints</th>
                  <th>[Table].Column</th>
                </tr>
              </thead>
              <tbody>
                {this.props.data.map((data, index) => {
                  return (
                    <tr
                      key={index}
                      onClick={() => {
                        this.changeDeleteModalState(true, data);
                      }}
                    >
                      <td>{data.column_name}</td>
                      <td>{data.constraint_type}</td>
                      <td>
                        {data.relation_column.length !== 0 &&
                        data.relation_table.length !== 0
                          ? "[" +
                            data.relation_table +
                            "]." +
                            data.relation_column
                          : "N/A"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}
        <br />
      </div>
    );
  }
}

export default TableConstraints;
