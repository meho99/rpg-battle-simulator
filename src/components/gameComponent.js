import React, { Component } from 'react';
import Character from './worldElements/character' // gracz
import StartPage from './startPage/startPage' // strona startowa
import Obstacle from './worldElements/obstacle' // przeszkoda
//import Field from './worldElements/fieldComponent' // pojedyncze pole planszy
import PlayerEdit from './playerEditComponent' // component edycji
import FirebaseAdd from './firebaseAdd' // dodawanie planszy do bazy

import ThreeContainer from './threejs/threeBoard'

export default class Game extends Component {
    constructor(props) {
        super(props);

        this.state = {
            boardTab: [], // tablica (plansza)
            boardSize: 0, // wielkosc planszy
            clickedPlayer: '', // akualny klikniety gracz
            name: '',
            obstaclesType: 'nature'// wygląd przeszkód
        };
        this.playerstab = [] // tablica zawierajaca wsyztskich dodanych graczy
        this.obstacleTab = [] // tablica z przeszkodami

    }

    componentWillMount = () => {

    }

    // ----- stworzenie pustej tablicy(planszy) -----

    makeEmptyBoard = (name) => {
        var emptyboard = []

        for (var i = 0; i < this.state.boardSize; i++) {
            emptyboard[i] = [];
            for (var j = 0; j < this.state.boardSize; j++) {
                emptyboard[i][j] = { number: 0, name: 0 };
            }
        }
        this.setState({ [name]: [...emptyboard] })
        return emptyboard;
    }


    // ----- start gry -----

    start = async (size, coords, obstacles) => {
        await this.setState({ boardSize: size }, async () => {
            this.makeEmptyBoard("boardTab");

        })
        coords.map((i) => {
            this.obstacleTab.push(new Obstacle(i.x, i.y, this.state.boardTab, this.boardUpdate, this.setClickedPlayer))
        })
        if(obstacles)
            this.setState({obstaclesType: obstacles})

    }

    // ----- aktualizacja planszy -----

    boardUpdate = (tab) => {
        this.setState({ boardTab: tab }); // aktualizacja pozycji elementow na planszy
        this.updateNames()// aktualizacja danych(m.in imion)
    }

    // ----- aktualizacja imion i modeli -----

    updateNames = () => {
        let tabpom = this.state.boardTab;
        var update = (tab) => {
            tab.forEach((player, index) =>  // wywoluje funkcje sprawdzajaca dla wsyztskich graczy
            {
                tabpom[player.x][player.y].name = player.name;
                tabpom[player.x][player.y].model = player.model;
            })
        }
        update(this.playerstab)
        update(this.obstacleTab)
        this.setState({ boardTab: tabpom })
    }

    // ----- zmiana nazwy planszy -----

    changeName = (e) => {
        this.setState({ name: e.target.value });
    }

    // ----- dodanie gracza po kliknięciu -----

    addPlayer = () => {

        let randomX = 0;
        let randomY = 0;
        let stop = false;
        do {
            if (this.state.boardTab[randomX][randomY].number === 0) // jesli pole jest zajęte dajemy go o jdno pole niżej
            {
                stop = true;
                this.playerstab.push(new Character(randomX, randomY, 4, 6, this.playerstab.length + 1, this.state.boardTab, this.boardUpdate, this.setClickedPlayer, 0));
            }
            else {
                if (randomX === this.state.boardSize - 1) {
                    randomY++
                    randomX = 0;
                }
                else randomX++;
            }

        }
        while (!stop)
    }

    // ----- dodanie przeszkody po kliknięciu -----

    addObstacle = () => {

        let randomX = parseInt(this.state.boardSize / 2 - 2)
        let randomY = 0
        let stop = false;
        do {
            if (this.state.boardTab[randomX][randomY].number === 0) // jesli pole jest zajęte dajemy go o jdno pole niżej
            {
                stop = true;
                this.obstacleTab.push(new Obstacle(randomX, randomY, this.state.boardTab, this.boardUpdate, this.setClickedPlayer))
            }
            else {
                if (randomY === this.state.boardSize - 1) {
                    randomX++;
                    randomY = 0;
                }
                else randomY++;
            }

        }
        while (!stop)

    }

