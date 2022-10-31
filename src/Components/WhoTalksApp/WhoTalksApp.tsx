import React from "react";
import ConfigPanel, { Config } from "../ConfigPanel/ConfigPanel";
import Referee from "../Referee/Referee";
import "./WhoTalksApp.css";

export default class WhoTalksApp extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      config: {
        groupCount: 2,
        repartition: "individual",
        margin: 20,
      },
    };
  }
  render() {
    return (
      <div className="who-talks">
        <ConfigPanel
          config={this.state.config}
          onConfigChange={this.updateConfig.bind(this)}
        />
        <Referee config={this.state.config} />
      </div>
    );
  }
  updateConfig(config: Config) {
    console.log("updated config:", config);
    this.setState((state) => ({ ...state, config }));
  }
}

interface Props {}
interface State {
  config: Config;
}
