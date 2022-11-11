import { BuildingProps } from './models/BuildingProps';
import Game from './pages/Game';
import map from './assets/map.json';
type Item = {
  x: string,
  y: string
}

type State = {
  circles: Item[],
  buildings: BuildingProps[]
}
function App() {


  return (
    <Game map={map}></Game>
  )
}

export default App;
