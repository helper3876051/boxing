import React, { useState, useEffect } from 'react'
import Home from './Pages/Home/Home'
import './App.css'
import Navbar from './Components/Interface/Navbar/Navbar'
import FightEngine from './Components/FightEngine/FightEngine'
import temp from './Components/Helpers/Data'

function App() {
  const { user, enemy, urls } = temp(); //import new fighters here
  const [ changeAppBgColor, setChangeAppBgColor ] = useState(`rgb(234, 234, 234);`);
  const [ fightNumber, setFightNumber ] = useState(0);
  const [ prevFightNumber, setPrevFightNumber ] = useState(fightNumber)
  const [monthCounter, setMonthCounter] = useState(0);
  const [advanceMonth, setAdvanceMonth] = useState(false);

  /***  User and Opponent to pass down as state  ***/
  const [userState, setUserState ] = useState(user)
  const [oppState, setOppState ] = useState(enemy)

  /*** Match specific state ***/
  const [roundCount, setRoundCount] = useState(0);
  const [fightNight, setFightNight ] = useState(false);  
  const [resetFightBtn, setResetFightBtn] = useState(false);
  const [roundOver, setRoundOver] = useState(false);
  const [fightOver, setFightOver] = useState(false);
  const [fightDataCollection, setFightDataCollection] = useState([])
  const [stopFight, setStopFight] = useState({});
  console.log(stopFight)

  useEffect(() => { !fightNight ? setChangeAppBgColor(`rgb(234, 234, 234);`) : setChangeAppBgColor(`black`)}, [fightNight]);

  useEffect(() => {
    persistInLocalStorage("fightHistory", JSON.stringify(fightDataCollection));
  }, [fightDataCollection])

  /***
  * IMPORTANT: sends callback down to FightEngine, to collect fight data rendered.
  * Persist this array in db to store historical fight data
  ***/

  const updateDataCollections = (input) => {
    setFightDataCollection(prev => [...prev, { matchDetails: input, matchId: fightNumber }])
  }

  const persistInLocalStorage = (key, item) => {
    localStorage.setItem(key, item);
  }


  return (
    <div className="App" style={{ backgroundColor: changeAppBgColor }}>

        <Navbar
          roundCount={roundCount} roundOver={roundOver}
          monthCounter={monthCounter} fightNight={fightNight}/>

        {
          
        !fightNight ?

        <Home user={userState} enemy={oppState} urls={urls}
          monthCounter={monthCounter} setMonthCounter={setMonthCounter}
          advanceMonth={advanceMonth} setAdvanceMonth={setAdvanceMonth}
          stopFight={stopFight} setStopFight={setStopFight}
          roundCount={roundCount} setRoundCount={setRoundCount}
          fightNight={fightNight} setFightNight={setFightNight}
          fightOver={fightOver} setFightOver={setFightOver}
          resetFightBtn={resetFightBtn} setResetFightBtn={setResetFightBtn}
          fightNumber={fightNumber} setFightNumber={setFightNumber} />

        :

        <FightEngine user={userState} enemy={oppState} urls={urls}
          roundCount={roundCount} setRoundCount={setRoundCount}
          roundOver={roundOver} setRoundOver={setRoundOver}
          fightNight={fightNight} setFightNight={setFightNight}
          fightOver={fightOver} setFightOver={setFightOver}
          resetFightBtn={resetFightBtn} setResetFightBtn={setResetFightBtn}
          fightNumber={fightNumber} prevFightNumber={prevFightNumber}
          setPrevFightNumber={setPrevFightNumber}
          stopFight={stopFight} setStopFight={setStopFight}
          updateDataCollections={updateDataCollections}/>

        }   

    </div>
  );
}
export default App;
