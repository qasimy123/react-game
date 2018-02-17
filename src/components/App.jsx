import  React, {Component} from "react";
import "../assets/index.css";
import ReactAudioPlayer from 'react-audio-player';
import song1 from "../assets/song.wav";
import song2 from "../assets/song2.wav";
import song3 from "../assets/sound3.mp3";
import song4 from "../assets/sound4.mp3";
import {debounce,clamp,throttle} from "lodash";
import {setXP,createLevel,setLevel,setWeapon,setHealth,changeThing, changePlayerPos, setEnemyHealth} from "../actions.js"

import {batchActions} from 'redux-batched-actions';

class App extends Component {
    
    constructor(props){
        super(props);
        
        this.state = {
            newGame:true,
            currEnemy:{},
            viewportHeight:0,
            viewportWidth:0,
            currSong:"",
            songs:[song3,song2,song1,song4],
            win:{display:"none"}
            
        };
        
        //https://codepen.io/thepeted/pen/aNrdzP
        
        
        // viewport logic is not my own
		this.VP_HEIGHT_OFFSET = 25; // in ems to match elements above this component
		this.VP_MINIMUM_HEIGHT = 22; // in ems
		// set ratios for determining the viewport size
		this.VP_WIDTH_RATIO = 30;
		this.VP_HEIGHT_RATIO = 21;
        this.handleResize=this.handleResize.bind(this)
        this.keydown = this.keydown.bind(this)
    }
    
    playerInput = (vector,direction)=>{
        
        let state = this.props.store.getState().createBoard;
        let info = this.props.store.getState().playerSystem;
        const [x,y] = state.playerPos;
        const [vectorX, vectorY] = vector;
        const newPos = [vectorX + x, vectorY+y];
        //const newPlayer = state.things[y][x];
        const destination = state.things[y + vectorY][x + vectorX];
         //console.log( 'i am in app', newPlayer, destination, state.playerHealth);
    
    let actions = [];
    
   
    
   if(destination.type&&destination.type!=="enemy"&&destination.type!=="boss"){
    
actions.push( 
              changeThing({ type: 'floor' }, [x, y]),
              changeThing({type: `player ${direction}`}, newPos),
              changePlayerPos(newPos)
              );

this.props.store.dispatch(batchActions(actions));
}
    if(destination.type==="enemy"||destination.type==="boss"){
        
        
        
        if(destination.health>0){
        
         if(info.playerHealth-destination.attackLevel<=0){
             
         this.setState({newGame:true,menu:{opacity:"1"}})
         
        
    }
     
     else{   
         
        let damageChange = [];
        
            
        damageChange.push( setHealth({health:info.playerHealth-destination.attackLevel}),
             setEnemyHealth(destination.health-(info.equipedWeapon.damage+(Math.floor(info.equipedWeapon.damage*Math.floor(info.playerXP/100)/2))),newPos)
              );
        
       this.props.store.dispatch(batchActions(damageChange))
       this.setState({currEnemy:destination})
       this.props.store.dispatch(changeThing({type: `player ${direction}`}, [x, y]))
     }
     
        }
        
        else if(destination.type === "enemy"){
            
         this.setState({currEnemy:{}})
               
        actions.push(  setXP(info.playerXP+5+5*state.dungeonLevel),
                       changeThing({ type: 'floor' }, [x, y]),
                       changeThing({type: `player ${direction}`}, newPos),
                       changePlayerPos(newPos)
                      );

            this.props.store.dispatch(batchActions(actions));
            
        }
        
        else if(destination.type === "boss"){
           this.setState({newGame:true,win:{display:"block"}})
        }
        
    }
    
    
    
    if(destination.type==="exit"){
       
        
        this.props.store.dispatch(batchActions([createLevel(state.dungeonLevel+1), setLevel(state.dungeonLevel+1)]))
        this.setState({currSong:this.state.songs[state.dungeonLevel]})
       
        
    }
    
    
    if(destination.type==="powerUp"){
       
        
        this.props.store.dispatch(setHealth({health:info.playerHealth+10}))
       
        
    }
    
    if(destination.type==="weapon"){
       
        
        this.props.store.dispatch(setWeapon({...destination}))
       
        
    }
    
    

    }
    
    resetGame = ()=>{
        
        
this.props.store.dispatch(batchActions([createLevel(1),setLevel(1),setHealth({health:100}),setWeapon({
               name:"Cutlass",
               damage:6
              })]));
              
              this.setState({currSong:this.state.songs[this.props.store.getState().createBoard.dungeonLevel]});

    }
    
