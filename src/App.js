import React,{Component} from 'react';
import Particles from 'react-particles-js';
import './App.css';
import Navigation from './components/Navigation/Navigation.js'
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';

import Sigin from './components/Sigin/Sigin';
import Register from './components/Register/Register';








const particlesOptions={
               particles: {
                  number:{
                    value:300,
                    density:{
                      enable:true,
                      value_area:2000
                    }
                    
                  },
                  move:{enable:true,
                         speed:4,
                         direction:'top-left',
                         random:false,
                         straight:false,
                         out_mode:'out',
                         bounce:false,
                         attract:{enable:false,
                          rotateX:600,
                          rotateY:1200
                                 }
                        },

                  interactivity: {
                     detect_on: 'canvas',

                     events: {
                    onhover: { enable: true, mode: 'grab' },
                     onclick: { enable: true, mode: 'push' },
                     resize: true
                    }
                  }
    


                  }

                }

const initialState={

      input:'',
      imgurl:'',
      box:{},
      route:'Signin',
      isSignedIn:false,

      user:{
         id:'',
         name:'',
         email:'',
         entries:0,
         joined:''
      }
}                

             

class App extends Component {
  constructor(){
    super();
    this.state={
      input:'',
      imgurl:'',
      box:{},
      route:'Signin',
      isSignedIn:false,

      user:{
         id:'',
         name:'',
         email:'',
         entries:0,
         joined:''
      }
    }
  }
  loaduser=(data)=>{
    this.setState({user:{
      id:data.id,
    name:data.name,
    email:data.email,
   
    entries:data.entries,
    joined:data.joined
    }})
  }
 

  calculateFaceLocation=(data)=>{
   const clarifaiFace= data.outputs[0].data.regions[0].region_info.bounding_box ;
   const img=document.getElementById('inputimage');
   const width=Number(img.width);
   const height=Number(img.height);
   return{
    leftCol:clarifaiFace.left_col * width,
    topRow:clarifaiFace.top_row * height,
    rightCol:width-(clarifaiFace.right_col * width),
    bottomRow:height-(clarifaiFace.bottom_row * height)
   }
 
  }
  displayFaceBox=(box)=>{
    
    this.setState({box:box});
  }
  onInputChange =(event)=> {

    this.setState({input: event.target.value});
  }

  onClickChange = ()  => {

   this.setState({imgurl:this.state.input});
  fetch('https://fathomless-sierra-52069.herokuapp.com/imageurl',{
        method: 'post',
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify({
        input: this.state.input
      })
    }) 
     .then(response =>response.json())
     .then(response=>{
    if(response){
  fetch(' https://fathomless-sierra-52069.herokuapp.com/image',{
        method: 'PUT',
      headers:{'Content-Type': 'application/json'},
      body:JSON.stringify({
        id: this.state.user.id
      })
    }) .then(response => response.json())
       .then(count => {
              this.setState(Object.assign(this.state.user,{entries:count}))
              })
            .catch(console.log)
           
    
    
  }

    this.displayFaceBox(this.calculateFaceLocation(response))
  })
    .catch(err=>console.log(err));  
}
onRouteChange=(route)=>
{
  if(route==='signout'){
  this.setState(initialState)
}
else if(route==='home'){
  this.setState({isSignedIn:true})
}
this.setState({route:route});
}

  render()
   {
    const{isSignedIn,imgurl,route,box}=this.state;
     return (
       <div className="App">
       <Particles className='particles'
              params={particlesOptions}
             
            />
         <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
         { route === 'home'
         ?<div>

        <Logo/>
        <Rank name={this.state.user.name}
              entries={this.state.user.entries}

        />
       
         <ImageLinkForm onInputChange={this.onInputChange}
                        onClickChange={this.onClickChange}
                        />
          
         <FaceRecognition box={box} imgurl={imgurl}/>
       </div>
         
        
         :(
    
route==='Signin'
?
 <Sigin loaduser={this.loaduser} onRouteChange={this.onRouteChange} />
 :<Register loaduser={this.loaduser} onRouteChange={this.onRouteChange} /> 
          )

           
        
     }

   
       </div>
   
            );
   }
}

export default App;
