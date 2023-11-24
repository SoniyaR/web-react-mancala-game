import React, { useState } from "react";
import "./App.css";
import { makeMoveApi, getPlayersForGameApi, createGame } from "./apiService";

const ShowPitsData = ({pitsData}) => {

  const [apiPitsData, setPitsData] = useState(pitsData);
  const [playersData, setPlayersData] = useState(null);
  const [winnerName, setWinner] = useState(null);
  const [err, setError] = useState(null);
  const [isGameOver, setIfGameOver] = useState(false);

  if (playersData === null) {
    getPlayersForGameApi(apiPitsData[0].gameId).then((response) => {
        setPlayersData(response.data)
        console.log(" getPlayersForGameApi " + JSON.stringify(response))
        if(!response.ok) {
          setError(response.message)
        }else{
          setError(null)
        }
      }).catch((err) => {
        console.error("error found " + err);
        setError(err.message);
      })
  }

      let playerIdsList = apiPitsData.map(pit => pit.playerId);
      playerIdsList = playerIdsList.filter((pit,idx) => playerIdsList.indexOf(pit)===idx);

      // const uniquePlayerSet = new Set();
      // const uniquePlayerList = apiPitsData.filter(pit => {
      //   const playerdata = {name:pit.playerName, id:pit.playerId};
      //   const isUnique = !uniquePlayerSet.has(playerdata);
      //   if (isUnique) {
      //     uniquePlayerSet.add(playerdata)
      //   }
      //   return isUnique;
      // });
      // console.log("Unique players " + JSON.stringify(uniquePlayerSet));
      
      const onPitClick = (pitClickDto) => {
          makeMoveApi(pitClickDto.id, pitClickDto.playerId).then((response) => {
            //update the UI
            const pitClickData = response.data;
            setPitsData(pitClickData.pitsData);
            setIfGameOver(pitClickData.gameOver);
            setWinner(pitClickData.winnerName)

            // if (!response.ok) {
            //   console.log("Error:" + JSON.stringify(response))
            // }else{
            //   setError(null)
            // }
          }).catch((error) => {
            alert(error.response.data)
            console.error("Error on Player move: " + JSON.stringify(error.response));
            setError(err);
          })
      }

      const Bucket = ({pit}) => {
        const pebbles = pit.pebblesCount;
        let bucketType = "bucket";
        const pitClickDto = {
          id: pit.id,
          sequence: pit.sequence,
          playerId: pit.playerId,
        }
        if (pit.store === true) {
          bucketType = "largeBucket";
        }

        if (pebbles !== 0) {
            const items = [];
            for (let i = 0; i < pebbles; i++) {
              items.push(<div key={i} className="stone">
                </div>);
            }
            return (
              <div className={bucketType} onClick={!isGameOver? () => onPitClick(pitClickDto):null}> 
                {items}
              </div>
            )
        }else {
            return (
              <div className={bucketType} onClick={!isGameOver? () => onPitClick(pitClickDto):null}>
              </div>
            )
          }
      };

      const Arrow = (indexArrow) => {
        if (indexArrow.indexArrow % 2 === 0) {
        return (
          <div className="arrow-right"></div>
        )
        }else {
          return (
            <div className="arrow-left"></div>
          )
        }
      }

      const [newGame, setNewGame] = useState(false);
      const handleClickForNewGame = ()=> {
        console.log("handled new game " + JSON.stringify(playersData))
          createGame(playersData[0].name , playersData[1].name).then((response) => {
            setPitsData(response.data.pitsData)
          setIfGameOver(false)
          })
          .catch(err => console.log(err));
      };

return (
    <div  className='board-space'>
    {
      playerIdsList.map((pId, index) => 
      {
      let playerBoardLayout = "player-pits";
      if (pId % 2 === 0) { playerBoardLayout = "player-pits-reverse"}
      console.log("players " + JSON.stringify(playersData))
      return (
      <div className={playerBoardLayout}>
      <h3> {playersData?playersData[index].name:""} </h3>
      {/* Player {(index+1)} */}
      <Arrow indexArrow={index}/>
        <br></br>
          {apiPitsData.filter(p => p.playerId === pId)
          .map((pit, index) => (
          <div className="player-pits">
              <Bucket key={pit.id} pit={pit} />
          </div>
        ))}
        </div>)})
    }
    
    {err && (
          <div style={{ color: 'red', marginTop: '10px' }}>
            <p>Error: {err}</p>
          </div>
        )}

  <br></br>
    {isGameOver && (
      <div>
      <h3>Winner is {winnerName}</h3>
      <button onClick={handleClickForNewGame}>Click to play again!</button>
      </div>
    )}
    </div>)
}

const PlayersAPIData = (gameId) => {
  const [playersData, setPlayersData] = useState(null);

  getPlayersForGameApi(gameId.gameId).then((response) => {
      setPlayersData(response)
      console.log(JSON.stringify(response))
      if(!response.ok) {
        console.error("error found " + response);
      }else {
        console.log("Players data " + JSON.stringify(playersData))
      }
    }).catch((err) => {
      console.error("error found " + err);
    })
    return (
      <div>
        <p> {playersData[0]} vs {playersData[1]}</p>
      </div>
    );
}

 const GameScreen = (props) => {
    const data = props.data;

    return (
      <div>
        {/* <div>
          <PlayersAPIData gameId = {data.pitsData[0].gameId} />
          </div> */}
          <div>
            <ShowPitsData pitsData={data.pitsData}/>
        </div>
        </div>
    );
}

export default GameScreen;