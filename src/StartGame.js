import React, { useState } from 'react';
import './App.css';
import GameScreen from './PlayGame';
import { createGame } from './apiService';


const InputBoxes = () =>  {
  const [inputText1, setInputText1] = useState('');
  const [inputText2, setInputText2] = useState('');
  const handleInput1Change = (e) => {
    setInputText1(e.target.value);
  };
  const handleInput2Change = (e) => {
    setInputText2(e.target.value);
  };

  const [newGame, setNewGame] = useState(false);
  const handleButtonClick = () => {
      createGame(inputText1 , inputText2).then((response) => {
        setNewGame(response.data)
      })
      .catch(err => console.log(err));
  };

  //can check browser cache if players data/game data exists, then show main or game screen
 
  return (
    <div>
    {
    newGame ? (
      <GameScreen data={newGame}/>
      ):(
    <div>
      <br></br>
        <div>
        <label htmlFor="textBox1" >Player 1    </label>
        <input 
          type="text" 
          value={inputText1} 
          onChange={handleInput1Change} 
        />
        </div>
        <div>
        <br></br>
        <label htmlFor="textBox1">Player 2    </label>
        <input 
          type="text" 
          value={inputText2}
          onChange={handleInput2Change} 
        />
        <br></br>
        </div>
        <br></br>
        <button onClick={handleButtonClick}>Start game!</button>
      {/* </header> */}
    </div>
    )}
    </div>
  );
}

export default InputBoxes;