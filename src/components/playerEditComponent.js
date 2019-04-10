// ----- formularze do edycji -----
import React, { Component } from 'react';

// grafiki
import background from '../assets/tlo.png'
import bow from '../assets/luk.png'
import Shoe from '../assets/but.png'
import initative from '../assets/kunik.png'
import ximage from '../assets/X.png'
import yimage from '../assets/Y.png'
import modelimage from '../assets/model.png'

export default class playerEdit extends Component {

    changeParams = (e) => {

        this.props.change(e.target.name, e.target.value) // zmiana obiektu gracza
        this.props.update(); // pewna aktualizacja komponentow
    }

    render() {
        return (
            <div className='paramDiv' style={{
                borderRadius: 20, textAlign: 'center', width: '95%', border: '4px solid black', margin: '0 auto', boxSizing: 'borer-box',
                borderColor: this.props.bColor, color: 'black', marginTop: window.innerWidth * 1 / 150, display: 'flex', flexDirection: 'column', backgroundImage: 'url(' + background + ')', alignContent: 'space-around',
            }
            }>
                <div style={styles.param}> <input name='name' type='text' value={this.props.name} onChange={this.changeParams} style={styles.name} />
                    <button style={{borderRadius:10, backgroundColor:'#8f5b91', border:'3px solid black'}} onClick={this.props.delete}><img src={ximage} style={{width:'1vw', marginTop:2}} alt='x' /></button>
                </div>
                <div style={styles.twoElems}>
                    <div style={styles.param}><img src={ximage} style={styles.icons} alt='x' /> <input name='y' type='number' value={this.props.y} onChange={this.changeParams} style={styles.input} /></div>
                    <div style={styles.param}><img src={yimage} style={styles.icons} alt='Y' /><input name='x' type='number' value={this.props.x} onChange={this.changeParams} style={styles.input} /></div>
                </div>
                <div style={styles.twoElems}>
                    <div style={styles.param}><img src={Shoe} style={styles.icons} alt='but' /> <input name='range' type='number' value={this.props.range} onChange={this.changeParams} style={styles.input} /></div>
                    <div style={styles.param}><img src={bow} style={styles.icons} alt='luk' />  <input name='shootRange' type='number' value={this.props.shootRange} onChange={this.changeParams} style={styles.input} /></div>
                </div>
                <div style={styles.twoElems}>
                    <div style={styles.param}><img src={modelimage} style={styles.icons} alt='model' />  <input name='model' type='number' value={this.props.model} onChange={this.changeParams} style={styles.input} /></div>
                    <div style={styles.param}><img src={initative} style={styles.icons} alt='butkun' /> <input name='initative' type='number' value={this.props.initative} onChange={this.changeParams} style={styles.input} /></div>

                </div>

            </div >
        );
    }
}
const styles = {
    input: { textAlign: 'center', outline:'none', borderRadius: 50, border: 'none', width: '85%', background: 'none', color: 'black', height: 30, fontSize: 14, fontWeight: 'bold' },
    name: { textAlign: 'center', outline:'none', textDecoration: 'underline', border: 'none', width: '100%', fontWeight: 'bolder', fontSize: 25, background: 'none', color: 'black' },
    icons: { width: '1.8vw', height: '1.6vw' },
    twoElems: { display: 'flex', flexDirection: 'row' },
    param: { display: 'flex', justifyContent: 'space-around', alignItems: 'center', border: '1px solid', borderRadius: 2 }

}
