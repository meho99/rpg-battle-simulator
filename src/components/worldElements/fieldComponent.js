import * as THREE from 'three'
// ----- pojedyncze pole planszy -----


export default class Field {
  constructor(number, geometry) {
    this.number= number;
    this.geometry= geometry;
    this.bgColors= [0xffffff, 0xa8cd98, 0x8f5b91, 0x937366, 0x3d3b3b] // kolory tła

    this.makeField()
  }
  // ----- tworzenie pola planszy -----
  makeField = () => {
    var material = new THREE.MeshBasicMaterial({ color: this.bgColors[this.number]  });
    this.Cube = new THREE.Mesh(this.geometry, material);
  };

  // ----- zwracanie -----

  getCube = () => {
    
    return this.Cube
  }

  // render() {

  //   // ----- dynamiczne style pola -----

  //   let style={ color: 'black', width: 120/this.props.size+'vh',height:100/this.props.size+'vh', border: '2px solid', borderColor: this.state.borderColors[this.props.number], fontSize: 18, fontWeight: 'bold', borderRadius: 10,  textAlign:'center', backgroundColor: this.state.bgColors[this.props.number], boxSizing:'border-box', maxWidth:80/this.props.size+'vw', maxHeight:80/this.props.size+'vw'}
  //   let name= ''
  //   if(Number(this.props.name)!== 0)name= this.props.name // wyswietlanie nazwy 
  //   return (  
  //     <div style={style}
  //       onContextMenu={(e)=>{this.props.enterFunction(this.props.number, this.props.coords, 'shoot'); e.preventDefault()} }
  //       onMouseOut={()=>{this.props.outFunction()}}
  //       onMouseEnter={()=>{this.props.enterFunction(this.props.number, this.props.coords, 'walk')}}
  //       onClick={(e)=>{this.props.enterFunction(this.props.number, this.props.coords, 'click')}}
  //       >
  //     {name}

  //     </div>
  //   );
  // }
}
