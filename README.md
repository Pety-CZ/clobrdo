# Člověče, nezlob se!
Toto je práce pro splnění zápočtu z předmětu WWWAP2024.

# Původní návrh aplikace
Snaha je o vytvoření hry *Člověče, nezlob se*:
 - v JS, který bude obstarávat funkčnost hry
 - pro až 4 hráče
 - hráči budou posouvat figurkami pomocí myši
 - logika vyhodnocování hry závisí výhradně na hráčích
  - figurky se budou ukládat do lokální DB


# Popis aplikace z pohledu uživatele
Hra je určená pro 2-4 hráče, kteří mají možnost vybrat si barvu figurek (modrá, červené, žlutá a zelená). Hráči mají možnost načíst předchozí rozehranou hru.

Hráči poté hodí kostkou tak, že na ní kliknou. Pozadí kostky je podbarvené, aby hráči neztratili přehled o tom, kdo je na tahu. Pozadí změní barvu po každém posunití figurky (pokud na kostce nepadne hodnota **6**).

Hráči mohou figurky posunout **myší** (hra na dotokovou obrazovku není uzpůsobena) pouze na šedá políčka a do vlastního domečku. Pokud hráč figurku poprvé poliži na hrací pole, figurka se automaticky přesuno na startovací políčko. 

Pokud hráč umístí figurku na políčko, na kterém už nějaká figurka stojí, hra vykopne původní figurku a vrátí ji zpět ke hráči.
### Usecase diagram:

![usecasediagram](UseCaseDiagram.svg)


# Technická Specifikace
### Objekty
Objet | Popis
----------|-----
Main | Objekt, který inicializuje ostatní objekty
GameEngine | Hlavní objekt, který obstarává herní logiku
Board | Udržuje informace o rozložení hracího pole a jeho velikosti
Fig | Figurka, komu patří, její souřadnice (x,y), barva...
Dice | Kostka
DB | Čtení a zápis do databáze

### Class diagram
![classdiagram](ClassDiagram.svg)

<https://github.com/Pety-CZ/clobrdo>

<https://clobrdo.petrn.online/>
