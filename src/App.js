import React from 'react';
import logo from './logo.svg';
import './App.css';
import {ethers} from 'ethers'
const ipfs = require('ipfs')
const node= new ipfs()
//SETUP for ethers
const id_user=0;
const privatekeySelectUserId=""
const contractAddress="0x4b9715976a6AB1AED7Ea73BD9181C02DEc0DB5B8"
const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
var truffleFile= require('./contracts/epinglage.json')
var contractABI = truffleFile['abi']
var bytcode = truffleFile['bytcode']

let ContratEpingle=new ethers.Contract(contractAddress, contractABI, provider)
let ContratEpingleSigner=ContratEpingle.connect(provider.getSigner(id_user))

//Verifier IPFS est pret
node.on('ready',()=>{
  console.log('bastard')
  //afficher les noeuds fournis par la lib ipfs
  console.log(node.swarm.addrs())
})


//classe MenuEpingle
class MenuEpingle extends React.Component{
  constructor(props){
    super(props)
    this.state={
      data:[]
    }
    this.chargerImage=this.chargerImage.bind(this)
    this.handleInput=this.handleInput.bind(this)
  }
  chargerImage(){
    console.log("bam")
    let doc=document.getElementById("fichier").files[0]
    const reader = new FileReader();
    //reader.readAsBinaryString(doc)
    reader.readAsArrayBuffer(doc)
    var self=this;
    reader.onloadend=function(){
      console.log('fichier charge',reader.result)
      let r=ipfs.Buffer.from(reader.result)
      console.log('r',r)
      node.add(r).then(function(hash){
        //retourne le hash du fichier
        console.log("ajouté",hash)
        let h= self.state.data
        h.push(hash)
        self.setState({data:h})
      })
    }
  }
  handleInput(){
    console.log("yo")
    this.chargerImage()
  }

  //finir la transaction apres remise du fichier et au moment de la commande pin
  // retrouver le fichier et l'afficher

  render(){
    return(
      <div>
        <input type="file" onChange={this.handleInput} id="fichier"></input>
        <button onClick={this.chargerImage}>Add Document</button>
        <button onClick={this.pinImage}>Pin Document</button>
        <ListeEpingle data={this.state.data}/>
      </div>
    )
  }
}

//class ListeEpingle
class ListeEpingle extends React.Component{
  render(props){
    console.log("liste epingle", this.props.data)
    var items=[]
    this.props.data.forEach((x,i)=>{
      console.log(x,i)
      items.push(
        <Epingle hash={x[0].hash} size={x[0].size} key={i}/>
      )
    })
    return(
      <div>
      {items}
      </div>
    )
  }
}


// class Epingle pour chaque ligne
class Epingle extends React.Component{
  constructor(props){
    super(props)
    // this.state={hash:'',size:0}
    this.pin=this.pin.bind(this)
  }

  pin(props){
    console.log("pin",this.props)
    let h=this.props.hash
    let val=1*10**16
    // let tax=this.state.prix*0.02
    let v=val.toString()
    console.log("val",v)
    let va=ethers.utils.formatEther(v)
    console.log("va",va)
    let overrides={
      value:ethers.utils.parseEther(va),
      gasLimit: 500000,
    }
    console.log(h)
    ContratEpingleSigner.payerStockage(h,overrides)

  }

  render(props){
    return(
      <div>
        {this.props.hash} - {this.props.size}
        <button onClick={this.pin}>Pin File</button>
      </div>
    )
  }
}

//Main function
function App() {
  return (
    <div className="App">
      <MenuEpingle />
    </div>
  );
}

export default App;
