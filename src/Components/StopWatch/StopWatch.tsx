import React from "react";
import TimeDisplay from "../TimeDisplay/TimeDisplay";
import "./StopWatch.css";

export default class StopWatch extends React.Component<Props> {
  render() {
    return (
      <span className="stop-watch">
        <span
          className="mdi mdi-restore button"
          onClick={this.props.onReset}
        ></span>
        <TimeDisplay time={this.props.time} />
        <span>
          <span
            className={
              "mdi mdi-play button" + (this.props.active ? " hidden" : "")
            }
            onClick={this.props.onResume}
          ></span>
          <span
            className={
              "mdi mdi-pause button" + (this.props.active ? "" : " hidden")
            }
            onClick={this.props.onPause}
          ></span>
        </span>
      </span>
    );
  }
}

interface Props {
  time: number;
  active: boolean;
  onPause: StopWatchEventHandler;
  onReset: StopWatchEventHandler;
  onResume: StopWatchEventHandler;
}

export interface StopWatchEventHandler {
  (): void;
}
