Wireframe: https://wireframe.cc/4Ja0ae

#h1Description

The user plays a hero on Halloween that must travel through the infinite levels of a haunted house. He
is armed with a wooden sword and his wit. Each level of the house is populated with monsters for the hero
to slay. As the hero slays more and more monsters, he gets stronger, faster and smarter. As the hero levels
up, so too do the monsters he must destroy.

The child will have stats that determine certain actions:
  Strength will make his attacks deal more damage
  Speed will make him harder for monsters to hit and more likely to go first
  Dexterity will make it easier to hit monsters
  Fortitude will make him harder to kill
  Luck will help him collect better loot

The monsters will have their own stats of all the above minus luck (monsters aren't lucky)

At the start of each floor
, the turn order is established randomly, favoring speed. Each monster, plus
the hero, will have a turn.

During each turn the hero may either:
  Attack - choose one monster to attack
  Use Item - use items he's found in the haunted house
  Escape - try to run away, but be careful! Each monster will attack on the way out

If the hero slays all monsters on a floor, he receives experience points that will help him level up.
Each time the hero levels up, he chooses one stat to make better by one point. The hero's health is
restored and he continues to the next floor.


#h1Minimum Viable Product

The user has a graphical representation of the player character and opponent character.

The player can attack opponents, the opponents can attack the player.

The player's stats are tracked and used, in addition to randomness, to decide the following outcomes:
  Turn order
  Attack hit / miss
  Damage
  Fortitude

When the player destroys all opponents, a new level is generated.

When the player loses all health, the game is over.



#h1Functional Specifications

The user enters a name and is presented with a choice of characters, each with certain stat advantages.
    Knight: Higher Strength
    Rogue: Higher Speed
    Ninja: Higher Dexterity
    Priest: Higher Fortitude
    Gambler: Higher Luck

The user is given a choice to enter the room (next level) or to rest (restore all health).

In the room a random number of enemies is populated and shown, each with random stats of
  Fortitude
  Strength
  Speed
  Dexterity

The order of turns is determined by each character's speed. That turn order is presented to the user.

On the player's turn, he may:
  Choose one opponent to attack, checking his dexterity against the opponents speed to determine a hit.
      If there's a hit, the player's strength is checked with his weapon and that value is removed
        from the opponent's vitality.
  Choose an item to use, which may:
      Increase vitality (health potion)
      Increase speed for a turn (speed potion)
      Etc
  Try to escape in desperation:
      Attack of opportunity for every remaining opponent

On the opponent's turn, it will:
  Attack the player, checking it's dexterity against the player's speed for a hit.
      On a hit, add strength to weapon and reduce the player's vitality for that much.

After a floor is cleared, loot is presented to the player on a random basis accounting for player's luck.
Loot consists of potions and new weapons.


Damage:
    Damage is calculated by rolling a random number between 1 and n, n being higher for better weapons.
        Poor: 1-6
        Decent: 1-8
        Good: 1-12
        Great: 1-16
        Awesome: 1-20
    That number is then multiplied by the character's strength score / 10.
    For example, a player with a strength of 5 who rolls an 8 will do 9 damage.
