import {createThings,mapMaker} from "./map.js"


export function changeThing(thing,coords){
    
    return {
        type:"CHANGE_THING",
        payload:{thing, coords}
    }
    
}

export function changePlayerPos(payload){
    
    return {
        type:"CHANGE_PLAYER_POS",
        payload
    }
}

export function createLevel(level){
    
    return {
        type:"CREATE_LEVEL",
        payload:createThings(mapMaker(),level)
    };
    
    
}


export function setLevel(payload) {
	return {
		type: 'SET_LEVEL',
		payload
	};
}


export function setHealth(payload) {
	return {
		type: 'SET_HEALTH',
		payload
	};
}

export function setEnemyHealth(health, coords) {
    return {
        type: "SET_ENEMY_HEALTH",
        payload:{health, coords}
    }
    
}


export function setWeapon(payload) {
	return {
		type: 'SET_WEAPON',
		payload
	};
}




export function setXP(payload) {
	return {
		type: 'SET_XP',
		payload
	};
}