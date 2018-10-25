
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
let characterCostume;
let playerName = '';
let canLevelUp = 0;

// TODO:


//************** Game Logic *****************************
function gameStart(){
  renderStart();
  renderWelcome();
}

function renderWelcome(){
  let background = document.querySelector('.background');
  let welcome = document.createElement('div');
  welcome.className = 'welcome';
  welcome.innerHTML = `
    <h2>Haunted House</h2> <br/>
    <h3>Choose your character</h3>
  `
  background.appendChild(welcome)
  let costumes = ['knight','rogue','priest','ninja','gambler'];

  for (i = 0; i<costumes.length; i++){
    let costume = document.createElement('div');
    costume.className = 'portrait';
    costume.style.backgroundImage = `url(images/${costumes[i]}.png)`
    costume.id = costumes[i];
    costume.addEventListener('click', chooseCharacter);
    background.appendChild(costume);
  }

};

function chooseCharacter(){
  characterCostume = this.id;
  generateCharacter(characterCostume);
  renderNameScreen();
}

function populateFloor(){
  let num = randNum(3) + randNum(player.level);
  for (i=0; i<num; i++){
    generateMonster();
  }
  newFloor = true;
  clearScreen();

  determineOrder();
  renderAll();
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
  if(orderOfAttack.length > 1){
    if((playerFirst) && (!playerWent)){
      console.log('players first');
      playerWent = true;
    }else if( ( (playerLast) || (playerMiddle) ) && (!playerWent) ){
      console.log('player last or middle and didnt go');
      for (let i = 0; i < orderFirst.length; i++){
        console.log(`${orderFirst[i].name} attacks!`);
        playerWent = true;
        attack(orderFirst[i], player);
      }
    }else if( (playerFirst) && (playerWent) ){
      console.log('players first and already went');
      for (let i=0; i < orderLast.length; i++){
        console.log(`${orderLast[i].name} attacks!`);
        playerWent = false;
        attack(orderLast[i], player);
      }
    }else if( (playerLast) && (playerWent) ){
      console.log('players last and already went');
      console.log('last step');
      for (let i = 0; i < orderFirst.length; i++){
        console.log(`${orderFirst[i].name} attacks!`);
        playerWent = false;
        attack(orderFirst[i], player);
      }
    }else if ( (playerMiddle) && (playerWent) ){
      console.log('players middle and went');
      for (let i = 0; i < orderLast.length; i++){
        console.log(`${orderLast[i].name} attacks!`);
        playerWent = false;
        attack(orderLast[i], player);
        //You need recursion here because the orderLast monsters have to move.
        beginTurn();
      }
    }
  }
};

function endFloor(){
  console.log('end floor');
  orderOfAttack = [];
  dropLoot();
  clearScreen();
  checkXP();
  player.hp = player.maxHP;
  floorCount += 1;
  if(canLevelUp > 0){
    renderLevelUp();
  }else{
    renderEnter();
  }

}



function gameOver(){
  clearScreen();
  monsters = [];
  orderOfAttack = [];
  let field = document.querySelector('.field');
  let background = document.createElement('div');
  background.className = 'background';
  field.appendChild(background);

  let gameOver = document.createElement('div');
  gameOver.className = 'gameOver';

  gameOver.innerHTML = `
    <h1>Game Over</h1>
    <h3>Floors Cleared: ${floorCount - 1}</h3>
    <h3>Monsters Killed: ${killCount}</h3>
    <button id = 'playAgain'>Play Again<button>
    <h3>${playerName}, ${characterCostume}, Level: ${player.level} <br>
    <h4>Strength: ${player.str} / Speed: ${player.speed} / Dexterity: ${player.dex}<br>
    <h4>Fortitude: ${player.fort} / Luck: ${player.luck} / Max Health: ${player.maxHP}<br>
    <h4>Weapon: ${player.weaponName} / Quality: ${player.weaponQual} / Damage: 1- ${player.weapon}</h4>

  `
  background.appendChild(gameOver);
  let button = document.getElementById('playAgain');
  button.addEventListener('click', gameStart);

}


