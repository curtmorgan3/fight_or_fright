
let player = new Object();
let monsters = [];
let orderOfAttack = [];
let orderFirst=[];
let orderLast=[];
let playerWent = false;
let playerAlive = true;
let newFloor = true;
let floorCount = 1;
let killCount = 0;
let countDown = 0;


//************** Game Logic *****************************
function gameStart(){
  generateCharacter('knight');
  renderStart();
  renderAll();
  populateFloor();
}

function populateFloor(){
  let num = randNum(3) + randNum(player.level);
  for (i=0; i<num; i++){
    generateMonster();
  }
  newFloor = true;
  determineOrder();
  renderField();
  renderTurnOrder();
  renderFloor();
  renderInventory();
  beginTurn();
}

function beginTurn(){
  console.log('beginTurn');
  let playerFirst = isPlayerFirst();
  let playerLast = isPlayerLast();
  let playerMiddle = isPlayerMiddle();

  // The first time, make two arrays--All monsters that go before player
  // and all that go after
  if(newFloor){

    if(playerFirst){
      orderLast = orderOfAttack.slice(1,orderOfAttack.length)
    }else if(playerLast){
      for (let i = 0; i<orderOfAttack.length-1; i++){
        let index = orderOfAttack[i];
        orderFirst.push(index);
      }
    }else if(playerMiddle){
      let playerPos = 0;
      for(let i = 0; i < orderOfAttack.length; i++){
        let index = orderOfAttack[i];
        if(index === player){
          playerPos = i;
        }
      }
      for(let i = 0; i<orderOfAttack.length; i++){
        if(i < playerPos){
          orderFirst.push(orderOfAttack[i])
        }else if (i > playerPos){
          orderLast.push(orderOfAttack[i])
        }
      }
    }
  }
  newFloor = false;

  // Now the attacks should go orderFirst, player, orderLast

    if((playerFirst) && (!playerWent)){
      console.log('players first');
      playerWent = true;
      // }
    }else if( ( (playerLast) || (playerMiddle) ) && (!playerWent) ){
      for (let i = 0; i < orderFirst.length; i++){
        console.log(`${orderFirst[i].name} attacks!`);
        playerWent = true;
        attack(orderFirst[i], player);
      }
    }else if( (playerFirst) && (playerWent) ){
      for (let i=0; i < orderLast.length; i++){
        console.log(`${orderLast[i].name} attacks!`);
        playerWent = false;
        attack(orderLast[i], player);
      }
    }else if( (playerLast) && (playerWent) ){
      console.log('last step');
      for (let i = 0; i < orderFirst.length; i++){
        console.log(`${orderFirst[i].name} attacks!`);
        playerWent = false;
        attack(orderFirst[i], player);
      }
    }else if ( (playerMiddle) && (playerWent) ){
      console.log('last step');
      for (let i = 0; i < orderLast.length; i++){
        console.log(`${orderLast[i].name} attacks!`);
        playerWent = false;
        attack(orderLast[i], player);
        //You need recursion here because the orderLast monsters have to move.
        beginTurn();
      }
    }
};

function endFloor(){
  orderOfAttack = [];
  renderAll();
  player.hp = player.maxHP;
  checkXP();
  floorCount += 1;
  playerReady();
}

function playerReady(){
  let background = document.querySelector('.background');
  let message = document.createElement('div');
  message.className = 'message';
  message.innerText = 'Nice job! Ready for the next floor?'
  message.addEventListener('click', populateFloor);
  background.appendChild(message);
}

function gameOver(){
  console.log(killCount);
  console.log(floorCount);
  monsters = [];
  orderOfAttack = [];
  alert("Game Over");
  generateCharacter();
  renderStart();
  renderAll();
}


//*************** Rendering ******************************
function renderStart(){
  let field = document.querySelector('.field');


  let floor = document.createElement('div');
  floor.className = 'floor';
  let background = document.createElement('div');
  background.className = 'background';
  let turnOrder = document.createElement('div');
  turnOrder.className = 'turn'
  let actions = document.createElement('div');
  actions.className = 'actions'
  let playerRow = document.createElement('div');
  playerRow.className = 'player'
  let inventory =  document.createElement('div');
  inventory.className = 'inventory';

  field.appendChild(floor);
  floor.appendChild(background);
  field.appendChild(turnOrder);
  field.appendChild(actions);
  field.appendChild(playerRow);
  field.appendChild(inventory);
}

