console.log('helper wired');

let player = new Object();
let monster = new Object();

function randNum(n){
  return Math.floor(Math.random() * n);
}

function setAtt(){
  let sum = 0;
  for(i = 0; i<3; i++){
    sum += randNum(20);
  }
  return Math.floor( sum / 3 );
}

function getMod(char){ //pass in character.attribute
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
  player.hp = setAtt() + 10;
  player.str = setAtt();
  player.dex = setAtt();
  player.speed = setAtt();
  player.fort = setAtt();
  player.luck = setAtt();
  player.ac = getMod(player.speed) + 10;
  player.weapon = 5;

  switch(costume){
    case 'knight':
      player.str += 4;
      console.log('+2 Strength');
    break;
    // TODO: Add other classes
  };
  return player;
}

function generateMonster(specific){ //pass in type for specific, leave blank for random
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
  // TODO: Random level +- 3 of player.level
  monster.hp = setAtt() + 10;
  monster.str = setAtt();
  monster.dex = setAtt();
  monster.speed = setAtt();
  monster.fort = setAtt();
  monster.ac = getMod(monster.speed) + 10;

  switch(type){
    case 'skeleton':
      console.log('Base Monster');
      monster.weapon = `Bag o' Bones`;
    break;
    case 'werewolf':
      monster.dex += 3;
      monster.weapon = 'Moonlight Sonata';
      console.log('+3 Dexterity');
    break;
    case 'vampire':
      monster.fort += 3;
      monster.weapon = `Vampire Attack`;
      console.log('+3 Fortitude');
    break;
    case 'zombie':
      monster.str += 3;
      monster.weapon = `Zombie Attack`;
      console.log('+3 Strength');
    break;
    case 'ghost':
      monster.speed += 3;
      monster.weapon = `Ghost attack`;
      console.log('+3 Speed');
    break;
  };
  return monster;
}

function attack(off, deff){
  let attack = randNum(20) + getMod(off.dex);
  if (attack >= deff.ac){
    return 'hit';
  }else{
    return 'miss';
  }
}

function calcDam(off, deff){
  let damage = randNum(off.weapon) + off.str;
  deff.hp -= damage;
}

function generateWeapon(type){ //pass type or leave blank for random based on player's luck 
  let weapon;
  let num;
  if(type){
    num = type;
  }else {
    num = randNum(100) + getMod(player.luck);
    console.log(num);
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