//*************** Rendering ******************************
//Creates all containers and appends them to the field
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

//Renders the actions column and player row
function renderField(){
  let actions = document.querySelector('.actions');
  let playerRow = document.querySelector('.player');

  let attackButton = document.createElement('div');
  attackButton.className = 'attackButton';
  attackButton.innerText = 'Attack';
  let escapeButton = document.createElement('div');
  escapeButton.className = 'escapeButton';
  escapeButton.innerText = 'Escape';
  actions.appendChild(attackButton);
  actions.appendChild(escapeButton);

  attackButton.addEventListener('click', selectTarget);

  let playerHealth = document.createElement('div');
  playerHealth.className = 'playerStats';
  playerHealth.innerText = `Health: ${player.hp} / ${player.maxHP}`
  playerRow.appendChild(playerHealth);

  let playerStats = document.createElement('div');
  playerStats.className = 'playerStats';
  playerStats.innerText = `Strength: ${player.str} Speed: ${player.speed}  \n
                           Dexterity: ${player.dex} Fortitude: ${player.fort} \n
                           Luck: ${player.luck} Level: ${player.level}`;
  playerRow.appendChild(playerStats);

  let playerPortrait = document.createElement('div');
  playerPortrait.className = 'portrait';
  // playerPortrait.innerText = player.name;
  playerPortrait.style.backgroundImage = `url(images/${player.costume}.png)`
  playerRow.appendChild(playerPortrait);

  let weaponStats = document.createElement('div');
  weaponStats.className = 'playerWeapon';
  weaponStats.innerText = `${player.weaponName}\n
                           ${player.weaponQual}: 1-${player.weapon} damange`;
  playerRow.appendChild(weaponStats);

  let weaponIcon = document.createElement('div');
  weaponIcon.className = 'portrait';
  let qual = player.weaponQual.toLowerCase();
  weaponIcon.style.backgroundImage = `url(images/${qual}.png)`;
  playerRow.appendChild(weaponIcon);

}

//Renders the turn order row
function renderTurnOrder(){
  let turnOrder = document.querySelector('.turn');

  for(let i=0; i < orderOfAttack.length; i++){
    let pawn = document.createElement('div');
    pawn.className = 'portrait';
    let name;
    if(orderOfAttack[i] === player){
      name = orderOfAttack[i].costume;
    }else{
      name = orderOfAttack[i].name;
    }
    pawn.style.backgroundImage = `url(images/${name}.png)`;
    // pawn.innerText = orderOfAttack[i].name;
    turnOrder.appendChild(pawn);
  }
}

//Renders the background and sprites of enemies
function renderFloor(){
  let background = document.createElement('div')
  background.className = 'background';


  let floor = document.querySelector('.floor')
  floor.appendChild(background);
  floor.style.backgroundImage = 'url(images/house_2.jpg)';

  for(let i=0; i < monsters.length; i++){
    let mon = document.createElement('div');
    let name = monsters[i].name;
    mon.className = 'sprite';
    mon.style.backgroundImage = `url(images/${name}.png)`;
    mon.id = monsters[i].id;
    // mon.innerText = monsters[i].name;
    background.appendChild(mon);
  }
}

//Renders the inventory column
function renderInventory(){
  let inven = document.querySelector('.inventory');
  inven.innerHTML = `<h3>Inventory</h3>`
  for (i=0; i < player.inventory.length; i++){
    let potion = document.createElement('div');
    potion.className = 'healthPotion';
    // potion.innerText = 'Health Potion';
    potion.style.backgroundImage = `url(images/healthPotion.png)`
    potion.addEventListener('click', usePotion);
    inven.appendChild(potion);
  }
}

//Renders the above 4
function renderAll(){
  renderTurnOrder();
  renderFloor();
  renderField();
  renderInventory();


}

