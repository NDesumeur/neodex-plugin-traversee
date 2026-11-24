# Traversée (Crossing)

A chick has to get as far as possible along an endless path of meadows, roads and rivers. Dodge the cars and trucks, hop from log to log on the water, and don't hang about: the screen moves forward on its own.

*Version française : [README.md](README.md)*

## Characters and worlds (new in 1.2.0)

Eight characters, unlocked by your record. The first four cross the countryside; the others take you to their own world, with its grass, trees, roads, river and cars:
- **Robot** (100 rows): the future city, street lamps and neon cars.
- **Penguin** (150): the ice floe, snowy firs, ice plates and falling snow.
- **Ghost** (200): the graveyard at night, tombstones, swamp and fireflies.
- **Dino** (250): the jungle, palm trees and dirt paths.
- **Alien** (400): a distant planet, crystals and an acid river.

## Controls

- **Arrow keys**, **WASD** or **ZQSD**: hop one cell forward, back, left or right.
- **Click**: hop towards the side you click, relative to the chick.
- **P**: pause (leaving the tab also pauses).
- After a fall: an arrow key, **Space** or a click to play again.

## Rows

- **Meadow**: a safe place. Trees block the way; you have to go around them.
- **Road**: cars and trucks drive one way or the other. Touching one is **"Squashed!"**.
- **River**: logs float and carry you along. Falling in the water is **"Splash!"**; staying on a log until the edge of the screen is **"Swept away!"**.
- **The screen moves** by itself, a little faster as the game goes on. If it catches you, it is **"Too slow!"**.

## Difficulty

The path gets harder up to row 160: more and faster vehicles, shorter and fewer logs, more trees. Every game is different.

## Score

The score is the furthest row reached. The record and the number of games are shown next to the game.

## Data and sync

Your record and number of games are stored by NeoDex, backed up and synced between your PCs when sync is on.

## Install

In NeoDex: **NeoStore → Discover → Traversée → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).

## Full screen, characters and new terrains

- **Fits the screen**: the game grows with the window, from a small laptop to a big screen. The "FULL SCREEN" button puts it in full screen.
- **Characters to unlock**: the duck at a record of 25 rows, the rabbit at 50, the robot at 100. Pick one in the "CHARACTER" frame; locked ones are shown as shadows with the record to reach. A message tells you mid-game when you unlock one.
- **Railway** (from row 15): a very fast train passes now and then; the red light blinks when it comes.
- **Ice** (from row 30): it makes you slide sideways; don't get carried off the screen.
- **Lava** (from row 50): jump from stone to stone, like on the river logs.
