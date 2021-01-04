import Application from '../../common/Application.js';
import * as WebGL from './WebGL.js';
import GLTFLoader from './GLTFLoader.js';
import Renderer from './Renderer.js';
import Bullet from './Bullet.js';
import Enemy from './Enemy.js';
import Tower from './Tower.js';
import Waypoint from './Waypoint.js';


const mat4 = glMatrix.mat4;
let paused = true;
let wavePaused = true;
let gameWon = false;
let allWavesDone = false;
document.getElementById("gameOver").style.visibility = "hidden";
document.getElementById("gameWon").style.visibility = "hidden";
document.getElementById("scoreDiv").style.visibility = "hidden";
document.getElementById("overlay").style.visibility = "hidden";




const waves = [
    {
        "wave" : 0,
        "type1": 1,
        "type2": 1
    },
    {
        "wave" : 1,
        "type1": 2,
        "type2": 2
    },
    {
        "wave" : 2,
        "type1": 3,
        "type2": 3
    },
    {
        "wave" : 3,
        "type1": 4,
        "type2": 4
    },
    {
        "wave" : 4,
        "type1": 5,
        "type2": 5
    }
];




class App extends Application {

    async start() {
        this.startIndex = 31;


        this.loader = new GLTFLoader();
        await this.loader.load('../../common/models/world/world.gltf');

        this.scene = await this.loader.loadScene(this.loader.defaultScene);
        this.camera = await this.loader.loadNode(2);
        

        if (!this.scene || !this.camera) {
            throw new Error('Scene or Camera not present in glTF');
        }

        if (!this.camera.camera) {
            throw new Error('Camera node does not contain a camera reference');
        }
        

        this.pointerlockchangeHandler = this.pointerlockchangeHandler.bind(this);
        document.addEventListener("pointerlockchange", this.pointerlockchangeHandler)
        
        //const pauseBtn = document.getElementById("pause");
        //pauseBtn.addEventListener('click', this.pauseGame());
        document.getElementById("pause").addEventListener('click', this.pauseGame);
        document.getElementById("start").addEventListener('click', this.startGame);
        document.getElementById("nextWave").addEventListener('click', this.nextWave);
        

        //pauseBtn.clickHandler = this.pauseGame.bind(this);

        this.clickHandler = this.clickHandler.bind(this);
        

        this.scene.bullets = [];
        this.scene.enemies = [];
        this.scene.waypoints = [];
        this.scene.towers = [];
        this.scene.numOfEnemies = 0;
        

        this.spawnCountown = 0;
        this.spawnRate = 1;

        this.scene.health = 100;
        this.scene.score = 0;
        this.scene.money = 300;

        this.scene.waveNum = 0;
        this.scene.dificulty = 0;
        
        
        this.renderer = new Renderer(this.gl);
        this.renderer.prepareScene(this.scene);
        this.resize();
        this.intiWaypoints();

        
        document.getElementById("1-0").addEventListener('click', this.btnClickHandler.bind(this));
        document.getElementById("1-1").addEventListener('click', this.btnClickHandler.bind(this));
        document.getElementById("2-0").addEventListener('click', this.btnClickHandler.bind(this));
        document.getElementById("2-1").addEventListener('click', this.btnClickHandler.bind(this));
        document.getElementById("3-0").addEventListener('click', this.btnClickHandler.bind(this));
        document.getElementById("3-1").addEventListener('click', this.btnClickHandler.bind(this));
        document.getElementById("4-0").addEventListener('click', this.btnClickHandler.bind(this));
        document.getElementById("4-1").addEventListener('click', this.btnClickHandler.bind(this));
        document.getElementById("5-0").addEventListener('click', this.btnClickHandler.bind(this));
        document.getElementById("5-1").addEventListener('click', this.btnClickHandler.bind(this));
        document.getElementById("6-0").addEventListener('click', this.btnClickHandler.bind(this));
        document.getElementById("6-1").addEventListener('click', this.btnClickHandler.bind(this));
        document.getElementById("7-0").addEventListener('click', this.btnClickHandler.bind(this));
        document.getElementById("7-1").addEventListener('click', this.btnClickHandler.bind(this));
        document.getElementById("8-0").addEventListener('click', this.btnClickHandler.bind(this));
        document.getElementById("8-1").addEventListener('click', this.btnClickHandler.bind(this));
        document.getElementById("9-0").addEventListener('click', this.btnClickHandler.bind(this));
        document.getElementById("9-1").addEventListener('click', this.btnClickHandler.bind(this));
        document.getElementById("10-0").addEventListener('click', this.btnClickHandler.bind(this));
        document.getElementById("10-1").addEventListener('click', this.btnClickHandler.bind(this));
        document.getElementById("11-0").addEventListener('click', this.btnClickHandler.bind(this));
        document.getElementById("11-1").addEventListener('click', this.btnClickHandler.bind(this));
        document.getElementById("12-0").addEventListener('click', this.btnClickHandler.bind(this));
        document.getElementById("12-1").addEventListener('click', this.btnClickHandler.bind(this));
        document.getElementById("13-0").addEventListener('click', this.btnClickHandler.bind(this));
        document.getElementById("13-1").addEventListener('click', this.btnClickHandler.bind(this));
        document.getElementById("14-0").addEventListener('click', this.btnClickHandler.bind(this));
        document.getElementById("14-1").addEventListener('click', this.btnClickHandler.bind(this));
          
    }
    
    startGame(){
        paused = false;
        document.getElementById("gameStart").style.visibility = "hidden";
        document.getElementById("overlay").style.visibility = "visible";

        //wavePaused = false;
        //console.log("start");
    }
    
    pauseGame(){
        paused = true;
        //console.log("paused");
    }

