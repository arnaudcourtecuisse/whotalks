import { Component } from "react";
import "./Incrementor.css";

export default class Incrementor extends Component<Props> {
  render() {
    return (
      <div className={`incrementor ${this.props.customClass ?? ""}`}>
        {this.props.label ? <label>{this.props.label}</label> : null}
        <span>
          <span
            className="mdi mdi-minus button"
            onClick={() => {
              this.props.onChange(this.props.value - 1);
            }}
          ></span>
          <input
            type="number"
            min="0"
            step="1"
            value={this.props.value}
            onChange={(event) =>
              this.props.onChange(Number(event.target.value))
            }
          />
          <span
            className="mdi mdi-plus button"
            onClick={() => {
              this.props.onChange(this.props.value + 1);
            }}
          ></span>
        </span>
      </div>
    );
  }
}

interface Props {
  label?: string;
  customClass?: string;
  value: number;
  onChange: (value: number) => void;
}
