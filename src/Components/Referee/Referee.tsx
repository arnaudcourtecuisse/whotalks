import { Component } from "react";
import shuffle from "../../Services/utils";
import { Config } from "../ConfigPanel/ConfigPanel";
import GroupPanel, { createGroup, Group } from "../GroupPanel/GroupPanel";
import TimeDisplay from "../TimeDisplay/TimeDisplay";
import "./Referee.css";

export default class Referee extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.updateGroupSpeakers.bind(this);
    this.pauseTimer.bind(this);
    this.takeTurn.bind(this);
    this.resetTimer.bind(this);

    this.groupNames = shuffle(groupNames);

    const { groupCount } = this.props.config;

    const groups = this.updateTheoreticalShares(
      this.groupNames.slice(0, groupCount).map(createGroup)
    );

    this.state = {
      lastTimestamp: 0,
      intervalId: null,
      totalTime: 0,
      groups,
    };
  }

  groupNames: string[];

  render() {
    return (
      <div className="session-data-container">
        <div className="session-panel">
          <div>
            {" "}
            Durée de la session: <TimeDisplay time={this.state.totalTime} />
          </div>
          <div>
            <span>Groupes à favoriser: </span>
            {this.state.groups
              .filter((group) => {
                return (
                  group.time / this.state.totalTime / group.theoreticalShare -
                    1 <
                  group.shareMargin
                );
              })
              .map(({ name }) => (
                <span className="favored-group">{name}</span>
              ))}
          </div>
        </div>
        <div className="groups-container">
          {this.state.groups.map((group) => (
            <GroupPanel
              key={group.name}
              group={group}
              onMemberChange={(count) => {
                this.updateGroupSpeakers(group.name, count);
              }}
              onTimePause={() => {
                this.pauseTimer(group.name);
              }}
              onTimeResume={() => {
                this.takeTurn(group.name);
              }}
              onTimeReset={() => {
                this.resetTimer(group.name);
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<State>,
    snapshot?: any
  ): void {
    if (prevProps.config.groupCount !== this.props.config.groupCount) {
      this.updateGroups();
    } else if (prevProps.config.repartition !== this.props.config.repartition) {
      this.setState((state) => ({
        ...state,
        groups: this.updateTheoreticalShares(state.groups),
      }));
    }
  }

  componentWillUnmount(): void {
    if (this.state.intervalId) clearInterval(this.state.intervalId);
  }

  updateGroups() {
    const targetCount = this.props.config.groupCount;
    if (this.state.groups.length === targetCount) {
      return;
    }

    this.setState((state) => {
      if (state.groups.length > targetCount) {
        return {
          ...state,
          groups: state.groups.slice(0, targetCount),
        };
      }
      const newGroups = this.groupNames
        .slice(state.groups.length, targetCount)
        .map(createGroup);
      return {
        ...state,
        groups: state.groups.concat(newGroups),
      };
    });

    this.updateGroupSpeakers();
  }

  updateGroupSpeakers(groupName?: string, count?: number) {
    this.setState((state) => {
      if (typeof groupName === "string" && typeof count === "number") {
        const group = Referee.getGroupByName(state, groupName);
        group.speakers = count;
      }
      return {
        ...state,
        groups: this.updateTheoreticalShares(state.groups),
      };
    });
  }

  pauseTimer(groupName: string) {
    if (this.state.intervalId) {
      console.log("clearing interval", this.state.intervalId);
      clearInterval(this.state.intervalId);
      this.setState({ intervalId: null });
    }

    this.updateTimer(groupName);
    this.setState((state) => {
      const group = Referee.getGroupByName(state, groupName);
      group.active = false;
      return state;
    });
  }

  takeTurn(groupName: string) {
    if (this.state.intervalId) {
      console.log("clear previous interval");
      clearInterval(this.state.intervalId);
    }

    const intervalId = setInterval(() => this.updateTimer(groupName), 100);
    console.log("starting interval", intervalId);

    this.setState((state) => {
      return {
        ...state,
        groups: state.groups.map((group) => ({
          ...group,
          active: group.name === groupName,
          turns: group.name === groupName ? group.turns + 1 : group.turns,
        })),
        intervalId,
        lastTimestamp: Date.now(),
      };
    });
  }

  resetTimer(groupName: string) {
    this.pauseTimer(groupName);
    this.setState((state) => {
      const group = Referee.getGroupByName(state, groupName);
      group.time = 0;
      return state;
    });
  }

  updateTimer(groupName: string) {
    this.setState((state) => {
      const now = Date.now();
      const delta = now - state.lastTimestamp;
      const totalTime = state.totalTime + delta;
      const group = Referee.getGroupByName(state, groupName);
      group.time += delta;
      return {
        ...state,
        groups: state.groups.map((grp) => ({ ...grp, totalTime })),
        lastTimestamp: now,
        totalTime: state.totalTime + delta,
      };
    });
  }

  updateTheoreticalShares(groups: Group[]): Group[] {
    if (this.props.config.repartition === "individual") {
      const total = groups.reduce<number>((t, g) => t + g.speakers, 0);
      return groups.map((grp) => ({
        ...grp,
        theoreticalShare: grp.speakers / total,
        shareMargin: this.props.config.margin / 100,
      }));
    }
    return groups.map((grp) => ({
      ...grp,
      theoreticalShare: 1 / groups.length,
      shareMargin: this.props.config.margin / 100,
    }));
  }
  private static getGroupByName(state: State, name: string): Group {
    return state.groups.find((grp) => grp.name === name) as Group;
  }
}

interface Props {
  config: Config;
}

interface State {
  intervalId: IntervalId | null;
  lastTimestamp: number;
  totalTime: number;
  groups: Group[];
}

type IntervalId = ReturnType<typeof setInterval>;

const groupNames = [
  "Pêche",
  "Cerise",
  "Banane",
  "Abricot",
  "Fraise",
  "Poire",
  "Coco",
];
