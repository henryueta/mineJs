const createMapDelimiter = (columns,lines)=>{

    const column_array = new Array(columns)

    let horizontal_delimiter = "";
    let vertical_delimiter = "X";
        (()=>{
           
            for (let line = 0; line <= lines+1; line++) {
                
                horizontal_delimiter+="X";
                
                line === lines
                ? vertical_delimiter+="X"
                : vertical_delimiter+=" ";

            }
           
        })()
    

        

    for (let column = 0; column < column_array.length; column++) {

        (column > 0 
        &&
        column < column_array.length-1)
        ?
        (()=>{
            column_array[column] = vertical_delimiter

        })()
        :
        (()=>{
            column_array[column] = horizontal_delimiter
        })()



    }
    return column_array;

}

  const createMapStructure = (game_map)=>{

        const random_player_column  = Math.floor(Math.random() * (game_map.length - 1) + 1);
        const random_enemy_column = (()=>{

            return random_player_column < (game_map.length/2).toFixed()
            ? game_map.length - 2
            : 
            random_player_column > (game_map.length/2).toFixed()
            ? 1
            : 
            random_player_column === (game_map.length/2).toFixed()
            &&
            Math.random() < 0.5 ? 1 : 18;

        })();
        const random_key_column = Math.floor(Math.random() * (game_map.length - 1) + 1);



        return game_map.map((column,column_index)=>{
            
            const column_array =  column.split("")
            const free_area_size = (column_array.length - 3);

            column_index !== 0 
            && 
            column_index !== game_map.length - 1
            &&
        (()=>{
            
            for (let random_index = 0; random_index < 3; random_index++) {
                const random_block_place = Math.floor(Math.random() *free_area_size + 1);  
                column_array.splice(random_block_place,1,"B");
                
            }
            for (let random_index = 0; random_index < 1; random_index++) {
               const random_cloud_place = Math.floor(Math.random() *free_area_size + 1); 
                column_array.splice(random_cloud_place,1,"C");
            }
        })()
            
        column_index === random_player_column
        &&
        (()=>{
            const random_player_line = Math.floor(Math.random() *free_area_size + 1); 
            column_array.splice(random_player_line,1,"p")

        })()
        
        column_index === random_enemy_column
        &&
        (()=>{
            const random_enemy_line = Math.floor(Math.random() *free_area_size + 1); 
            column_array.splice(random_enemy_line,1,"e")
        })()

        column_index === random_key_column
        &&
        (()=>{
                const random_key_line = Math.floor(Math.random() *free_area_size + 1); 
                column_array.splice(random_key_line,1,"#")
        })()

            return column_array.join("").toString();

        })

}





let enemies = [];

const screen_size = {

    width:document.body.clientWidth,
    height:document.body.clientHeight

}

const game_settings = {

    clouds:{
        ref:[]
    },
    blocks:{
        ref:[],
        texture:null
    },
    sky:{
        ref:null,
        texture:null
    },
    map:{
        ref:(()=>{
            let map_delimiter = createMapDelimiter(100,100)
            return createMapStructure(map_delimiter)


            })(),
        GRID_SIZE:180
    },
    player:{
         ref:null,
         RUN_SPEED:-25,
         WALK_SPEED:-10,
         MOUSE_SENSITIVITY:0.0001,
         PERSONAL_SPACE:50,
         CAM_X:100,
         CAM_Y:-220,
         CAM_Z:50,
         FOOTSTEP_AUDIO:document.querySelector("#grass_footsteep_audio")
    }

}

function preload() {
  game_settings.blocks.texture = loadImage("https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/983910c1-8ca2-4577-ab8a-77f8d76e1f64/d395qrm-2975d780-b9ac-41c1-8a6c-828afc6442bf.png/v1/fill/w_900,h_900,q_80,strp/grass_texture_for_level_by_tikes_tastic_d395qrm-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9OTAwIiwicGF0aCI6IlwvZlwvOTgzOTEwYzEtOGNhMi00NTc3LWFiOGEtNzdmOGQ3NmUxZjY0XC9kMzk1cXJtLTI5NzVkNzgwLWI5YWMtNDFjMS04YTZjLTgyOGFmYzY0NDJiZi5wbmciLCJ3aWR0aCI6Ijw9OTAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.3w5XdAc-pWuba2O5n-LcTnTVIERFJWxo7LtcTrH660w");
}


function setup() {
  createCanvas(screen_size.width, screen_size.height, WEBGL);
  cursor(CROSS);

  // Create game layout
  for (let z = 0; z < game_settings.map.ref.length; z++) {
    for (let x = 0; x < game_settings.map.ref[z].length; x++) {
        
      const tile = game_settings.map.ref[z][x];
      const worldX = (x - game_settings.map.ref[z].length / 2) * game_settings.map.GRID_SIZE;
      const worldZ = (z - game_settings.map.ref.length / 2) * game_settings.map.GRID_SIZE;

      const randomBlockSize = {
        height:Math.floor(Math.random() *400 + 10)
      };

        

        const randomCloudSize = {
            width:Math.floor(Math.random() *1000 + 400),
            height:Math.floor(Math.random() *1000 + 400),
            depth:Math.floor(Math.random() *250 + 100)
        }

      switch (tile) {
        case "p":
          game_settings.player.ref = new Player(worldX, worldZ);
          break;
        case "e":
          enemies.push(new Enemy(worldX, worldZ));
          break;
        case "X":
        //   game_settings.blocks.ref.push(new Block(worldX, worldZ, game_settings.map.GRID_SIZE,150, game_settings.map.GRID_SIZE));
          break;
        case "B":
             game_settings.blocks.ref.push(new Block(worldX, worldZ, game_settings.map.GRID_SIZE,randomBlockSize.height, game_settings.map.GRID_SIZE));
          break;
        case "C":
            game_settings.clouds.ref.push(new Cloud(worldX, worldZ, randomCloudSize.width,randomCloudSize.height,randomCloudSize.depth))
          break;
      }
    }
  }
}


