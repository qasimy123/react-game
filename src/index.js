import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.jsx";
import {createStore, combineReducers} from "redux";
//import {setWeapon, createLevel, setLevel, setHealth} from "./actions.js";
import update from 'react-addons-update';
import { enableBatching} from 'redux-batched-actions';


        
const initialState = {
    
    things:[[]],
    dungeonLevel:0,
    playerPos:[]
    
};



const gameInfo = {
    
    playerHealth:0,
    playerXP:0,
    equipedWeapon:{}
};

const playerSystem = (state=gameInfo, {type, payload})=>{
    
    switch (type) {
        case 'SET_HEALTH':
            {
                return {...state, playerHealth:payload.health};
                
            }
            
        case 'SET_WEAPON':
            {
                return {...state, equipedWeapon:payload};
                
            }
            
         case 'SET_XP':
            {
                return {...state, playerXP:payload};
                
            }
        
            
        default:
            return state;
    }
    
}

const createBoard=(state=initialState, {type, payload})=>{
    
    switch(type){
        
        case "CHANGE_THING":{
            
            const [x, y] = payload.coords;
			const things = update(state.things, {
				[y]: {
					[x]: {$set: payload.thing }
				}
			});
			
			return {...state, things};
    }
    
    case 'CHANGE_PLAYER_POS':
			return { ...state, playerPos: payload };
			
	case 'CREATE_LEVEL':
    	return {
    		...state,
    		playerPos: payload.playerPos,
    		things: payload.things
    	};
			
    case 'SET_LEVEL':
			return { ...state, dungeonLevel: payload };
	
    
    case 'SET_ENEMY_HEALTH':
         
            const [x, y] = payload.coords;
			const things = update(state.things, {
				[y]: {
					[x]: {health:{$set: payload.health }}
				}
			});
			
			return {...state, things};
    
    	default:
			return state;   
    }
};




const store = createStore(enableBatching(combineReducers({createBoard, playerSystem})));


    



 




ReactDOM.render(
    <App store = {store}/>,document.getElementById("root")
    );