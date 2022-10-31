import React from "react";
import "./TimeDisplay.css";

export default class TimeDisplay extends React.Component<TimerProps> {
  render() {
    const { time } = this.props;
    const seconds = Math.floor(time / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return (
      <span className="time-display">
        <span className="digits">{hours}:</span>
        <span className="digits">{renderTwoDigitsInt(minutes % 60)}:</span>
        <span className="digits">{renderTwoDigitsInt(seconds % 60)}</span>
      </span>
    );
  }
}

interface TimerProps {
  time: number;
}

function renderTwoDigitsInt(value: number) {
  return ("0" + value).slice(-2);
}