function draw() {
  background(color(40, 124, 199));

  // Basic lighting
  ambientLight(150);
  directionalLight(180, 100, 0, 0, 0, -1);

  // Draw interior
  drawFloor();
//   drawSky()
  game_settings.clouds.ref.forEach((cloud)=>cloud.display())
  game_settings.blocks.ref.forEach((block) => block.display());

  // Draw player and enemies
  game_settings.player.ref.turnTowardsMouse();
  game_settings.player.ref.moveForward();
  game_settings.player.ref.updateCamera();

  enemies.forEach((enemy) => enemy.display());
}

class Player {
  constructor(x, z) {
    this.x = x;
    this.z = z;
    this.direction = -1; // direction the player is facing
    this.isMovingForward = false;
    this.isRunning = false;
  }

  moveForward() {
    if (!this.isMovingForward) {
        game_settings.player.FOOTSTEP_AUDIO.pause();
      return;
    }
    let speed = this.isRunning ? game_settings.player.RUN_SPEED : game_settings.player.WALK_SPEED;
    let newX = this.x + Math.sin(this.direction) * speed;
    let newZ = this.z + Math.cos(this.direction) * speed;

    game_settings.player.FOOTSTEP_AUDIO.play()
    if (!this.checkCollision(newX, newZ)) {
      this.x = newX;
      this.z = newZ;
    }
  }

  checkCollision(newX, newZ) {
    for (let block of game_settings.blocks.ref) {
      if (
        newX > block.x - (block.w / 2 + game_settings.player.PERSONAL_SPACE) &&
        newX < block.x + (block.w / 2 + game_settings.player.PERSONAL_SPACE) &&
        newZ > block.z - (block.d / 2 + game_settings.player.PERSONAL_SPACE) &&
        newZ < block.z + (block.d / 2 + game_settings.player.PERSONAL_SPACE)
      ) {
        return true;
      }
    }
    return false;
  }

  turnTowardsMouse() {
    if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
      return;
    }

    // Only turn if mouse is on edge of canvas.
    const noTurnZoneStart = (width * 2) / 5;
    const noTurnZoneEnd = (width * 3) / 5;
    if (mouseX < noTurnZoneStart || mouseX > noTurnZoneEnd) {
      let mouseDelta = mouseX - width / 2;
      this.direction -= mouseDelta * game_settings.player.MOUSE_SENSITIVITY;
    }
  }

  updateCamera() {
    let camX = this.x + Math.sin(this.direction) * game_settings.player.CAM_X;
    let camZ = this.z + Math.cos(this.direction) * game_settings.player.CAM_Z;
    let lookX = this.x - Math.sin(this.direction);
    let lookZ = this.z - Math.cos(this.direction);
    camera(camX, game_settings.player.CAM_Y, camZ, lookX, game_settings.player.CAM_Y, lookZ, 0, 1, 0);
  }
}

class Cloud {
  constructor(x, z, w, h, d) {
    this.x = x;
    this.z = z;
    this.w = w;
    this.h = h;
    this.d = d;
  }

  display() {
    push();
    noStroke()
    translate(this.x, -2500, this.z); 
    rotateX(HALF_PI);      
    rotateZ(PI); 
    box(this.w, this.h, this.d);
    pop();
  }
}

class Block {
  constructor(x, z, w, h, d) {
    this.x = x;
    this.z = z;
    this.w = w;
    this.h = h;
    this.d = d;
  }

  display() {
    push();
    noStroke()
    translate(this.x, -this.h / 2, this.z);
    texture(game_settings.blocks.texture);
    box(this.w, this.h, this.d);
    pop();
  }
}

class Enemy {
  constructor(x, z) {
    this.x = x;
    this.z = z;
    this.r = 50;
  }

  display() {
    push();
    noStroke();
    translate(this.x, -this.r, this.z);
    fill("red");
    box(this.r);
    pop();
  }
}

function drawSky(){
    push();
    noStroke();
    fill('orange')
    // texture(game_settings.sky.texture)
    translate(0, -1200, 0); 
    rotateX(HALF_PI);      
    rotateZ(PI); 
    plane(width * 10, height * 10);
    pop()
}

function drawFloor() {
  push();
  noStroke();
  fill('darkkhaki');
// texture(game_settings.blocks.texture)
  translate(0, 0, 0);
  rotateX(HALF_PI);
  plane(width * 1000, height * 1000);
  pop();
}

function keyPressed() {
  switch (keyCode) {
    case 32:
        game_settings.player.CAM_Y-=200;
        setTimeout(()=>{
            game_settings.player.CAM_Y= -210;
        },500)
    break;
    case 87:
      game_settings.player.ref.isMovingForward = true;
    break;
    case UP_ARROW:
      game_settings.player.ref.isMovingForward = true;
      break;
    case SHIFT:
      game_settings.player.ref.isRunning = true;
      break;
  }
}

function keyReleased() {
  switch (keyCode) {
    case 32:
        setTimeout(()=>{
            game_settings.player.CAM_Y= -210;
        },500)
    break;
    case 87:
      game_settings.player.ref.isMovingForward = false;
    break;
    case UP_ARROW:
      game_settings.player.ref.isMovingForward = false;
      break;
    case SHIFT:
      game_settings.player.ref.isRunning = false;
      break;
  }
}