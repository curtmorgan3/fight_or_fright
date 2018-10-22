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
  player.maxHP = setAtt() + getMod(player.fort);
  player.ac = getMod(player.speed) + 10;
  player.costume = costume;
  player.weapon = 5;
  player.inventory = [];


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
  dropLoot();
}

function dropLoot(){
  let num = randNum(100);


  if(num < 75){
    player.weapon = generateWeapon();
    console.log('Added weapon');
    console.log(player.weapon);
  }else{
    generatePotion();
    console.log('added potion');
  };

};