function renderField(){
  let actions = document.querySelector('.actions');
  let playerRow = document.querySelector('.player');

  if(actions.firstChild){
    while(actions.firstChild){
      actions.removeChild(actions.firstChild);
    }
  }
  if(playerRow.firstChild){
    while(playerRow.firstChild){
      playerRow.removeChild(playerRow.firstChild);
    }
  }



  let attackButton = document.createElement('div');
  attackButton.className = 'attackButton';
  attackButton.innerText = 'Attack';
  let escapeButton = document.createElement('div');
  escapeButton.className = 'escapeButton';
  escapeButton.innerText = 'Escape';
  actions.appendChild(attackButton);
  actions.appendChild(escapeButton);

  // let attackButton = document.querySelector('.attackButton');
  attackButton.addEventListener('click', selectTarget);

  let playerStats = document.createElement('div');
  playerStats.className = 'playerStats';
  playerStats.innerText = `Strength: ${player.str} Speed: ${player.speed}  \n
                           Dexterity: ${player.dex} Fortitude: ${player.fort} \n
                           Luck: ${player.luck} Level: ${player.level}`;
  playerRow.appendChild(playerStats);

  let playerPortrait = document.createElement('div');
  playerPortrait.className = 'portrait';
  playerPortrait.innerText = player.name;
  playerRow.appendChild(playerPortrait);

  let weaponStats = document.createElement('div');
  weaponStats.className = 'playerWeapon';
  weaponStats.innerText = `${player.weaponName}\n
                           ${player.weaponQual}: 1-${player.weapon} damange`;
  playerRow.appendChild(weaponStats);

}

function renderTurnOrder(){
  let turnOrder = document.querySelector('.turn');
  if(orderOfAttack.length >= 0){
    while(turnOrder.firstChild){
      turnOrder.removeChild(turnOrder.firstChild);
    }
  }
  for(let i=0; i < orderOfAttack.length; i++){
    let pawn = document.createElement('div');
    pawn.className = 'portrait';
    pawn.innerText = orderOfAttack[i].name;
    turnOrder.appendChild(pawn);
  }
}

function renderFloor(){
  let background = document.querySelector('.background');
  if(orderOfAttack.length <= 1){
    while(background.firstChild){
      background.removeChild(background.firstChild)
    }
  }

  for(let i=0; i < monsters.length; i++){
    let mon = document.createElement('div');
    mon.className = 'sprite';
    mon.id = monsters[i].id;
    mon.innerText = monsters[i].name;
    background.appendChild(mon);
  }
}

function renderInventory(){
  let inven = document.querySelector('.inventory');
  if(player.inventory.length <= 1){
    while(inven.firstChild){
      inven.removeChild(inven.firstChild)
    }
  }
  for (i=0; i < player.inventory.length; i++){
    let potion = document.createElement('div');
    potion.className = 'healthPotion';
    potion.innerText = 'Health Potion';
    potion.addEventListener('click', usePotion);
    inven.appendChild(potion);
  }
}

function renderAll(){
  renderTurnOrder();
  renderFloor();
  renderField();
  renderInventory();


}

//**************** Helpers *******************************
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

function isPlayerFirst(){
  if(orderOfAttack[0] === player){
    return true;
  }else{
    return false;
  }
};

function isPlayerLast(){
  let index = orderOfAttack.length - 1;
  if(orderOfAttack[index] === player){
    return true;
  }else{
    return false;
  }
}

function isPlayerMiddle(){
  if(!isPlayerFirst() && !isPlayerLast()){
    return true;
  }else{
    return false;
  }
}