    keydown = (e) => {
        
        //console.log(this.state)
        e.preventDefault();
     	switch (e.keyCode) {
     	case 13:
     	    if(this.state.newGame){
     	    this.setState({newGame:false, menu:{opacity:"0"},win:{display:"none"}, currSong:this.state.songs[this.props.store.getState().createBoard.dungeonLevel-1]});
     	    this.resetGame();
     	        
     	    }
     	    break;
		case 38:
		case 87:
			this.playerInput([0, -1],"player_up");
			break;
		// east
		case 39:
		case 68:
			this.playerInput([1, 0],"player_right");
			break;
		// south
		case 40:
		case 83:
			this.playerInput([0, 1]);
			break;
		// west
		case 37:
		case 65:
			this.playerInput([-1, 0],"player_left");
			break;
		default:
			return;
	}
     
  };
  
  
	handleResize(e) {
		const viewportWidth = e.target.innerWidth / this.VP_WIDTH_RATIO;
		const viewportHeight = Math.max(
			this.VP_MINIMUM_HEIGHT,
			(e.target.innerHeight / this.VP_HEIGHT_RATIO) - this.VP_HEIGHT_OFFSET
		);
		this.setState({ viewportWidth, viewportHeight });
	}
  
	componentWillMount() {
		// set the initial veiwport size
		const viewportWidth = window.innerWidth / this.VP_WIDTH_RATIO;
		const viewportHeight = Math.max(
			this.VP_MINIMUM_HEIGHT,
			(window.innerHeight / this.VP_HEIGHT_RATIO) - this.VP_HEIGHT_OFFSET
		);
		this.setState({ viewportWidth, viewportHeight });
	
	
this.props.store.dispatch(batchActions([createLevel(1),setLevel(1),setHealth({health:100}),setWeapon({
               name:"Cutlass",
               damage:6
              })]));
              
	}

    
     componentDidMount() {
    this.unsubscribe = this.props.store.subscribe(() =>
    //each time the store will update we will rerender
      this.forceUpdate()
    );
    
    window.addEventListener('keydown', throttle(this.keydown, 100));
    	window.addEventListener('resize', debounce(this.handleResize, 500));
    
  }

  componentWillUnmount() {
      //we need to unsubscribe from our event listener 
    this.unsubscribe();
    window.removeEventListener('keydown', throttle(this.keydown, 100));
    	window.removeEventListener('resize', debounce(this.handleResize, 500));
  }
    
    
    

    
 render(){
    
  //console.log('i am rerendering')  
  //console.log(this.props.store.getState())
  let { things, playerPos, dungeonLevel } = this.props.store.getState().createBoard; 
  let {playerXP ,playerHealth, equipedWeapon} = this.props.store.getState().playerSystem;
    
   return(
      <div className="app" >     
      
          
           <Game
             //this props are passed down only for rendering
             viewportHeight={this.state.viewportHeight}
             viewportWidth={this.state.viewportWidth
             }
             things = {things}
             playerPos = {playerPos}      
             dungeonLevel={dungeonLevel}
             
             />   
             
             <ReactAudioPlayer
              src={this.state.currSong}
              
              autoPlay
              
              loop
             />
             <InfoBar playerXP = {playerXP}  enemy = {this.state.currEnemy} playerHealth={playerHealth} equipedWeapon={equipedWeapon} dungeonLevel={dungeonLevel}/>
           
           <MenuPage style={this.state.menu}/>
          <WinPage style = {this.state.win}/>
      </div>
    ) 
  
}
}