function renderNameScreen(){

  let background = document.querySelector('.background');
  while(background.firstChild){
    background.removeChild(background.firstChild);
  }
  let nameSelect = document.createElement('div');
  nameSelect.className = 'welcome';
  nameSelect.innerHTML = `
    <h2>What is your name, ${characterCostume}?</h2>
    <input id = 'input'></input>
    <button id = 'button'>Submit</button>
  `
  background.appendChild(nameSelect);
  let button = document.getElementById('button');
  button.addEventListener('click', storeName);

  function storeName(){
    let input = document.getElementById('input').value;
    playerName = input;
    player.name = input;
    renderEnter();
  }
}

function renderEnter(){
  clearScreen();
  let background = document.createElement('div');
  let floor = document.querySelector('.floor');
  background.className = 'background';
  floor.appendChild(background);



  let floorSign = document.createElement('div');
  floorSign.className = 'floorSign';
  floorSign.innerHTML = `
    <h2>Prepare for horror!</h2> </br>
    <h2>Floor: ${floorCount}</h2> <button id ='beginFloor'</button>Enter...</br>
    <h3>${playerName}, ${characterCostume}, Level: ${player.level} <br>
        Strength: ${player.str} / Speed: ${player.speed} / Dexterity: ${player.dex} <br>
        Fortitude: ${player.fort} / Luck: ${player.luck} / Max Health: ${player.maxHP} <br>
        Weapon: ${player.weaponName} / Quality: ${player.weaponQual} / Damage: 1- ${player.weapon}</h3>
  `
  background.appendChild(floorSign);
  let button = document.getElementById('beginFloor');
  button.addEventListener('click', populateFloor);

};

