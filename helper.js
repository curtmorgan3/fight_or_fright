console.log('helper wired');

let player = new Object();
let monsters = [];
let orderOfAttack = [];
let floorCount = 0;

function gameStart(){

}

function populateFloor(){
  let num = randNum(3) + player.level;
  for (i=0; i<num; i++){
    generateMonster();
  }
  determineOrder();
  // populateInventory();
  // populateStats();
  beginTurn();
}

function determineOrder(){
  let roll = randNum(19);
  let order = [];
  order.push(player);
  for (i = 0; i<monsters.length; i++){
    order.push(monsters[i]);
  }
  order.sort(function(a,b) {return (a.init + roll) - (b.init + roll)});
  orderOfAttack = order.reverse();
  console.log(orderOfAttack);
}

function endFloor(){
  player.hp = player.maxHP;
  checkXP();
  floorCount += 1;
  populateFloor();
}

// checkXP();
// populateInventory();
// populateStats();
// playerTurn(){
//   //attack, escape, or potion
// }
function beginTurn(){
  for (i = 0; i<orderOfAttack.length; i++){
    let mon = orderOfAttack[i];
    if (mon === player){
      //playerTurn();
      attack(player, mon);
      console.log("player's turn");
    }else{
      let id = mon.id;
      console.log(`${id.spook} attacked. `);
      attack(mon, player);
    }
  }
  beginTurn();
};










//**************** Helpers Below **************************
function randNum(n){
  return Math.floor(Math.random() * Math.floor(n) + 1);
}

function setAtt(){
  let sum = 0;
  for(i = 0; i<3; i++){
    sum += randNum(19);
  }
  return Math.floor( sum / 3 );
}

function getMod(char){ //pass in character.attribute, which is a number value
  let mod = -5;
  for (i = 1; i<char; i+= 2){
    mod += 1;
  }
  return mod;
}

function generateCharacter(costume){
  //create a player object, add attributes
  let name = 'Curt'
  // TODO: Capture player name global
  player.name = `${name}`;
  player.level = 1;
  player.xp = 0;
  player.str = setAtt();
  player.dex = setAtt();
  player.speed = setAtt();
  player.fort = setAtt();
  player.luck = setAtt();
  player.maxHP = setAtt() + getMod(player.fort) + 10;
  player.ac = getMod(player.speed) + 10;
  player.costume = costume;
  player.weapon = 5;
  player.hp = player.maxHP;
  player.inventory = [];
  player.init = 0 + getMod(player.speed);


  switch(costume){
    case 'knight':
      player.str += 4;
    break;
    case 'rogue':
      player.speed += 4;
    break;
    case 'ninja':
      player.dex += 4;
    break;
    case 'priest':
      player.fort += 4;
    break;
    case 'gambler':
      player.luck += 4;
    break;

  };
  return player;
}

function generateMonster(specific){ //pass in type for specific, leave blank for random
  let monster = {};
  let ranType = ['skeleton','ghost','vampire','zombie','werewolf']
  let type;
  function getType(){
    for(i = 0; i < ranType.length; i++){
      type = ranType[randNum(ranType.length)];
    }
  }
  if(specific){
    type = specific;
  }else{
    getType();
  }
  monster.level = 1;
  monster.id = randNum(100000);
  // TODO: Random level +- 3 of player.level
  monster.hp = setAtt() + 10;
  monster.str = setAtt();
  monster.dex = setAtt();
  monster.speed = setAtt();
  monster.fort = setAtt();
  monster.ac = getMod(monster.speed) + 10;
  monster.weapon = 5;
  monster.spook = type;
  monster.init = 0 + getMod(monster.speed);

  switch(type){
    case 'skeleton':
      console.log('Base Monster');
    break;
    case 'werewolf':
      monster.dex += 3;
      console.log('+3 Dexterity');
    break;
    case 'vampire':
      monster.fort += 3;
      console.log('+3 Fortitude');
    break;
    case 'zombie':
      monster.str += 3;
      console.log('+3 Strength');
    break;
    case 'ghost':
      monster.speed += 3;
      console.log('+3 Speed');
    break;
  };
  monsters.push(monster);
}

