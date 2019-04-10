import React, { Component } from 'react';

export default class MiniMap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            board: []
        };
    }
    componentWillMount = () => {

        // ----- tworzę pustą tablicę -----

        var empty = []
        for (var i = 0; i < this.props.length; i++) {
            empty[i] = []
            for (var j = 0; j < this.props.length; j++) {
                empty[i][j] = 0;
            }
        }
        this.addObstacles(empty);
    }

    // ----- wstawiam przeszkody do tablicy -----

    addObstacles = (array) => {
        this.props.coords.map((i, index) => {
            array[i.x][i.y] = 1;
        })
        this.setState({ board: array });
    }

    render() {

        var map = this.state.board.map((i, index) => { // tworzenie mini plansz
            var element = i.map((j, indexJ) => {
                var color= 'white'
                if(j=== 1) color= '#8f5b91';
                return <div style={{border:'1px solid black', boxSizing:"border-box", backgroundColor:color, width: 9/this.props.length+'vw', height:9/this.props.length+'vw',borderRadius: 2}} key={indexJ}></div>
            })
            return <div style={{ display: 'flex', flexDirection: 'row' }} key={index}  >{element}</div>
        })

        return (
            <div className='paramDiv' style={styles.container} >
                <div className='paramDiv' style={{display:'flex', flexDirection:'column', justifyContent:'center', border:'3px solid black'}}>{map}</div>
                <div style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
                    <p style={styles.name}> name : {this.props.name}</p>
                    <p style={styles.size}> size : {this.props.length}</p>
                    <button onClick={()=>{ this.props.start(this.props.length, this.props.coords) }} className='paramDiv' style={{ fontSize:'0.9vw',outline:'none',borderRadius: 50, color:'black', border:'2px solid black', backgroundColor:'#a8cd98', fontWeight:'bold', width: '10vw' }}>Start</button>
                </div>
                
            </div>
        );
    }
}
const styles={
    name:{fontSize: '1.8vw', margin: 0, fontWeight:'bold', textDecoration:'underline'},
    size:{fontSize: '1.2vw',color:'#8f5b91', fontWeight:'bold'},
    container:{display:'flex',backgroundImage: 'linear-gradient(to bottom, #313641, #2e333d, #2c303a, #292e36, #272b33, #262a31, #24282f, #23272d, #22272c, #22262b, #21262b, #21252a)', borderRadius:50, flexDirection:'row', justifyContent:'space-around', alignSelf:'center', marginTop: 30, border:'3px solid black', width:'75vw', padding: 10,}
}