# Traversée

Un poussin doit aller le plus loin possible sur un chemin sans fin fait de prairies, de routes et de rivières. Évite les voitures et les camions, saute de tronc en tronc sur l'eau, et ne traîne pas : l'écran avance tout seul.

*English version: [README.en.md](README.en.md)*

## Commandes

- **Flèches**, **ZQSD** ou **WASD** : un saut d'une case en avant, en arrière, à gauche ou à droite.
- **Clic** : saut vers le côté cliqué, par rapport au poussin.
- **P** : pause (quitter l'onglet met aussi en pause).
- Après une chute : une flèche, **Espace** ou un clic pour rejouer.

## Les rangées

- **Prairie** : un endroit sûr. Les arbres bloquent le passage ; il faut les contourner.
- **Route** : des voitures et des camions roulent dans un sens ou dans l'autre. Les toucher, c'est **« Écrasé ! »**.
- **Rivière** : des troncs flottent et t'emportent avec eux. Tomber à l'eau, c'est **« Plouf ! »** ; rester sur un tronc jusqu'au bord de l'écran, c'est **« Emporté ! »**.
- **L'écran avance** de lui-même, un peu plus vite au fil de la partie. S'il te rattrape, c'est **« Trop lent ! »**.

## Difficulté

Le chemin devient plus dur jusqu'à la rangée 160 : véhicules plus nombreux et plus rapides, troncs plus courts et plus rares, plus d'arbres. Chaque partie est différente.

## Score

Le score est la rangée la plus lointaine atteinte. Le record et le nombre de parties s'affichent à côté du jeu.

## Données et synchronisation

Record et nombre de parties sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Traversée → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
