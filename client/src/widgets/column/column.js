import React from "react";
import "./column.css";

function Column(props) {
  return (
    <div className="column-to-edit">
      <div className="row">
        <div
          className={
            props.column.type.toUpperCase() === "VARCHAR" ? "col-4" : "col"
          }
        >
          <label className="center-label">Column Name: </label>
          <input
            name="name"
            type="text"
            data-key={props.index}
            checked={props.column.name}
            value={props.column.name}
            onChange={props.handleInputChange}
          ></input>
        </div>
        <div
          className={
            props.column.type.toUpperCase() === "VARCHAR" ? "col-2" : "col"
          }
        >
          <label className="center-label">Null</label>
          <input
            name="allows_null"
            type="checkbox"
            data-key={props.index}
            value={props.column.allows_null}
            onChange={props.handleInputChange}
          ></input>
        </div>
        <div
          className={
            props.column.type.toUpperCase() === "VARCHAR" ? "col-3" : "col"
          }
        >
          <label className="center-label">Data Type</label>
          <select
            name="type"
            data-key={props.index}
            className="center-block"
            onChange={props.handleInputChange}
          >
            {props.data_type.map((type, i) => {
              let updated_type = type.toUpperCase();
              return (
                <option key={i} value={updated_type}>
                  {updated_type}
                </option>
              );
            })}
          </select>
        </div>
        {props.column.type.toUpperCase() === "VARCHAR" ? (
          <div className="col-3">
            <label className="center-label">Size</label>
            <input
              name="size"
              type="number"
              data-key={props.index}
              min="1"
              max="255"
              value={props.column.size}
              onChange={props.handleInputChange}
            ></input>
          </div>
        ) : null}
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
        {props.column.constraints.unique_key.is_unique_key ? (
          <label className="center-label constraint-label">
            Column is a unique key
            <button
              name="unique"
              className="constraint-delete-button"
              onClick={(e) => props.removeConstraint(e, props.index)}
            >
              Delete
            </button>
          </label>
        ) : null}
        {props.column.constraints.primary_key.is_primary_key ? (
          <label className="center-label constraint-label">
            Column is a primary key
            <button
              name="primary"
              className="constraint-delete-button"
              onClick={(e) => props.removeConstraint(e, props.index)}
            >
              Delete
            </button>
          </label>
        ) : null}
        <br />
        {props.column.constraints.foreign_key.is_foreign_key ? (
          <label className="center-label constraint-label">
            Column is a Foreign key -{">"} [
            {props.column.constraints.foreign_key.reference_table_name}
            ].
            {props.column.constraints.foreign_key.reference_column_name}
            <button
              name="foreign"
              className="constraint-delete-button"
              onClick={(e) => props.removeConstraint(e, props.index)}
            >
              Delete
            </button>
          </label>
        ) : null}

        {props.column.constraints.primary_key.is_primary_key &&
        props.column.constraints.foreign_key.is_foreign_key ? null : (
          <div className="d-flex justify-content-center">
            <select
              name="keys"
              data-key={props.index}
              onChange={props.handleInputChange}
            >
              <option value="null"></option>
              {props.column.constraints.primary_key.is_primary_key ||
              props.column.constraints.unique_key.is_unique_key ? null : (
                <option value="unique">Unique Key</option>
              )}
              {props.column.constraints.primary_key.is_primary_key ? null : (
                <option value="primary">Primary Key</option>
              )}
              {props.column.constraints.foreign_key.is_foreign_key ? null : (
                <option value="foreign">Foreign Key</option>
              )}
            </select>
            <button onClick={(e) => props.addConstraint(props.index)}>
              Add Constraint
            </button>
            <br />
          </div>
        )}

        {props.column.constraints.foreign_key.is_foreign_key_selected &&
        (props.column.constraints.foreign_key.reference_table_name.length ===
          0 ||
          props.column.constraints.foreign_key.reference_column_name.length ===
            0) ? (
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
      <div className="row">
        {props.addColumn ? (
          <div
            className="button delete-button delete-column-button col"
            onClick={() => props.deleteColumn(props.index)}
          >
            Add Column
          </div>
        ) : null}
        <div
          className="button delete-button delete-column-button col"
          onClick={() => props.deleteColumn(props.index)}
        >
          {props.addColumn ? "Cancel" : "Delete Column"}
        </div>
      </div>
    </div>
  );
}

export default Column;
