import { v4 as uuidv4 } from 'uuid';
import randomizer from '../Helpers/Randomize.js'
class Boxer {

  constructor(
    firstName, nickname, lastName,
    hometown, weightClass, favoriteColor,
    sta, agr, agi, str, def, hrt
  ){
    this.firstName = firstName; this.nickname = nickname; this.lastName = lastName;
    this.hometown = hometown; this.weightClass = weightClass; this.favoriteColor = favoriteColor;
    
    this.sta = sta; this.agr = agr; this.agi = agi; this.str = str; this.def = def;
    this.pow = (this.str*0.7)+(this.agi*0.3)

    //eventually determine by survey at create page
    this.heart = hrt
    this.chin = ((this.sta*0.4)+(this.str*0.3)+(this.heart*0.3))

    //eventually split into head and body, max is static, non-max decrements in battle
    this.maxCon = ((this.sta*0.8)+(this.heart*0.2))/100
    this.con = this.maxCon

    this.maxHp = (this.sta + this.chin + this.heart + this.maxCon + this.str)*12;
    this.hp = this.maxHp*this.con;
    this.win = 0;
    this.loss = 0;
    this.rank = 31;
    this.champion = false;
    this.id = uuidv4();
    this.knockdownCount = 0;
    this.roundsFought = 0;
  }

  /***
  FIGHT WORKFLOW
  ***/

  isChamp = (trueOrFalse) => {
    this.champion = trueOrFalse;
    if (true) {
      this.rank = 1;
    }
  }

  //determines who attacks first
  engage = () =>{
    let initiative = ((this.agr*0.6)+(this.heart*0.2)+(this.sta*0.2)*this.con)
    let minInitiative = 1
    this.energyLoss()
    return randomizer(minInitiative, initiative)
  }

  //determines the damage output
  attack = (combos) => {
    this.lowEnergyWarning();
    let handSpd = combos/10;
    let min = (this.pow*this.con)*handSpd/100;
    let max = (this.pow)
    let rand = randomizer(min, max);
    this.energyLoss();
    return rand;
  }

  //determines the ability to reduce damage input by matching attackers punches (and evading them)
  defend = (combo) => {
    // let counterSpd = combo/10;
    let defense = ((this.def*0.8)+(this.chin*0.2))
    let minDef = defense*this.con
    let defRand = randomizer(minDef, defense)
    this.energyLoss();
    return defRand
  }

  energyLoss = () => this.con -= (this.con/100)

  roundRecovery = () => {
    let rest = this.train.rest();
    return rest;
  }

  handSpeed = () => {
    let max = this.agi;
    return randomizer(1, max)
  }

  ko = () => { //if ko > defender.chin
    let randKO = randomizer(1, this.pow);
    this.energyLoss();
    return randKO;
  }

  getUp = () => { //if getUp > boxerHealth%
    this.energyLoss();
    let willToGetUp = (this.chin+this.heart)*this.con;
    return randomizer(this.chin, willToGetUp);
  }

  //increase attributes between rounds, with 1 or 2 negative effects
  pepTalk = {

    getInThere: {
      1: "There's no reason to be afraid. Put em away!",
      2: () => this.train.speedBag()
    },
    relax: {
      1: "Hey...relax mate. Be patient. Do your thing.",
      2: () => {
        this.agi *= 0.96;
        this.pow *= 1.07;
        this.con *= 1.09;
        this.def *= 1.09;
      }
    },
    youGottaGo: {
      1: "HEY. LISTEN. YOU GOTTA GO. YOU'RE BEHIND. GET AHEAD. NOW.",
      2: () => {
        this.pow *= 1.1;
        this.agr *= 1.05;
        this.heart *= 1.05;
        this.agi *= 1.05;
        this.con *= this.con;
        this.def *= 0.80;
      }
    }
  }
  
  lowEnergyWarning = () => {
    if (this.con <= this.maxCon*0.3) {
      console.log("energy low!")
    }
  }

  lifeLeft = () => this.hp/this.maxHp

  record = {
    //update wins/loss in endFight function
    updateLoss: () => this.loss += 1,
    updateWin: () => this.win += 1 
  }

  /***
  GYM METHODS
  ***/

  //increase attributes during fight week
  train = {
    roadWork: () => {
      this.sta *= 1.03;
      this.maxCon += (this.con/100);
      this.energyLoss();
    },

    speedBag: () => {
      this.agr += 1.03;
      this.agi *= 1.03;
      this.energyLoss();
      console.log(this.agr, this.agi, this.con)
    },

    jumpRope: () => {
      this.sta *= 1.03;
      this.agi *= 1.03;
      this.energyLoss();
    },

    pads: () => {
      this.str *= 1.03;
      this.def *= 1.03;
      this.energyLoss();
    },

    rest: () => {
      if (!this.hp < this.maxHp) {
        this.hp *= 1.09;
      } else if (this.hp > this.maxHp) {
        this.hp = this.maxHp;
      }
      this.con *= 1.09;
    }
  }
}

export default Boxer