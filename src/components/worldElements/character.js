import WorldElement from './worldElement'

// ----- postacie ------

export default class Character extends WorldElement {

    constructor(x, y, range, shootRange, name, tab, update, clickedPlayer, initative) {

        super(x, y, tab, update)

        this.range = range // zasieg postaci
        this.shootRange = shootRange // zasieg strzału postaci
        this.name = name // imie/ nazwa postaci
        this.clickedPlayer = clickedPlayer // kliknięcie w gracza
        this.initative= initative; // inicjatywa
        this.model= 1; // wersja modelu
        this.makeWorldElement({number: 3, name: this.name, model:this.model}) // wpisanie obiektu na miejscu w planszy
    }

    checkPosition = (x, y, action) => {
        if (this.x === Number(x) && this.y === Number(y)) {
            console.log('tu')

            this.showRange(action); // jesli najechalismy na pole gracza to pokazuje, ile moze sie ruszyc na mapie
            if (action === 'click') this.clickedPlayer(this) // jesli kliknelismy
        }
    }

    // ----- pokazanie, gdzie dana postac moze sie poruszyc -----

    showRange = (action) => { // chodzenie, lub  szczelanie(zasieg)
        var tabPom = [{ tab: this.boardTab, x: this.x, y: this.y }] // tavblica zawieracja miejsca na planszy, wokol ktorych postac moze isc 

        var around = (tab, number) => // szukanie wszystkich elementow wokol
        {
            var newTab = []; // pomocnicz tablica
            tab.forEach(el => {
                let x = el.x;
                let y = el.y;

                var putInArray = (x, y) => { // funkcja wypelniająca tablice miejscami (zasięg)
                    if (el.tab[x][y].number === 0 || ((el.tab[x][y].number === 4 || el.tab[x][y].number === 3) && number === 2)) {
                        el.tab[x][y].number = number;
                        newTab.push({ tab: this.boardTab, x: x, y: y })
                    }
                }

                if (y - 1 >= 0) {
                    //if (x - 1 >= 0) { putInArray(x - 1, y - 1)};
                    putInArray(x, y - 1);
                    //if (x + 1 < el.tab.length) { putInArray(x + 1, y - 1)}
                }
                if (y + 1 < el.tab.length) {
                    //if (x - 1 >= 0) { putInArray(x - 1, y + 1)};
                    putInArray(x, y + 1);
                    //if (x + 1 < el.tab.length) { putInArray(x + 1, y + 1)}
                }
                if (x - 1 >= 0) { putInArray(x - 1, y)}
                if (x + 1 < el.tab.length) { putInArray(x + 1, y)}

                tabPom = newTab;
            });
        }

        if (action === 'shoot') {
            for (let i = 0; i < this.shootRange; i++) { // pokazanie zasiegu strzekania
                around(tabPom, 2)
            }
        }
        else {
            for (let i = 0; i < this.range; i++) { // pokazanie zasiegu chodzenie
                around(tabPom, 1)
            }
        }

        this.boardUpdate(this.boardTab) // aktualizacja planszy
    }
}