function attack(off, deff){
  let attack = randNum(20) + getMod(off.dex);
  if (attack >= deff.ac){
    calcDam(off, deff);
  }else{
    return 'miss';
  }
}

function calcDam(off, deff){
  let damage = randNum(off.weapon) + off.str;
  deff.hp -= damage;
  console.log(`${damage} Damage!`);
  console.log(`Defender HP: ${deff.hp}`);
  isAlive(deff);
}

function generateWeapon(type){ //pass type or leave blank for random based on player's luck
  let weapon;
  let num;
  if(type){
    num = type;
  }else {
    num = randNum(100) + getMod(player.luck);
  }

  switch(true){
    //1-50
    case (num <= 50):
    case (num ==='poor'):
      weapon =  6;
    break;
    //51-70
    case (num > 50 && num <= 70):
    case (num ==='decent'):
      weapon =  8;
    break;
    //71-85
    case (num > 70 && num <= 85):
    case (num ==='good'):
      weapon =  12;
    break;
    //86-95
    case (num > 85 && num <= 95):
    case (num === 'great'):
      weapon =  16;
    break;
    //96-100
    case (num > 95 && num <= 100):
    case (num ==='awesome'):
      weapon =  20;
    break;
  }
  return weapon;
}

function generatePotion(){
  let inven = player.inventory;
  let potionCount = 0;
  for(i = 0; i<inven.length; i++){
    if(inven[i] === 'healthPotion'){
      potionCount += 1;
    }
  }
  if (potionCount < 3){
    inven.push('healthPotion');
  }else{
    console.log('You already have three potions!');
  }

  console.log(inven);
};

function levelUp(att){ //pass the skill point the user selects
  let costume = player.costume;
  console.log(costume);
  switch(att){
    case 'str':
      if(costume === 'knight'){
        player.str+=2;
      }else{
        player.str += 1;
    }
    break;
    case 'dex':
      if(costume === 'rogue'){
        player.dex += 2;
      }else{
        player.dex += 1;
      };
    break;
    case 'speed':
      if(costume === 'ninja'){
        player.speed += 2;
      }else{
        player.speed += 1;
      };
    break;
    case 'fort':
      if(costume === 'priest'){
        player.fort += 2;
      }else {
        player.fort += 1;
      };
    break;
    case 'luck':
      if(costume === 'gambler'){
        player.luck += 2;
      }else{
        player.luck += 1;
      };
    break;
  };

  player.maxHP += randNum(6) + getMod(player.fort);
  player.ac = getMod(player.speed) + 10;
  player.level += 1;

}

function isKilled(char){
  let xp = (char.level * randNum(800) + (randNum(100) * getMod(player.luck)) );
  player.xp += xp;
  let id = char.id;

  for (i = 0; i<monsters.length; i++){
    if(monsters[i].id === id){
      console.log(`${monsters[i].spook} slain!`);
      monsters.splice(i,1);
    }
  }

  dropLoot();
} //calc xp and give to player

function dropLoot(){ // 75% chance of dropping weapon, 25% drop potion
  console.log("loot dropped");
  let num = randNum(100);
  if(num < 75){
    player.weapon = generateWeapon();
  }else{
    generatePotion();
  };

};

function isAlive(deff){
  let hp = deff.hp;
  let id = deff.id;
  let isPlayer = deff === player? true : false;
  if(hp < 1){
    if(isPlayer){
      playerDies();
    }else{
      return isKilled(deff);
    }
  }else{
    console.log("Alive");
  }
}

function playerDies(){
  return console.log("Player Died");
}


function test(){
  generateCharacter('priest');
  generateMonster();
  attack(player, monsters[0]);
}
