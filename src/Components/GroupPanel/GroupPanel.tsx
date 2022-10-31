import React from "react";
import Incrementor from "../Incrementor/Incrementor";
import StopWatch, { StopWatchEventHandler } from "../StopWatch/StopWatch";
import TimeDisplay from "../TimeDisplay/TimeDisplay";
import "./GroupPanel.css";
import Percentage from "./Percentage";

enum GroupStatus {
  Under,
  SlighlyOver,
  Over,
}

export default class GroupPanel extends React.Component<Props> {
  render() {
    const actualShare =
      this.props.group.totalTime === 0
        ? 0
        : this.props.group.time / this.props.group.totalTime;
    console.log(this.props.group);
    const theme = statusColors[this.getStatus(actualShare)];
    return (
      <div
        className="group-panel"
        style={{ background: theme.background, color: theme.font }}
      >
        <h2 className="group-name">{this.props.group.name}</h2>
        <div>
          <Incrementor
            label="Participants:"
            value={this.props.group.speakers}
            onChange={this.props.onMemberChange.bind(this)}
          />
        </div>
        <StopWatch
          time={this.props.group.time}
          active={this.props.group.active}
          onPause={this.props.onTimePause}
          onResume={this.props.onTimeResume}
          onReset={this.props.onTimeReset}
        />
        <span className="theoretical-time">
          {"("}
          <TimeDisplay
            time={
              this.props.group.theoreticalShare * this.props.group.totalTime
            }
          />
          {")"}
        </span>
        <div className="stats-panel">
          <h3>Statistiques</h3>
          <div className="stat-entry">
            <span>Taux de parole:</span>
            <Percentage value={actualShare} />
            (théorique: <Percentage value={this.props.group.theoreticalShare} />
            )
          </div>
          <div className="stat-entry">
            <span>Taux de représentation:</span>
            <Percentage
              value={actualShare / this.props.group.theoreticalShare}
            />
            (théorique: <Percentage value={1} />)
          </div>
          <div className="stat-entry">
            <span>Prises de parole:</span>
            <span>{this.props.group.turns}</span>
          </div>
        </div>
      </div>
    );
  }

  getStatus(actualShare: number) {
    const representation = actualShare / this.props.group.theoreticalShare;
    if (representation < 1) {
      return GroupStatus.Under;
    }
    return representation <= 1 + this.props.group.shareMargin
      ? GroupStatus.SlighlyOver
      : GroupStatus.Over;
  }
}

export interface Group {
  name: string;
  speakers: number;
  time: number;
  totalTime: number;
  turns: number;
  theoreticalShare: number;
  shareMargin: number;
  active: boolean;
}

export function createGroup(name: string): Group {
  return {
    name,
    speakers: 1,
    time: 0,
    totalTime: 0,
    turns: 0,
    theoreticalShare: 0,
    shareMargin: 0,
    active: false,
  };
}

interface Props {
  key: string;
  group: Group;
  onMemberChange: MemberChangeHandler;
  onTimePause: StopWatchEventHandler;
  onTimeResume: StopWatchEventHandler;
  onTimeReset: StopWatchEventHandler;
}

interface MemberChangeHandler {
  (count: number): void;
}

const statusColors: Record<GroupStatus, Theme> = {
  [GroupStatus.Under]: { font: "white", background: "#282C34" },
  [GroupStatus.SlighlyOver]: { font: "white", background: "#5D2020" },
  [GroupStatus.Over]: { font: "white", background: "#92140C" },
};

interface Theme {
  font: "white" | "black";
  background: string;
}