    nextWave(){
        paused = false;
        wavePaused = false;
    }

    endGame(){
        document.getElementById("gameOver").style.visibility = "visible";
        document.getElementById("score").style.visibility = "visible";
        document.getElementById("overlay").style.visibility = "hidden";
        paused = true;
    }

    winGame(){
        console.log("hej u won");
        gameWon = true;
        document.getElementById("gameWon").style.visibility = "visible";
        document.getElementById("scoreDiv").style.visibility = "visible";
        document.getElementById("overlay").style.visibility = "hidden";

    }

    intiWaypoints(){
        for(const node of this.scene.nodes){
            
            if(node instanceof Waypoint){
                this.scene.waypoints.push(node);
            }
        }
    }

    enableCamera() {
        this.canvas.requestPointerLock();
    }

    pointerlockchangeHandler() {
        if (!this.camera) {
            return;
        }

        if (document.pointerLockElement === this.canvas) {
            this.camera.enable();
            document.addEventListener('click', this.clickHandler);
        } else {
            this.camera.disable();
            document.removeEventListener('click', this.clickHandler);
        }
    }

    update() {
        const t = this.time = Date.now();
        const dt = (this.time - this.startTime) * 0.001;
        this.startTime = this.time;

        if (this.camera) {
            this.camera.update(dt);
            this.camera.updateProjection();
            this.camera.updateMatrix();
            this.resize();
        }
        if(this.scene && this.scene.health<=0){
            this.endGame();
        }
        
        if(allWavesDone && this.scene.numOfEnemies<=0){
            this.winGame();
        }


        if(this.scene && !paused){
            
            if(this.scene.bullets.length > 0){
                for(const bullet of this.scene.bullets){
                    if(bullet){
                        bullet.update(dt);
                        bullet.updateMatrix();
                    }
                }
            }
            if(this.scene.enemies.length > 0){
                for(const enemy of this.scene.enemies){
                    if(enemy){
                        enemy.update(dt);
                        enemy.updateMatrix();
                    }
                    else if(this.scene.enemies[enemy] != false){
                        this.scene.enemies[enemy] = false;
                    }
                }
                if(this.scene.enemies.length == 1 && !this.scene.enemies[0].alive){
                    this.scene.enemies.pop();
                }
            }

            if(this.scene.towers.length > 0){
                let count = 0;
                for(const tower of this.scene.towers){
                    count ++;
                    
                    if(tower){
                        tower.update(dt);
                        tower.updateMatrix();

                    }
                }
            }
            
            if(!wavePaused && !gameWon){
                this.createWave(dt);
            }
                
            document.getElementById("health").innerHTML = this.scene.health;
            document.getElementById("money").innerHTML = this.scene.money;
            document.getElementById("score").innerHTML = this.scene.score;
            document.getElementById("scoreSpan").innerHTML = this.scene.score;
            document.getElementById("wave").innerHTML = this.scene.waveNum + 1;
        }
        
    }

    enemiesAlive(){
        for(const enemy in this.scene.enemies){
            console.log(enemy);
            console.log(enemy instanceof Enemy);


            if(enemy instanceof Enemy) {
                
                return true;
            }
        }
        return false;
    }

    render() {
        if (this.renderer) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    resize() {
        const w = this.canvas.clientWidth;
        const h = this.canvas.clientHeight;
        const aspectRatio = w / h;

        if (this.camera) {
            this.camera.camera.aspect = aspectRatio;
            this.camera.camera.updateMatrix();
        }
    }

    clickHandler(e) { 
        console.log(this.scene.enemies);
        console.log(this.enemiesAlive());
    }
    
    createWave(dt){
        let wave = waves[this.scene.waveNum];
        
        if(this.spawnCountown <= 0){
            
            if(wave.type1 <= 0 && wave.type2 <= 0){   
                wavePaused = true;
                this.scene.waveNum ++;
                if(this.scene.waveNum>=waves.length){
                    allWavesDone = true;
                }
            }

            else if(wave.type1 > 0){
                this.createEnemy(0);
                this.spawnCountown = 1/this.spawnRate;
                wave.type1--;
            }   
            else if(wave.type2 > 0){
                this.createEnemy(1);
                this.spawnCountown = 1/this.spawnRate;
                wave.type2--;
            }
        }
        this.spawnCountown -= dt;
    }

    createEnemy(type){
        //const m = this.scene.nodes[this.startIndex].matrix.map((x) => x);
        //console.log(this.scene);
        const tr = this.scene.nodes[this.startIndex].translation.map((x) => x);
        
        let enemy = new Enemy(this.scene.enemies.length, tr, this.scene, type);
        
        this.scene.enemies.push(enemy);
        this.scene.numOfEnemies ++;
        
    }

    btnClickHandler(e){
        var elts = e.srcElement.id.split("-");
        //console.log(elts);
        let id = parseInt(elts[0]) - 1 ;
        let node = parseInt(elts[0]) + 3;
        let type = parseInt(elts[1]);
        
        if(!this.scene.towers[id]){
            if(type == 0 && this.scene.money >=150) {
                
                this.createTower(node, type, id);
                this.scene.money -= 150;
            }

            if(type == 1 && this.scene.money >=100) {
                this.createTower(node, type, id);
                this.scene.money -= 100;
            }
        } 
    }

    createTower(node, type, id){

        const tr = this.scene.nodes[node].translation.map((x) => x);
        let tower = new Tower(tr, this.scene, type);
        
        this.scene.towers[id] = tower;
        console.log(this.scene.towers);
        
    }

}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('canvas');
    const app = new App(canvas);
    const gui = new dat.GUI();
    gui.add(app, 'enableCamera');
});
