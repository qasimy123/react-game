
import cutlass from './assets/cutlass.png';
import musket from './assets/musket.png';
import pistol from './assets/pistol.png';
import mighty from "./assets/mighty.png";
import cannon from "./assets/cannon.png";
import board from "./assets/board.png";
import sock from "./assets/stinksock.png"
import enchanted from "./assets/enchpist.png";



 const gridWidth = 60;
        const gridHeight = 40;
        const roomSizes = [4,6];
        const maxRooms = 25;
         
        const c = {gridHeight,gridWidth,roomSizes,maxRooms};
function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}




/*





*/


 export function mapMaker(){
      
        
        function placeRoom(grid, {y,x,roomSize,id="floor"}) {
         
            
            
          
            for(let i = y ; i < y+roomSize; i++ ){
                for(let j = x; j < x+roomSize; j++){
                    grid[i][j]={type:id};
                    
                }
            }
            
        }
        
        function roomCheck(grid,{x,y,roomSize}) {
            
            if (y<1||y+roomSize>grid.length-1){
                return false;
            }
            
            else if (x<1||x+roomSize>grid[0].length-1){
                return false;
            }
            
            for(let i = y-1; i < y+roomSize+1; i++){
                for(let j = x-1; j < x+roomSize+1; j++){
                    if(grid[i][j].type==="floor"){
                        return false;
                    }
                }
            }
            
            return true;
            
        }
        
        //function that tracks all rooms
        //using first room generates 4 rooms around it
        //takes 4rth room
        //runs the function that generates 4 rooms around it
        
       const makeOtherRooms = (grid, seedRooms, counter = 1, maxRooms = c.maxRooms) => {
	
		if (counter + seedRooms.length > maxRooms || !seedRooms.length) {
			return grid;
		}
		
	
		grid = roomFromOne(grid, seedRooms.pop());

		
		seedRooms.push(...grid.placedRooms);
		
		counter += grid.placedRooms.length;
		return makeOtherRooms(grid.grid, seedRooms, counter);
	};
       
       

       function roomFromOne(grid,{x,y,roomSize}, range = c.roomSizes){
           
          // range for generating the random room heights and widths
	const [min, max] = range;

		// generate room values for each edge of the seed room
		const check = [];

		const north = { roomSize: randomNum(min, max) };
		//dont get confused about theroomSizeandroomSizeproperty when declaring a room.
		
		//the x,y,height androomSizewe use from now on are the ones
		//we pass in the initial function declaration createRoomsFromSeed()
		
		north.x = randomNum(x, x +roomSize- 1);
		north.y = y - north.roomSize - 1;
		
		north.door={
		 y : north.y+north.roomSize,
	     x : randomNum(north.x, (Math.min(north.x + north.roomSize, x + roomSize)) - 1) ,
	     roomSize:1,
	     id:'door'
		}
	    
	
		check.push(north);

		const east = {  roomSize: randomNum(min, max) };
		east.x = x +roomSize+ 1;
		east.y = randomNum(y,roomSize + y - 1);
	    east.door={
		 y : randomNum(east.y, (Math.min(east.y + east.roomSize, y + roomSize)) - 1),
	     x : east.x-1,
	     roomSize:1,
	     id:'door'
		}
		
		check.push(east);

		const south = { roomSize: randomNum(min, max) };
		south.x = randomNum(x, roomSize + x - 1);
		south.y = y + roomSize + 1;
	    
	    south.door={
		 y : south.y-1,
	     x : randomNum(south.x, (Math.min(south.x + south.roomSize, x + roomSize)) - 1),
	     roomSize:1,
	     id:'door'
		}
	
		check.push(south);

		const west = { roomSize: randomNum(min, max)};
		west.x = x - west.roomSize + 1;
		west.y = randomNum(y,roomSize+ y - 1);
	    west.door={
		 y : randomNum(west.y, (Math.min(west.y + west.roomSize, y + roomSize)) - 1),
	     x : west.x+west.roomSize+1,
	     roomSize:1,
	     id:'door'
		}
	
		check.push(west);

		const placedRooms = [];
	
       check.forEach(side=>{
           
           
           if(roomCheck(grid,side)){
               placeRoom(grid,side);
               placeRoom(grid,side.door);
               placedRooms.push(side);
           }
          
          
           
       })
           return {grid, placedRooms};
           
       }
        
        let grid = [];
        
        //empty grid
        for(let i = 0; i < c.gridHeight; i++){
            grid.push([]);
            
            for(let j = 0; j < c.gridWidth; j++){
                grid[i].push({type:""})
            }
            
        }
        
        const firstRoom = {
            roomSize : roomSizes[Math.floor(Math.random()*roomSizes.length)],
            x : 4,
            y : 12,
            
            
        }
        
        
        placeRoom(grid,firstRoom);
       
       return makeOtherRooms(grid, [firstRoom]);
     
      
    }

 export function createThings(levelMap, level=1){
      
      const enemies = [];
      
      for(let i=0; i<10; i++){
          
          const enemy = {
              
              health:30*level+randomNum(5,10),
              attackLevel: randomNum(level-1?level-1:level,level+1)*2,
              type:"enemy"
              
              
          }
          
          enemies.push(enemy);
          
      }
      
      
      const bosses = [];
      
      if(level%4===0){
          bosses.push({
              health:500,
              level:level+1,
              attackLevel: randomNum(level-1,level+1)*4,
              type:"boss"
              
              
          })
      }
      
      
      const player = [{type:"player"}];
         
     const weaponOptions=[
          
              {
               name:"Cannon",
               img:cannon,
               
               damage:34
              },
              {
               name:"Cutlass",
               img:cutlass,
               damage:10
              },
              {
               name:"Musketoon",
               img:musket,
               damage:16
              },
              
              {
               name:"Pistol",
               img:pistol,
               
               damage:18
              },
              
              {
                  name:"Mighty Sword",
               img:mighty,
               
                  damage:25
              },
              
              {
                  name:"Boarding Axe",
               img:board,
               
                  damage:28
              }
              ,
              
              {
                  name:"Enchanted Pistol",
               img:enchanted,
               
                  damage:39
              },
              
              {
                  name:"Davy Jones' Sock",
               img:sock,
               
                  damage:45
              }
             
          ] 
          
      const weapons = [];
      
      const qualifying = weaponOptions
		.filter(weapon => weapon.damage < level * 10 + 15)
			.filter(weapon => weapon.damage > level * 10 - 10);

      

          
          for (let i = 0; i < 4; i++) {
		
		const weapon = Object.assign({}, qualifying[randomNum(0, qualifying.length - 1)]);
		weapon.styles = { "backgroundImage":"url("+weapon.img+")"}
		weapon.type = 'weapon';
		weapons.push(weapon);
	}
          
 
      
     const exits = [];
	if (level < 4) {
		exits.push({
			type: 'exit'
		});
	}
      
      const powerUps = [];
      
      
      for (let i = 0; i < 7; i++) {
		powerUps.push({ type: 'powerUp' });
	}
      
      let playerPos = [];
      
      [exits,enemies,bosses,player,weapons,powerUps].forEach(thing=>{
         
         while(thing.length){
             
             const x = Math.floor(Math.random()*c.gridWidth);
             const y = Math.floor(Math.random()*c.gridHeight);
             
             if(levelMap[y][x].type==="floor"){
                 
                 if(thing[0].type==="player"){
                     
                     playerPos = [x,y];
                     
                 }
                 
                 levelMap[y][x]= thing.pop();
                 
                 
             }
             
         }
         
         
          
      });
      
      for (let i = 0; i < levelMap.length; i++) {
		for (let j = 0; j < levelMap[0].length; j++) {
			if (levelMap[i][j].type === 'door') {
				levelMap[i][j].type = 'floor';
			}
		}
	}
	
	return {things:levelMap,playerPos}
	
  }