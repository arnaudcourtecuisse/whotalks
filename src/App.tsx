import "./App.css";
import WhoTalksApp from "./Components/WhoTalksApp/WhoTalksApp";
import "./fonts/DSEG7Classic-Regular.ttf";
import person from "./person.svg";
import shuffle from "./Services/utils";
export default function App() {
  const colors = shuffle(inclusiveColors);
  return (
    <div className="app">
      <header className="app-header">
        {colors.map((c, i) => (
          <img
            key={i}
            src={person}
            className={`inclusive-${c}`}
            alt="Personne inclusive"
          />
        ))}
      </header>
      <WhoTalksApp />
    </div>
  );
}

const inclusiveColors = [
  "white",
  "pink",
  "lightblue",
  "brown",
  "black",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
];
