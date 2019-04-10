// ----- elementy na planszy -----

export default class WorldElement {
    constructor(x, y, tab, update) {
        this.x = x;  // pozycje elementu
        this.y = y;
        this.boardTab = tab; // głowna tablica(plansza) gry
        this.boardUpdate = update // aktualizacja planszy 
    }

    // ----- tworzenie elementu -----

    makeWorldElement = (obj) => {
        let tab = this.boardTab;
        tab[this.x][this.y]= obj; // zajecie pola w tablicy
        this.boardTab = tab
        this.boardUpdate(this.boardTab) // aktualizacja planszy
    }

    // ----- usunięcie elementu -----

    delete = () => {
        let tab = this.boardTab;
        tab[this.x][this.y]= {number: 0}; // usunięcie z tablicy tablicy
        this.boardTab = tab
        this.boardUpdate(this.boardTab) // aktualizacja planszy
    }

    // ----- edycja elementu -----

    editParams = (param, value) => {
        if (param === 'x' || param === 'y') { // edycja pozycji gracza
            if(Number(value) >= 0 && Number(value) < this.boardTab.length )
            {
                let tab = this.boardTab;
                tab[this.x][this.y] = {number: 0}; //usuniecie gracza z poprzedniego pola
                this[param] = Number(value); // zmiana parametru
                tab[this.x][this.y] = {number: 3, name: this.name}; // zajecie nowego pola w tablicy
                this.boardTab = tab
                this.boardUpdate(this.boardTab) // aktualizacja planszy 
            }
            
        }
        else // edycja pozostałých parametrow
            this[param] = value;
    }
}
