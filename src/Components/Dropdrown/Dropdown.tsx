import React from "react";

export default class Dropdown extends React.Component<Props> {
  render() {
    return (
      <select
        className="dropdown"
        onChange={this.props.onChange}
        disabled={this.props.disabled}
        defaultValue={this.props.selected}
      >
        {this.props.options.map(({ value, label }, i) => (
          <option key={i} value={value}>
            {label}
          </option>
        ))}
      </select>
    );
  }
}

interface Props {
  options: Option[];
  selected?: string;
  disabled: boolean;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}

interface Option {
  label: string;
  value: string;
}
