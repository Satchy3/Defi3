import React from 'react';
import logo from './logo.svg';
import './App.css';
import {ethers} from 'ethers'
const ipfs = require('ipfs')
const node= new ipfs({ repo: './ipfs/data' })
//SETUP for ethers
const id_user=0;
const privatekeySelectUserId=""
const contractAddress="0x57785681d3b1F7f3A65913d47DBa1a51b107fc61"
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
  node.repo.stat((err, stats) => console.log("stats",stats))

})


//classe MenuEpingle
class MenuEpingle extends React.Component{
  constructor(props){
    super(props)
    this.state={
      data:[],
      items:[]
    }
    this.chargerImage=this.chargerImage.bind(this)
    this.handleInput=this.handleInput.bind(this)
    this.pinSet=this.pinSet.bind(this)
    this.listPin=this.listPin.bind(this)
    this.listPin()
  }
  chargerImage(){

    let doc=document.getElementById("fichier").files[0]
    console.log("bam",doc)
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

  componentDidMount(){
    console.log("mounted")
    this.pinSet()
  }
  listPin(){
    var self=this
    var items=[]
    console.log("listpin")
      node.on('ready',function(){
        node.pin.ls(function (err, pinset) {
          if (err) {throw err}
          console.log("pinset",pinset)
          pinset.forEach((x,i)=>{
            console.log("item pinset",x)
            if (x.type!="indirect"){items.push(
              <Pin hash={x.hash} key={i}/>
            )
          }})
          self.setState({items:items})
          return items
        })
      })

  }
  pinSet(){

    var self=this
    var items=[]

    node.pin.ls(function (err, pinset) {
      if (err) {throw err}

      console.log("pinset",pinset)

      pinset.forEach((x,i)=>{
        console.log("item pinset",x)
        if (x.type!="indirect"){items.push(
          <Pin hash={x.hash} key={i}/>
        )
      }})
      self.setState({items:items})
      return items
    })
  }

  render(){
    //let items=this.pinSet()
    //console.log("render pinset",items)
    //this.setState({items:items})
    return(
      <div>
        Epingler un fichier png <input type="file" onChange={this.handleInput} id="fichier"></input>
        <button onClick={this.chargerImage}>Add Document</button>
        <button onClick={this.pinSet}>Rafraichir liste des fichiers epingles</button>
        <ListeEpingle data={this.state.data}/>
        {this.state.items}
        <DisplayImage />
      </div>
    )
  }
}

class Pin extends React.Component{
  constructor(props){
    super(props)
    this.state={hash:''}
    this.getpin=this.getpin.bind(this)
    this.getpinImage=this.getpinImage.bind(this)
  }
  getpin(props){
    console.log("getpin",this.props)
    node.get(this.props.hash, function (err, files) {
      files.forEach((file) => {
          console.log("path",file.path)
          console.log("content",file.content.toString('utf8'))
      })
    })
  }

  getpinImage(props){
    function bufferToBase64(buf) {
        var binstr = Array.prototype.map.call(buf, function (ch) {
            return String.fromCharCode(ch);
        }).join('');
        return btoa(binstr);
    }
    console.log("getpinImage",this.props)
    node.cat(this.props.hash, function (err, file) {
          console.log("path",file)
          var blob = new Blob( [ file ], { type: "image/jpeg" } );
          var urlCreator = window.URL || window.webkitURL;
          var imageUrl = urlCreator.createObjectURL( blob );
          var img = document.querySelector( "#design_display" );
          img.src = imageUrl;
    })

  }
  render(props){
    return(
      <div>
        Pinned : {this.props.hash}
        <button onClick={this.getpin}> GET RAW FILE</button>
        <button onClick={this.getpinImage}> DISPLAY IMAGE</button>
      </div>
    )
  }
}

class DisplayImage extends React.Component{
  render(){
    return(
      <div>
      <img id="design_display" src=""/>
      </div>
    )
  }

}
//class ListeEpingle = elements deja epingles
class ListeEpingle extends React.Component{
  render(props){
    console.log("liste epingle", this.props.data)
    var items=[]
    this.props.data.forEach((x,i)=>{
      console.log("Liste Epingle",x,i)
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


// class Epingle pour chaque ligne de la ListeEpingle
class Epingle extends React.Component{
  constructor(props){
    super(props)
    // this.state={hash:'',size:0}
    this.pin=this.pin.bind(this)
  }

  pin(props){
    console.log("pin",this.props)
    let h=this.props.hash

    //Payer l'epinglage
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
    ContratEpingleSigner.payerStockage(h,overrides).then(function(){
    node.pin.add(h,function(err){
      console.log(err)
    })
    })

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
