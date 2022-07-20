import React, { useState, useRef, useEffect } from 'react'
import './Display.css'
import SelectMenu from '../SelectMenu/SelectMenu'

const Display = ({
  ko, pbp, user, opp,
  fightStart, fightOver, roundStart, roundOver, roundCount,
  judgeOneOfficialScorecard, judgeTwoOfficialScorecard,
  winner
}) => {

  const [fade, setFade] = useState({backgroundColor:`gray`});
  const [hide, setHide] = useState(`show`);
  const [hideRules, setHideRules] = useState(`show`);
  const [hideRefTalk, setHideRefTalk] = useState(`hideRefTalk`);
  const [disableBtns, setDisableBtns] = useState(false);
  const [hideModal, setHideModal] = useState(`hide`);
  const displayDiv = useRef(null) //auto scroll to bottom
  
  useEffect(() => { if(roundStart)setHideModal('hide') }, [roundStart])

  useEffect(() => fightStart ? setHideRules(`hide`) : setHideRules(`show`), [fightStart]);
  
  useEffect(() => {
    if (!roundOver && !hideModal) {
      setHideModal('hide');
    } else if (roundOver && hideModal){
      setHideModal(`show`);
    }
  },[roundOver]); //toggle pepTalk buttons for each round

  setTimeout(() => {
    setFade({backgroundColor: `white`});
    setHide(`hide`);
    setHideRefTalk(`black`);
  },  6900);

  useEffect(() => {
    setTimeout(() => {
      displayDiv.current.scrollTop = displayDiv.current.scrollHeight;
    }, 1500);
  });

  const fightIntroText = () => {
    return (
      <>
        <div id="walk-ins" className={hide}>
          <h4>The fighters walk into the ring...</h4>
        </div>
        <div className={`ref-talk ${hideRules} ${hideRefTalk}`} style={fade}>
          <h3>Gentlemen, you know the rules.</h3>
          <h3>I want a good, clean fight - are we clear?</h3>
          <h3>You break when I say you break, keep your punches above the belt.</h3>
          <h3>Protect yourself at all times!</h3>
          <h3>We ready? Touch em.</h3>
        </div>
      </>
    )
  }

  const continueText = (getAttacker, scrap) => { //set opening text to black color
    let fontCol;
    let fontSiz = `1rem`;
    if (pbp.length === 1) {
      fontCol = `black`;
      fontSiz = `2rem`;
    } else { 
      fontCol = `white`;
    }
    return (
      <div className={`textbox`} style={{
        backgroundColor: getAttacker.favoriteColor,
        color: fontCol,
        fontSize: fontSiz
      }}>
        {scrap.text}
      </div>
    )
  }

  
  const modal = () => { //popup between rounds
    const pepTalkEntries = Object.entries(user[`pepTalk`])      
    return (
      <>
        <div className={`options ${hideModal}`}>
          <div className={`options-select`}  style={{backgroundColor: user.cornerColor}}>
            <h2>The bell sounds for round {roundCount}.</h2>
            <h4>At your corner, Coach looks you in the eyes with stern advice:</h4>
              <div className={`select-menu`}>
                  {
                    pepTalkEntries.map((entry, i)  => {
                      const pepTalkLabel = entry[1][1];
                      const pepTalkMethod = entry[1][2];
                      return(
                        <>
                          <button key={pepTalkLabel} className={`pep-talk-buttons`} disabled={disableBtns}
                            onClick={ e => {
                              e.preventDefault();
                              pepTalkMethod();
                              setHideModal(`hide`);
                            }}>
                              <h4>{pepTalkLabel}</h4>                             
                            </button>
                        </>   
                    )})
                  }
              </div>
          </div>
        </div>
      </>
    )
  }

  const mapPbp = () => {  //map Play By Play
    return pbp.map((scrap, i) => {
      let getAttacker = {
        ...scrap.attacker,
        cornerColor: scrap.favoriteColor,
      }

    const koedText = //KO result text
      <div className={`options`} style={{color: `black`}}>
        <h4>The fighters both in the pocket trading heavy blows right now!</h4>
        <h4>{scrap.text}</h4>
      </div>

      return (
        <>
          {!ko ? continueText(getAttacker, scrap) : koedText } {/* continue or show KO OR judgesDecision() */}
          {!ko ? modal() : koedText }
        </>
      )
    })
  };

  /*** Display scorecards, update win/loss, route to home page button. ***/
  const postFightModal = () => { 

    const postFightText = () => <h4>A great fight!</h4>
    const judgesDecision = () => {

      // console.log(judgeOneOfficialScorecard, judgeTwoOfficialScorecard)
      return (
        <>
          <div className="scorecards">
            <div className="scorecard" id="judge-one">
              <h4 className="judge-label">Judge One scores it:</h4>
              <h4 className="scores">{judgeOneOfficialScorecard.user} - {judgeOneOfficialScorecard.opp}</h4>
            </div>
            <div className="scorecard" id="judge-two">
              <h4 className="judge-label">Judge Two scores it:</h4>
              <h4 className="scores">{judgeTwoOfficialScorecard.opp} - {judgeTwoOfficialScorecard.user}</h4>
            </div>
            <div className="scorecard" id="judge-three">
              <h4 className="judge-label">Judge Three scores it:</h4>
              <h4 className="scores">{judgeOneOfficialScorecard.user} - {judgeOneOfficialScorecard.opp}</h4>
            </div>
            <div className="scorecard" id="winner">
              <h4>For the winner, by decision...</h4>
              <strong><h3 style={{ color: winner.favoriteColor }}>{winner.firstName} {winner.lastName}</h3></strong>
            </div>
          </div>
        </>
        )
    }

    return (
      <>
        <div className="options">
          {postFightText()}
          {judgesDecision()}
        </div>
      </>
    )
  }

  return (
    <>
    <div ref={displayDiv} className={"Display"}>
      <div className="display-container">
          { roundCount === 0 ? fightIntroText() : null} {/* show ref intro pre-round 1 */}
          { !fightOver ? mapPbp() : postFightModal()}         
      </div>
    </div> 
  </> 
  )
}

export default Display