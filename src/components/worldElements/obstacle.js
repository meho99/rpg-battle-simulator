import WorldElement from './worldElement'

// ----- przeszkody -----

export default class Obstacle extends WorldElement {
    constructor(x, y, tab, update, clicked) {

        super(x, y, tab, update)
        this.clicked = clicked // nadanie aktualnie klikniętego elementu
        this.name='obstacle'
        this.model= Math.floor(Math.random()*4)+1; // wersja modelu
        this.makeWorldElement({number: 4, name: this.name, model:this.model}) // wpisanie obiektu na miejscu w planszy
    }

    // ----- sprawdzenie pozycji -----

    checkPosition = (x, y, action, deleteFromArr, tab) => { 
        if (this.x === x && this.y === y) {
            if(action === 'click') // przeniesienie
            {
                this.showRange();
                this.clicked(this);
            }
            else if(action === 'shoot') // usuniecie
             {
                this.delete();
                deleteFromArr(this, tab)
             }   
        }
    }

    // ----- pokazanie zasięgu(cała plansza) -----

    showRange = () => { 
        for (var i = 0; i < this.boardTab.length; i++) {
            for (var j = 0; j < this.boardTab[i].length; j++) {
                if(Number(this.boardTab[i][j].number) === 0)
                    this.boardTab[i][j].number = 1;
            }
        }
        this.boardUpdate(this.boardTab) // aktualizacja planszy
    }

}