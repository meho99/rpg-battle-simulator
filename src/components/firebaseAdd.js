
import fb from '../firebase-connection' // podłączenie firebase
import 'firebase/firestore'

const db = fb.firestore();

// ----- dodawanie danych do firebase -----

const FirebaseAdd = (length, coords,name)=>{
    var obstacles = db.collection('obstacles');
    if(coords.length===0) alert('Board is empty !!')
    else if(name.length===0) alert('Name is empty !!')
    else{
        try{
            obstacles.add({
                length: length,
                name:name,
                coords: coords,
                
            })
            alert('Board added to database')
        }
        catch(err)
        {
            alert(err)
        }
    }
}
export default FirebaseAdd