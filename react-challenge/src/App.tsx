import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Circle from './components/Circle/Circle';
import Button from './components/Button/Button';
import Settings from './components/Settings/Settings';

type Item = {
  x: string,
  y: string
}

type State = {
  circles: Item[]
}

function App() {

  const [history, setHistory] = useState<State[]>([]);
  const [currentStateIndex, setCurrentStateIndex] = useState<number>(0);
  var currentState = history[currentStateIndex - 1];
  var canRedo = history[history.length - 1]?.circles.length < history[history.length - 2]?.circles.length;
  var canUndo = currentState?.circles?.length > 0;

  function undo() {
    if (currentState.circles.length == 0) return;
    addState(false);
    setCurrentStateIndex(prev => prev + 1);
  }

  function redo() {
    let historyCopy = history.slice();
    if (historyCopy[historyCopy.length - 1].circles.length > historyCopy[historyCopy.length - 2].circles.length) return;
    setHistory(historyCopy.slice(0, -1));
    setCurrentStateIndex(prev => prev - 1);
  }

  function addState(addCircle: boolean, circle?: Item) {
    let historyCopy = history.slice();
    let copyOfCurrent = { ...historyCopy[currentStateIndex - 1] };
    copyOfCurrent.circles = (copyOfCurrent.circles) ? [...copyOfCurrent.circles] : [];
    if (addCircle) {
      // Add circle
      if (historyCopy.length > 0) {
        copyOfCurrent.circles.push(circle!);
        historyCopy.push(copyOfCurrent);
      }
      else {
        let newState: State = {
          circles: [circle!],
        }
        historyCopy.push(newState);
      }
      setHistory(historyCopy);
    }
    else {
      // remove circle
      copyOfCurrent.circles = copyOfCurrent.circles.slice(0, -1);
      historyCopy.push(copyOfCurrent);
      setHistory(historyCopy);
    }
  }

  function handleClick(event: any): any {
    let circle = {
      x: event.clientX,
      y: event.clientY
    }
    addState(true, circle);
    setCurrentStateIndex(prev => prev + 1);
  }

  return (
    <div className="App" onClick={handleClick}>
      <div className='actions'>
        <div className='buttons'>
          <Button text='Undo' disabled={!canUndo} onClick={undo} active={false} width="100%" height='45px'></Button>
          <Button text='Redo' disabled={!canRedo} onClick={redo} active={false} width="100%" height='45px'></Button>
        </div>
        <Settings></Settings>
      </div>
      {(currentState) ? currentState.circles.map((circle, index) => {
        if (circle) {
          return <Circle key={index} x={Number.parseInt(circle.x)} y={Number.parseInt(circle.y)}></Circle>
        }
      }) : <></>
      }
    </div>
  );
}

export default App;