function Game(props){
 


	    
		

    let { viewportHeight, viewportWidth, things, playerPos ,dungeonLevel} = props;
    
    const [ playerX, playerY ] = playerPos;
    
         viewportHeight = viewportHeight - viewportHeight % 2;
		 viewportWidth = viewportWidth - viewportWidth % 2;

		// define the limits of the cells to be displayed in the viewport
		const top = clamp(playerY - viewportHeight / 2, 0, things.length - viewportHeight);
		const right = Math.max(playerX + viewportWidth / 2, viewportWidth);
		const bottom = Math.max(playerY + viewportHeight / 2, viewportHeight);
		const left = clamp(playerX - viewportWidth / 2, 0, things[0].length - viewportWidth);

    
    
    //console.log(top,right,bottom,left)
    
    
     things.map((row, i) => row.map((cell, j) => {
  //we create a new property on each cell that measures the distance from the player
  
	cell.distanceFromPlayer = (Math.abs(playerY - i)) + (Math.abs(playerX - j));
	
	//then we will check if distance is > 10 then set opacity to 0
	cell.distanceFromPlayer > 6 ? cell.opacity = 0 : cell.opacity = 0.9; 
	cell.distanceFromPlayer > 3 && cell.distanceFromPlayer < 7 ? cell.opacity = 0.7 : null; 
	 
	
	
	return cell;
  }));
  
  
  
  
  // create a new array of entities which includes the distance from the player
		// used to enable fog mode
	

		// create cell components from the entities that are in scope of the viewport
	
  
  
    
      const cells= things.filter((row, i) => i >= top && i < bottom).map((element, index) => {
      return (
        <div key={index} className='row'>
        {
        
        
        
        
        
        
             element.filter((row, i) => i >= left && i < right).map((cell, j) => {
                   
              return (
                <div key = {j} className={
                cell.type ? 'cell ' + cell.type : 'cell' + " level-"+dungeonLevel
                   }

                style={{opacity: cell.opacity,...cell.styles}}
                
                 >
                </div>
              )
             })
          }
        </div>
      )
    });

    return(
      <div className='game'>
        <div className='flex-container'>
            {cells}
        </div>
      </div>
      
    )
    
    
    
    
}



function InfoBar(props){
    
    const {playerXP ,playerHealth, equipedWeapon, enemy, dungeonLevel} = props
    
    return(
            <div style={{fontSize:"10px",position:"absolute", top:"5px", left:"2px",display:"flex",justifyContent:"center"}}>
             
             <div className="box" >
             <h1>Health: {playerHealth}</h1>
             
              <h1>Level: {Math.floor(playerXP/100)}</h1>
             
              <p>You need {((Math.floor(playerXP/100)+1)*100)-playerXP} XP to level-up</p>
              <h1>Weapon: {equipedWeapon.name}</h1>
              <p>Damage: {equipedWeapon.damage} + {Math.floor((equipedWeapon.damage*Math.floor(playerXP/100))/2)} XP boost</p>
             </div>
              
             
             
             <div className="box" >
              <h1>{enemy.type=="boss"?"Boss":"Enemy"} Health: {enemy.health}</h1>
             
              <p>Damage: {enemy.attackLevel}</p>
              
               <h1>Dungeon Level: {dungeonLevel}</h1>
              
             </div>
             
              
             
            </div>
        
        )
    
}

function MenuPage(props){
    
    return(
        
        <div style={{...props.style,transition:"opacity 550ms ease-in-out",position:"absolute",top:"0",left:"0",width:"100%", height:"100%", backgroundColor:"black"}}>
        <div style={{justifyContent:"center",display:"flex"
            
        }}>
        <div style={{marginTop:"10em",display:"flex", justifyContent:"space-around",flexDirection:"column" }}>
        <div>
            <h1 className="mainTitle" >
            Dungeon of Thieves
            </h1>
            
            <p className="start" >Press Enter to Start</p>
        </div>
        
        
        <div style={{marginTop:"100px"}}>
            <h2>Instructions</h2>
            <ul>
            <li>Kill skeletons to gain experience</li>
            <li>Collect better weapons</li>
            <li>Find entrance to the next dungeon level</li>
            <li>Kill boss in the deepest dungeon to win</li>
            </ul>
        
        </div>
        </div>
        </div>
        </div>
        
        
        )
    
    
}

function WinPage (props){
    
    return(
        
        <div style={{...props.style,position:"absolute",top:"0",left:"0",width:"100%", height:"100%", backgroundColor:"black"}}>
        <div style={{justifyContent:"center",display:"flex"
            
        }}>
        <div style={{marginTop:"10em",display:"flex", justifyContent:"space-around",flexDirection:"column" }}>
        <div>
            <h1 className="mainTitle" >
            You WON!
            </h1>
            
            <p className="start" >Play Again!</p>
        </div>
        
        </div>
        </div>
        </div>
        )
    
}


/*class Camera extends Component {
    
   renderStyles(){
    const [ playerX, playerY ] = this.props.playerPos;
    
        const x = playerX + (30/2)*-1;
        const y = playerY + (30/2)*-1;
        
        return {
            
            top:y+"em",
            left:x+"em",
            position:"absolute"
            
        }
        
        
    }
    
    
    render(){
        return(
            
            <div style={this.renderStyles()}>
            {
            this.props.children
            }
            </div>
            
            )
    }
    
}
*/

export default App;