function getMod(char){ //pass in character.attribute, which is a number value
  let mod = -5;
  for (i = 1; i<char; i+= 2){
    mod += 1;
  }
  return mod;
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
  player.weapon = 6;
  player.weaponName = 'Wooden Sword';
  player.hp = player.maxHP;
  player.inventory = [];
  player.init = 0 + getMod(player.speed);
  player.weaponQual = 'Poor';

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
      type = ranType[randNum(ranType.length)-1];
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
  monster.name = type;
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

function selectTarget(){
  console.log('Select Target');
  let floor = document.querySelector('.floor');
  let sprites = floor.querySelectorAll('.sprite');
  for (let i = 0; i < sprites.length; i++){
    let targetId = parseInt(sprites[i].id);
    sprites[i].addEventListener('click', function(){
      for(let i=0; i<monsters.length; i++){
        let mon = monsters[i];
        if(targetId === parseInt(mon.id)){
          let target = mon;
          attack(player, target);
        }
      }
    });
  }
}

function attack(off, deff){
  let attack = randNum(20) + getMod(off.dex);
  if (attack >= deff.ac){
    calcDam(off, deff);
  }else{
    console.log("miss");
  }
  if ( (off === player) && (orderOfAttack >= 1) ){
    // playerWent = true;
    console.log('attack() callback');
    beginTurn();
  }else if (orderOfAttack <= 1){
    return endFloor();
  }

}

function calcDam(off, deff){
  let damage = randNum(off.weapon) + getMod(off.str);
  if (damage > 0){
    deff.hp -= damage;
  }else{
    damage = 0;
  }
  console.log(`${damage} Damage!`);
  console.log(`Defender HP: ${deff.hp}`);
  isAlive(deff);
}

function isAlive(deff){
  let hp = deff.hp;
  let id = deff.id;
  let isPlayer = deff === player? true : false;
  if(hp < 1){
    if(isPlayer){
      playerDies();
    }else{
      isKilled(deff);
    }
  }else{
    console.log("Alive");
  }
}

function playerDies(){
  console.log("Player Died");
  orderOfAttack = [];
  playerAlive = false;
  gameOver();
}

function isKilled(char){
  let xp = (char.level * randNum(800) + (randNum(100) * getMod(player.luck)) );
  player.xp += xp;
  let id = char.id;

  for (i = 0; i<monsters.length; i++){
    if(monsters[i].id === id){
      console.log(`${monsters[i].name} slain!`);
      monsters.splice(i,1);
      orderOfAttack.splice(i,1);
      orderFirst.splice(i,1);
      orderLast.splice(i,1);
      if(orderOfAttack.length === 1){
        orderOfAttack = [];
      }
      killCount += 1;
    }
  }
  if(orderOfAttack.length === 1){
    return endFloor();
  }
  dropLoot();
  checkXP();
  renderAll();

}

function checkXP(){
  let xp = player.xp;
  let currentLevel = player.level;
  let nextLevel = currentLevel + 1;

  let requiredXP = ( ( ( (nextLevel * nextLevel) + nextLevel) / 2) * 100) - (nextLevel * 100);
  console.log(requiredXP);
  if (xp >= requiredXP){
    levelUp('str');
    checkXP();
  }else{
    return console.log("Not enough XP");
  }
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

function dropLoot(){ // 75% chance of dropping weapon, 25% drop potion
  console.log("loot dropped");
  let num = randNum(100);
  if(num < 75){
    player.weapon = generateWeapon();
  }else{
    generatePotion();
  };
};

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
      player.weaponQual = 'Poor';
      // TODO: Generate random weapon name
    break;
    //51-70
    case (num > 50 && num <= 70):
    case (num ==='decent'):
      weapon =  8;
      player.weaponQual = 'Decent';
    break;
    //71-85
    case (num > 70 && num <= 85):
    case (num ==='good'):
      weapon =  12;
      player.weaponQual = 'Good';
    break;
    //86-95
    case (num > 85 && num <= 95):
    case (num === 'great'):
      weapon =  16;
      player.weaponQual = 'Great';
    break;
    //96-100
    case (num > 95 && num <= 100):
    case (num ==='awesome'):
      weapon =  20;
      player.weaponQual = 'Awesome';
    break;
  }
  return player.weapon = weapon;
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

function usePotion(){
  if(player.inventory.includes('healthPotion')){
    player.hp = player.maxHP;
    player.inventory.shift(0,1)
  }else{
    console.log('You have no potions!');
  }
}

function escape(){

}