function renderLevelUp(){
  console.log('render level up');
  clearScreen();
  let background = document.createElement('div');
  let floor = document.querySelector('.floor');
  background.className = 'background';
  floor.appendChild(background);


  //Level Up, pick attribute
  let levelUpScreen = document.createElement('div');
  levelUpScreen.class = 'message';
  levelUpScreen.innerHTML = `
    <h2>You leveled up!</h2> <h2>Level: ${player.level}<h2>
    <h3>Choose an attribute to increase by 1 point. If you choose your class
        attribute, it will increase by 2!</h3>
    <button id = 'str'>Strength</button>
    <button id ='speed'>Speed</button>
    <button id ='dex'>Dexterity</button>
    <button id ='fort'>Fortitude</button>
    <button id ='luck'>Luck</button>

    `
    background.appendChild(levelUpScreen);

    let str = document.getElementById('str');
    str.addEventListener('click', chooseAtt);
    let speed = document.getElementById('speed');
    speed.addEventListener('click', chooseAtt);
    let dex = document.getElementById('dex');
    dex.addEventListener('click', chooseAtt);
    let fort = document.getElementById('fort');
    fort.addEventListener('click', chooseAtt);
    let luck = document.getElementById('luck');
    luck.addEventListener('click', chooseAtt);

    function chooseAtt(){
      levelUp(this.id);
    }
}
//Leaves all containers but empties them
function clearScreen(){
  let field = document.querySelector('.field');

  let floor = document.querySelector('.floor')
  let inventory = document.querySelector('.inventory')
  let actions = document.querySelector('.actions')
  let player = document.querySelector('.player')
  let turn = document.querySelector('.turn')

  let all = [floor,inventory,actions,player,turn];

  for(i = 0; i < all.length; i++){
    let section = all[i];
    console.log(section);
    while(section.firstChild){
      section.removeChild(section.firstChild);
    }
  }

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
//pass in character.attribute, which is a number value
function getMod(char){
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
//pass in type for cosutme, leave blank for random
function generateCharacter(costume){
  //create a player object, add attributes

  player.name = playerName;
  player.level = 1;
  player.xp = 0;
  player.str = setAtt();
  player.dex = setAtt();
  player.speed = setAtt();
  player.fort = setAtt();
  player.luck = setAtt();
  player.maxHP = setAtt() + getMod(player.fort) + 30;
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
//pass in type for specific, leave blank for random
function generateMonster(specific){
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


//***************** Combat **********************************
//Wire up sprites to their monster
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
//Attack part one
function attack(off, deff){
  let attack = randNum(20) + getMod(off.dex);

  if ( (off === player) && (orderOfAttack.length > 1) ){
    console.log('off is player and OOA >1');
    if (attack >= deff.ac){
      calcDam(off, deff);
      beginTurn();
    }else{
      console.log("miss");
      beginTurn();
    }
  }else if (orderOfAttack.length <= 1){
    console.log('OOA <=1');
    return endFloor();
  }else {
    console.log('off is monster');
    if (attack >= deff.ac){
      calcDam(off, deff);
    }else{
      console.log("miss");
    }
  }
};
//Attack part two
function calcDam(off, deff){
  let damage = randNum(off.weapon) + getMod(off.str);
  if (damage > 0){
    deff.hp -= damage;
    clearScreen();
    renderAll();
  }else{
    damage = 0;
  }
  console.log(`${damage} Damage!`);
  console.log(`Defender HP: ${deff.hp}`);
  isAlive(deff);
}
//Attack part three
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
//Player Dies -> gameOver()
function playerDies(){
  console.log("Player Died");
  orderOfAttack = [];
  playerAlive = false;
  gameOver();
}
//Monster Dies part one
function isKilled(char){
  let xp = (char.level * randNum(800) + (randNum(100) * getMod(player.luck)) );
  player.xp += xp;
  console.log('+'+xp+'XP');
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
        killCount += 1;
        return endFloor();
      }
      killCount += 1;
    }
  }

}
//Monster Dies part two
function checkXP(){
  let xp = player.xp;
  let currentLevel = player.level;
  let nextLevel = currentLevel + 1;

  let requiredXP = ( ( ( (nextLevel * nextLevel) + nextLevel) / 2) * 100) - (nextLevel * 100);

  if (xp >= requiredXP){
    canLevelUp += 1;
    player.level += 1;
    checkXP();
  }else{
    return console.log("Not enough XP");
  }
};
//If players has enough XP
function levelUp(att){ //pass the skill point the user selects
  console.log('Level Up');
  canLevelUp --;
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
  // player.level += 1;
  if(canLevelUp > 0){
    renderLevelUp();
  }else {
    renderEnter();
  }

}
//Monster Dies part three
function dropLoot(){ // 75% chance of dropping weapon, 25% drop potion
  console.log("loot dropped");
  let num = randNum(100);
  if(num < 75){
    player.weapon = generateWeapon();
  }else{
    generatePotion();
  };
};
//Loot weapon
//pass type or leave blank for random based on player's luck
function generateWeapon(type){
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
      player.weaponName = 'Wooden Sword'
      // TODO: Generate random weapon name
    break;
    //51-70
    case (num > 50 && num <= 70):
    case (num ==='decent'):
      weapon =  8;
      player.weaponQual = 'Decent';
      player.weaponName = 'Small Dagger'
    break;
    //71-85
    case (num > 70 && num <= 85):
    case (num ==='good'):
      weapon =  12;
      player.weaponQual = 'Good';
      player.weaponName = 'Iron Sword'
    break;
    //86-95
    case (num > 85 && num <= 95):
    case (num === 'great'):
      weapon =  16;
      player.weaponQual = 'Great';
      player.weaponName = 'Axe'
    break;
    //96-100
    case (num > 95 && num <= 100):
    case (num ==='awesome'):
      weapon =  20;
      player.weaponQual = 'Awesome';
      player.weaponName = 'Double Axe'
    break;
  }
  return player.weapon = weapon;
}
//Loot potion
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
//Use potion
function usePotion(){
  if(player.inventory.includes('healthPotion')){
    player.hp = player.maxHP;
    player.inventory.shift(0,1);
    renderInventory();
  }else{
    console.log('You have no potions!');
  }
}
// Escpae
function escape(){

}