    // ----- usunięcie gracza ----

    deletePlayerFromArr = (player, tab) => { // szuklanie gracza do usuniecia 
        tab.map((i, index) => {
            if (player === i)
                tab.splice(index, 1) // usniecie z tablicy
        })
    }

    // ----- upewnienie się, że każdy gracz jest na swoim miejscu -----

    check = () => {
        let tab = this.state.boardTab;
        this.playerstab.forEach((player, index) =>  // wywoluje funkcje sprawdzajaca dla wsyztskich graczy
            tab[player.x][player.y] = { number: 3, name: player.name, model: player.model })
        this.obstacleTab.forEach((element, index) =>  // wywoluje funkcje sprawdzajaca dla wsyztskich przeszkód
            tab[element.x][element.y] = { number: 4, name: element.name, model: element.model })
        this.setState({ boardTab: tab })
    }

    // ----- nadanie aktualnego gracza/ przeszkody -----

    setClickedPlayer = (player) => {
        this.setState({ clickedPlayer: player })
    }

    // ----- akcja po najechaniu/ kliknieciu na postać

    getPlayerByTabIndex = (number, coords, action) => {

        if (this.state.clickedPlayer) { // jeśli zaznaczony jest gracz to po kliknięciu na odpowiednie pole tam przechodzi
            if (action === 'click') {
                if (Number(number) === 1) {
                    this.state.clickedPlayer.editParams('x', coords[0]); // aktualizacja pozycji gracza
                    this.state.clickedPlayer.editParams('y', coords[1]);
                    this.check();
                    this.setState({ clickedPlayer: '' })
                }
                else {
                    this.setState({ clickedPlayer: '' }) // wyczyszczenie planszy i kliknietego gracza
                    this.clearPlayground();
                }
            }
            else if (action === 'shoot') { // wyczyszczenie planszy i kliknietego gracza
                this.setState({ clickedPlayer: '' })
                this.clearPlayground();
            }
        }
        if (Number(number) === 3) // jesli w danym miejscu znajduje sie jakas postac
        {
            if (action === 'shoot' || !this.state.clickedPlayer) {
                this.clearPlayground();
                this.setState({ clickedPlayer: '' })
                this.playerstab.forEach((player, index) => { // wywoluje funkcje sprawdzajaca dla wsyztskich graczy
                    player.checkPosition(coords[0], coords[1], action)
                })
                this.check();
            }
        }
        if (Number(number) === 4) // jesli w danym miejscu znajduje sie jakas przeszkoda
        {
            if (action !== 'walk') {
                this.clearPlayground();
                this.setState({ clickedPlayer: '' })
                this.obstacleTab.forEach((element, index) => { // wywoluje funkcje sprawdzajaca dla wsyztskich graczy
                    element.checkPosition(coords[0], coords[1], action, this.deletePlayerFromArr, this.obstacleTab)
                })
            }

        }
    }

    // ----- dodanie planszy do bazy danych ------

    addToDataBase = () => {
        var coords = this.obstacleTab.map((i, index) => { // edycja danych
            var x = i.x;
            var y = i.y
            return { x, y }
        })
        FirebaseAdd(this.state.boardSize, coords, this.state.name, this.state.obstaclesType)
    }

    // ----- czyszczenie planszy z pokazywania zasiegu gracza -----

    clearPlayground = () => {
        var tabPom = this.state.boardTab;
        for (var i = 0; i < tabPom.length; i++) {
            for (var j = 0; j < tabPom[i].length; j++) {
                if (tabPom[i][j].number === 1 || tabPom[i][j].number === 2) tabPom[i][j] = { number: 0 }
            }
        }
        if (!this.state.clickedPlayer) this.boardUpdate(tabPom)
    }

    // ----- zamiana wyglądu przeszkód -----

    changeObstaclesType = (element) => {
        this.setState({ obstaclesType: element.target.value })
    }


