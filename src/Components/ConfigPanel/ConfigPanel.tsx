import { ChangeEvent, Component } from "react";
import Dropdown from "../Dropdrown/Dropdown";
import Incrementor from "../Incrementor/Incrementor";
import "./ConfigPanel.css";

export default class ConfigPanel extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      locked: false,
    };
  }
  render() {
    return (
      <fieldset className="config-panel">
        <legend>Configuration de la session</legend>
        <div className="config-form">
          <Incrementor
            label="Nombre de groupes:"
            value={this.props.config.groupCount}
            onChange={this.updateGroupCount.bind(this)}
          />
          <div className="config-entry">
            <label>Répartition égale:</label>
            <Dropdown
              options={[
                { value: "individual", label: "Par individu" },
                { value: "group", label: "Par groupe" },
              ]}
              onChange={this.updateRepartition.bind(this)}
              disabled={this.state.locked}
              selected={this.props.config.repartition}
            />
          </div>
          <div className="config-entry">
            <label>Marge de tolérance:</label>
            <input
              type="number"
              min="0"
              step="1"
              value={this.props.config.margin}
              onChange={this.updateMargin.bind(this)}
              disabled={this.state.locked}
            />
          </div>
        </div>

        <button onClick={this.toggleLock.bind(this)}>
          {this.state.locked
            ? "Modifier la configuration"
            : "Démarrer la session"}
        </button>
      </fieldset>
    );
  }
  toggleLock() {
    this.setState((state) => ({
      ...state,
      locked: !state.locked,
    }));
  }

  updateGroupCount(value: number) {
    this.updateConfig("groupCount", value);
  }

  updateRepartition(event: ChangeEvent<HTMLSelectElement>) {
    this.updateConfig("repartition", event.target.value);
  }

  updateMargin(event: ChangeEvent<HTMLInputElement>) {
    this.updateConfig("margin", Number(event.target.value));
  }

  updateConfig<K extends keyof Config, V>(key: K, value: V) {
    const config: Config = {
      ...this.props.config,
      [key]: value,
    };
    this.props.onConfigChange(config);
  }
}

interface Props {
  onConfigChange: (config: Config) => void;
  config: Config;
}

interface State {
  locked: boolean;
}

export interface Config {
  repartition: "individual" | "group";
  margin: number;
  groupCount: number;
}
