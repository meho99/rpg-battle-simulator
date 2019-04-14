import React, { Component } from 'react';
import fb from '../../firebase-connection' // podłączenie firebase
import 'firebase/firestore'
import MiniMap from './miniMap'

const db = fb.firestore();



export default class StartPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maps: [],
            boardSize: 25
        };
    }
    componentWillMount = async () => {
        // ----- pobieranie danych z firebase -----

        var obstacles = db.collection('obstacles');
        obstacles.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                this.con(doc.data())
            });
        });
    }
    // ----- wstawianie danych do state -----

    con = (data) => {
        let arr = this.state.maps;
        arr.push({
            name: data.name,
            coords: data.coords,
            length: data.length,
            obstacles: data.obstacles
        })
        this.setState({ maps: arr })
    }

    // ----- zmiana rozmiaru planszy -----
    changeSize = (e) => {
        this.setState({ boardSize: e.target.value });
    }

    render() {
        // ----- tworze miniaturki plansz -----
        var miniMaps = this.state.maps.map((i, index) => {
            return <MiniMap start={this.props.start} length={i.length} key={index} coords={i.coords} name={i.name} obstacles={i.obstacles} />
        })

        return (
            <div style={{ width: '100vw', display: 'flex', flexDirection: 'column' }}>
                <h1 style={{color: '#a8cd98', fontWeight: 'bold', textDecorationColor: 'black', fontSize: '4vw', textDecoration:'underline' }}>Rpg battle simulatoR</h1>
                <h1 style={styles.h1} >Create your board :</h1>
                <div>
                    <label style={{fontWeight:'bold', color: '#8f5b91', fontSize: '1.5vw', margin: 10}}>board size:<input type='number' max={35} min={5} onChange={this.changeSize} value={this.state.boardSize} className='paramDiv' style={{ border:'2px solid black', color: '#8f5b91', textAlign: 'center', fontWeight: 'bold',fontSize:'0.9vw', borderRadius: 50, width: '8vw', outline:'none'  }} /></label>
                    <button onClick={() => { this.props.start(this.state.boardSize,[]) }} className='paramDiv'  style={{ borderRadius: 50,outline:'none', fontSize:'0.9vw', color:'black', border:'2px solid black', backgroundColor:'#a8cd98', fontWeight:'bold', width: '10vw' }} >Start</button>
                </div>

                <h1 style={styles.h1}>Or choose one of these : </h1>
                <div style={{display:'flex', flexWrap:'wrap', justifyContent:'space-around'}}> 
                    {miniMaps}
                </div>
                
            </div>
        );
    }
}
const styles = {
    h1: { fontSize: '2vw', }
}
