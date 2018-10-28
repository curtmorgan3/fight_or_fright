
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
let escaping = false;
let lootWeapon = new Object();
let lootDropped = false;


// TODO: Balance

// TODO: Animations
// TODO: Make it responsive



//************** Game Logic *****************************
function gameStart(){
  renderStart();
  renderWelcome();
}

function chooseCharacter(){
  characterCostume = this.id;
  generateCharacter(characterCostume);
  renderNameScreen();
}

function populateFloor(){
  let num = randNum(2) + randNum(player.level);
  console.log('num: ' + num);
  console.log("type: " + typeof (num));
  for (let i=0; i < num; i++){
    console.log('monster gen');
    generateMonster();
  }

  newFloor = true;
  clearScreen();
  escaping = false;
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
    splitOrder();
    newFloor = false;
  }

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

function splitOrder(){
  orderFirst = [];
  orderLast = [];
  let playerFirst = isPlayerFirst();
  let playerLast = isPlayerLast();
  let playerMiddle = isPlayerMiddle();

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

function endFloor(){

  orderOfAttack = [];
  dropLoot();
  clearScreen();
  checkXP();
  floorCount += 1;
  if(canLevelUp > 0){
    renderLevelUp();
  }else{
    renderEnter();
  }
  player.hp = player.maxHP;
}

function gameOver(){
  console.log('Game Over');
  clearScreen();
  monsters = [];
  orderOfAttack = [];
  let floor = document.querySelector('.floor')
  let background = document.createElement('div');
  background.className = 'background';
  floor.appendChild(background);

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
  button.addEventListener('click', startOver);

  function startOver(){
    let field = document.querySelector('.field');
    while(field.firstChild){
      field.removeChild(field.firstChild)
    };
    player = new Object();
    playerAlive = true;
    gameStart();
  }

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

function renderWelcome(){
  let background = document.querySelector('.background');
  let welcome = document.createElement('div');
  welcome.className = 'welcome';
  welcome.innerHTML = `
    <h2>Fight or Fright!</h2> <br/>
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
    costume.addEventListener('mouseover', describe)
    background.appendChild(costume);
  }
  let description = document.createElement('div');
  description.className = 'description';
  background.appendChild(description)
  function describe(){
    let costume = this.id;
    switch(costume){
      case 'knight':
        description.innerText = `Knights are strong, but all that armor makes them slow! \n
                                  +2 Strength, -2 Speed` ;
      break;
      case 'rogue':
        description.innerText = `Rogues are sneaky, but aren't the best at hitting their targets. \n
                                +2 Speed, -2 Dexterity`;
      break;
      case 'priest':
        description.innerText = `Priests channel a lot of energy from...somewhere. \n
                                +2 Fortitude, -2 Strength`;
      break;
      case 'ninja':
        description.innerText = `Ninjas almost always hit their target, but they don't like to wear armor.\n
                                +2 Dexterity, -2 Fortitude`;
      break;
      case 'gambler':
        description.innerText = `Gamblers don't need anything but the favor of ol' Lady Luck. \n
                                +4 Luck`;
      break;






    }
  }

};

//Renders the actions column and player row
function renderField(){
  let actions = document.querySelector('.actions');

  let attackButton = document.createElement('div');
  attackButton.className = 'attackButton';
  attackButton.innerText = 'Attack';
  let escapeButton = document.createElement('div');
  escapeButton.className = 'escapeButton';
  escapeButton.innerText = 'Escape';
  actions.appendChild(attackButton);
  actions.appendChild(escapeButton);

  attackButton.addEventListener('click', selectTarget);
  escapeButton.addEventListener('click', escape);

  renderPlayerRow();



}

//Renders Player row
function renderPlayerRow(){
  let playerRow = document.querySelector('.player');
  while(playerRow.firstChild){
    playerRow.removeChild(playerRow.firstChild);
  }
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
  while(turnOrder.firstChild){
    turnOrder.removeChild(turnOrder.firstChild)
  }
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
    let container = document.createElement('div');
    container.className = "spriteContainer"
    let mon = document.createElement('div');
    mon.className = 'sprite';
    let feedback = document.createElement('div');
    feedback.className = 'feedback';

    let name = monsters[i].name;
    mon.style.backgroundImage = `url(images/${name}.png)`;
    mon.id = monsters[i].id;

    feedback.innerText = `${monsters[i].hp} / ${monsters[i].maxHP}`

    background.appendChild(container);
    container.appendChild(feedback);
    container.appendChild(mon);
  }
}

//Renders the inventory column
function renderInventory(){
  let inven = document.querySelector('.inventory');
  while(inven.firstChild){
    inven.removeChild(inven.firstChild)
  }
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

  if(lootDropped){
    renderLootSign();
    lootDropped = false;
  }

  let floorSign = document.createElement('div');
  floorSign.className = 'floorSign';
  floorSign.innerHTML = `
    <h2>Prepare for horror!</h2> </br>

    <h3>${playerName}, ${characterCostume}, Level: ${player.level} <br>
        Strength: ${player.str} / Speed: ${player.speed} / Dexterity: ${player.dex} <br>
        Fortitude: ${player.fort} / Luck: ${player.luck} / Max Health: ${player.maxHP} <br>
        Weapon: ${player.weaponName} / Quality: ${player.weaponQual} / Damage: 1- ${player.weapon}</h3>
    <h2>Floor: ${floorCount}</h2> <button id ='beginFloor'</button>Enter...</br>

  `
  background.appendChild(floorSign);
  let button = document.getElementById('beginFloor');
  button.addEventListener('click', populateFloor);

};

function renderLootSign(){
  let background = document.querySelector('.background');
  let lootSign = document.createElement('div')
  lootSign.className = 'lootSign';
  lootSign.innerHTML = `<h2>You found a new weapon!</h2> <br>
    <button id='accept'>Take this weapon</button> <br>
    <button id='deny'>Keep your current weapon</button> `

    let weaponStats = document.createElement('div');
    weaponStats.className = 'playerWeapon';
    weaponStats.innerText = `${lootWeapon.weaponName}\n
                             ${lootWeapon.weaponQual}: 1-${lootWeapon.weapon} damange`;
    lootSign.appendChild(weaponStats);

    let weaponIcon = document.createElement('div');
    weaponIcon.className = 'portrait';
    let qual = lootWeapon.weaponQual.toLowerCase();
    weaponIcon.style.backgroundImage = `url(images/${qual}.png)`;
    lootSign.appendChild(weaponIcon);

    background.appendChild(lootSign);

    let accept = document.getElementById('accept')
    accept.addEventListener('click', acceptWeapon);
    let deny = document.getElementById('deny')
    deny.addEventListener('click', denyWeapon);

    function acceptWeapon(){
      player.weapon = lootWeapon.weapon;
      player.weaponQual = lootWeapon.weaponQual;
      player.weaponName = lootWeapon.weaponName;
      background.removeChild(lootSign)
    }
    function denyWeapon(){
      background.removeChild(lootSign)
    }
}

function renderLevelUp(){
  if(playerAlive){
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
    // console.log(section);
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
      player.str += 2;
      player.speed -= 2;
    break;
    case 'rogue':
      player.speed += 2;
      player.dex -= 2;
    break;
    case 'ninja':
      player.dex += 2;
      player.fort -= 2;
    break;
    case 'priest':
      player.fort += 2;
      player.str -= 2;
    break;
    case 'gambler':
      player.luck += 4;
    break;

  };
  return player;
}
//pass in type for specific, leave blank for random
function generateMonster(specific){
  let coin = randNum(2);
  console.log(coin);
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
  if(coin > 1){
    monster.level = randNum(2) + player.level;
  }else{
    monster.level = randNum(2) - player.level;
  }
  if(monster.level < 1){
    monster.level = 1;
  }
  monster.id = randNum(100000);
  monster.hp = setAtt() - 5;
  if(monster.hp < 2){
    monster.hp = 2;
  }
  monster.maxHP = monster.hp;
  monster.str = setAtt() + (1.2 * monster.level);
  monster.dex = setAtt() + (1.2 * monster.level);
  monster.speed = setAtt() + (1.2 * monster.level);
  monster.fort = setAtt() + (1.2 * monster.level);
  monster.ac = getMod(monster.speed) + 10;
  monster.weapon = (randNum(2) +1) + monster.level + getMod(monster.str);
  monster.name = type;
  monster.init = 0 + getMod(monster.speed);

  switch(type){
    case 'skeleton':
    break;
    case 'werewolf':
      monster.dex += 3;
    break;
    case 'vampire':
      monster.fort += 3;
    break;
    case 'zombie':
      monster.str += 3;
    break;
    case 'ghost':
      monster.speed += 3;
    break;
  };
  monsters.push(monster);
}


//***************** Combat **********************************
//Wire up sprites to their monster
function selectTarget(){
  let attackButton = document.querySelector('.attackButton');
  attackButton.innerText = `Who?`;
  setTimeout(function(){attackButton.innerText = `Attack`}, 2000)

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
    if (attack >= deff.ac){
      let id = deff.id;
      let sprites = document.querySelectorAll('.sprite');
      for(i = 0; i<sprites.length; i++){
        let sprite = sprites[i];
        let spriteId = parseInt(sprite.id)
        if(spriteId === id){
          let feedback = sprite.previousSibling;
          feedback.innerText = `${off.name} hits ${deff.name}!`
          setTimeout(function() {feedback.innerText = `${deff.hp} / ${deff.maxHP}`}, 1500)
        }
      }
      calcDam(off,deff);
      setTimeout(beginTurn, 3000);

    }else{
      let id = deff.id;
      let sprites = document.querySelectorAll('.sprite');
      for(i = 0; i<sprites.length; i++){
        let sprite = sprites[i];
        let spriteId = parseInt(sprite.id)
        if(spriteId === id){
          let feedback = sprite.previousSibling;
          feedback.innerText = `${off.name} misses ${deff.name}!`
          setTimeout(function() {feedback.innerText = `${deff.hp} / ${deff.maxHP}`}, 1500)
        }
      }
      setTimeout(beginTurn, 3000);
    }
  }else if ((orderOfAttack.length <= 1) && (playerAlive)){
    return endFloor();
  }else {
    //Monster Attacks
    if (attack >= deff.ac){
      let id = off.id;
      let sprites = document.querySelectorAll('.sprite');
      for(i = 0; i<sprites.length; i++){
        let sprite = sprites[i];
        let spriteId = parseInt(sprite.id)
        if(spriteId === id){
          let feedback = sprite.previousSibling;
          feedback.innerText = `${off.name} hits ${player.name}!`
          console.log(feedback.innerText);
          setTimeout(function() {feedback.innerText = `${off.hp} / ${off.maxHP}`}, 1500)
        }
      }
      calcDam(off,deff);
    }else{
      let id = off.id;
      let sprites = document.querySelectorAll('.sprite');
      for(i = 0; i<sprites.length; i++){
        let sprite = sprites[i];
        let spriteId = parseInt(sprite.id)
        if(spriteId === id){
          let feedback = sprite.previousSibling;
          feedback.innerText = `${off.name} misses ${player.name}!`
          setTimeout(function() {feedback.innerText = `${off.hp} / ${off.maxHP}`}, 1500)
        }
      }
    }
  }
};
//Attack part two
function calcDam(off, deff){
  let damage = randNum(off.weapon) + getMod(off.str);
  if (damage === 0){
    damage = 1;
  }
  if (damage > 0){
    deff.hp -= damage;
      let id = off.id;
      let sprites = document.querySelectorAll('.sprite');
      for(i = 0; i<sprites.length; i++){
        let sprite = sprites[i];
        let spriteId = parseInt(sprite.id)
        if(spriteId === id){
          let feedback = sprite.previousSibling;
          setTimeout(function() {feedback.innerText = `${damage} damage!`}, 2000);
          if(off !== player){
            setTimeout(function() {feedback.innerText = `${off.hp} / ${off.maxHP}`}, 4000)
          }else{
            setTimeout(function() {feedback.innerText = `${deff.hp} / ${deff.maxHP}`}, 4000)
          }
          if(player.hp >= 1 && !escaping){
            console.log('clean');
            setTimeout(clean, 5000);
          }
        }
      }
    function clean(){
      clearScreen();
      renderAll();
    }

  }else{
    damage = 0;
  }
  isAlive(deff);
}
//Attack part three
function isAlive(deff){
  let hp = deff.hp;
  let id = deff.id;
  let isPlayer;
  if(deff === player){
    isPlayer = true;
  }else{
    isPlayer = false;
  }
  console.log(isPlayer);
  console.log(deff);
  if(hp < 1){
    if(isPlayer){
      return playerDies();
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
  playerAlive = false;
  return gameOver();
}
//Monster Dies part one
function isKilled(char){
  let xp = (char.level * randNum(300) + (randNum(100) * getMod(player.luck)) );
  player.xp += xp;
  console.log('+'+xp+'XP');
  let id = char.id;

  for (let i = 0; i<monsters.length; i++){
    if(monsters[i].id === id){
      monsters.splice(i,1);
      for(let i =0; i< orderOfAttack.length; i++){
        if(id === orderOfAttack[i].id){
          orderOfAttack.splice(i,1);
        }
      }
      for(let i = 0; i<orderFirst.length; i++){
        if(id === orderFirst[i].id){
          orderFirst.splice(i,1);
        }
      }
      for(let i=0; i<orderLast.length; i++){
        if(id === orderLast[i].id){
          orderLast.splice(i,1);
        }
      }

      if(orderOfAttack.length === 1){
        orderOfAttack = [];
        killCount += 1;
        return endFloor();
      }
      killCount += 1;
      renderTurnOrder();
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
  player.hp = player.maxHP;
  if(canLevelUp > 0){
    renderLevelUp();
  }else {
    renderEnter();
  }

}
//Monster Dies part three
function dropLoot(){ // 75% chance of dropping weapon, 25% drop potion
  let num = randNum(100);
  if(num < 75){
    generateWeapon();
    lootDropped = true;
  }else{
    generatePotion();
  };
};
//Loot weapon
//pass type or leave blank for random based on player's luck
function generateWeapon(type){
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
      lootWeapon.weapon =  6;
      lootWeapon.weaponQual = 'Poor';
      lootWeapon.weaponName = 'Wooden Sword'
      // TODO: Generate random weapon name
    break;
    //51-70
    case (num > 50 && num <= 70):
    case (num ==='decent'):
      lootWeapon.weapon =  8;
      lootWeapon.weaponQual = 'Decent';
      lootWeapon.weaponName = 'Small Dagger'
    break;
    //71-85
    case (num > 70 && num <= 85):
    case (num ==='good'):
      lootWeapon.weapon =  12;
      lootWeapon.weaponQual = 'Good';
      lootWeapon.weaponName = 'Iron Sword'
    break;
    //86-95
    case (num > 85 && num <= 97):
    case (num === 'great'):
      lootWeapon.weapon =  16;
      lootWeapon.weaponQual = 'Great';
      lootWeapon.weaponName = 'Axe'
    break;
    //96-100
    case (num > 97 && num <= 100):
    case (num ==='awesome'):
      lootWeapon.weapon =  20;
      lootWeapon.weaponQual = 'Awesome';
      lootWeapon.weaponName = 'Double Axe'
    break;
  }
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
    renderPlayerRow();
    renderInventory();
  }else{
    console.log('You have no potions!');
  }
}
// Escape
function escape(){
  for(i = 0; i<orderFirst.length; i++){
    attack(orderFirst[i], player);
  }
  for(i=0; i<orderLast.length; i++){
    attack(orderLast[i], player);
  }
  if(playerAlive){
    if(floorCount > 1){
      floorCount--;
    }else{
      floorCount = 1;
    }
    player.hp = player.maxHP;
    orderFirst = [];
    orderLast = [];
    orderOfAttack = [];
    monsters=[];
    escaping = true;
    renderEnter();
  }

}



gameStart();