    render() {

        // ----- ustawienia po prawej stronie
        var playerEdition = this.playerstab.map((i, index) => {
            i.bColor = 'black';
            if (i === this.state.clickedPlayer) i.bColor = '#8f5b91'; // zaznaczenie gracza
            return <PlayerEdit key={index} delete={() => { i.delete(); this.deletePlayerFromArr(i, this.playerstab) }} model={i.model} change={i.editParams} update={() => this.setState({})} name={i.name} x={i.x} y={i.y} range={i.range} shootRange={i.shootRange} bColor={i.bColor} initative={i.initative} />
        })

        return (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{ width: '100vw', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
                    {
                        // ---------- strona startowa lub plansza (renderowanie warunkowe) ----------

                        this.state.boardTab.length === 0
                            ?
                            <div>

                                <StartPage start={this.start} />

                            </div>
                            :
                            <div style={{ display: 'flex', flexDirection: 'column', width: '85vw', alignItems: 'center' }}>

                                <ThreeContainer board={this.state.boardTab} getPlayerByTabIndex={this.getPlayerByTabIndex} outFunction={this.clearPlayground} obstaclesType={this.state.obstaclesType} />

                            </div>
                    }

                </div>
                <div style={{ width: '15vw', textAlign: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                    {
                        // ---------- renderowanie warunkowe formularzy edycji -----------

                        this.state.boardTab.length === 0
                            ?
                            <div> </div>
                            :

                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>

                                    <button className='paramDiv' style={{ borderRadius: 20, backgroundColor: '#0e1111', border: '2px solid #8f5b91', color: 'white', fontSize: 20, outline: 'none' }} onClick={this.addPlayer}> + Player </button>
                                    <button className='paramDiv' style={{ borderRadius: 20, backgroundColor: '#0e1111', border: '2px solid #8f5b91', color: 'white', fontSize: 20, outline: 'none' }} onClick={this.addObstacle}> + Obstacle </button>

                                </div>

                                <div style={{ marginTop: 20, fontWeight: 'bold', color: '#8f5b91', fontSize: 22 }}>
                                    Obstacles :
                                    <select className='paramDiv' value={this.state.obstaclesType} onChange={this.changeObstaclesType} style={{ marginLeft: 10, border: '2px solid black', fontSize: 18, outline: 'none', borderRadius: 20, backgroundColor: 'white', color: '#8f5b91' }}>
                                        <option value='nature'>nature</option>
                                        <option value='walls'>walls</option>
                                    </select>
                                </div>

                                <button className='paramDiv' style={{ marginTop: 10, fontWeight: 'bold', color: '#8f5b91', outline: 'none', padding: 6, backgroundColor: 'white', border: '2px solid black', borderRadius: 20 }} onClick={() => { // sortowanie graczy po inicjatywie
                                    this.playerstab.sort(dynamicSort('-initative')); this.setState({})
                                }}> S O R T  </button>


                                {playerEdition}



                                <div style={{ marginTop: 20, borderTop: '2px solid white' }} >
                                    <label style={{ fontWeight: 'bold', color: '#8f5b91', fontSize: 25, margin: 10 }}>board name :<input type='text' onChange={this.changeName} value={this.state.name} className='paramDiv' style={{ border: '2px solid black', color: '#8f5b91', textAlign: 'center', fontWeight: 'bold', fontSize: 20, borderRadius: 50, width: '9vw' }} /></label>
                                    <button className='paramDiv' style={{ backgroundColor: '#8f5b91', border: '2px solid black', outline: 'none', marginTop: 20, borderRadius: 20, fontSize: 18 }} onClick={this.addToDataBase}> Add To Database </button>
                                </div>

                            </div>
                    }
                </div>
            </div>
        );
    }
}

// ---------- function for dynamic sorting ----------

function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        var result = (Number(a[property]) < Number(b[property])) ? -1 : (Number(a[property]) > Number(b[property])) ? 1 : 0;
        return result * sortOrder;
    }
}