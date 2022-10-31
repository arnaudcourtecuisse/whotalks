import { Component } from "react";

export default class Percentage extends Component<Props> {
  render() {
    const pct = (100 * this.props.value).toFixed(this.props.digits ?? 0);
    return <span>{pct} %</span>;
  }
}

interface Props {
  value: number;
  digits?: number;
}
