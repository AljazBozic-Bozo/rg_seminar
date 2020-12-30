import Application from '../../common/Application.js';
import * as WebGL from './WebGL.js';
import GLTFLoader from './GLTFLoader.js';
import Renderer from './Renderer.js';
import Bullet from './Bullet.js';
import Enemy from './Enemy.js';
import Tower from './Tower.js';
import Waypoint from './Waypoint.js';

const mat4 = glMatrix.mat4;
let globalId;

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
        this.clickHandler = this.clickHandler.bind(this);
        

        this.scene.bullets = [];
        this.scene.enemies = [];
        this.scene.waypoints = [];
        this.scene.towers = [];

        this.spawnCountown = 0;
        this.spawnRate = 1;

        this.scene.health = 100;
        
        
        this.renderer = new Renderer(this.gl);
        this.renderer.prepareScene(this.scene);
        this.resize();
        this.intiWaypoints();

        //console.log(this.scene);

        if(this.scene){
            this.createTower(4,0);
            this.createTower(5,0);
            this.createTower(6,1);
            //this.createTower(7);
            //this.createTower(8);
            //this.createTower(9);
            //this.fun();
        }
        
        //this.createWave(5);
        
    }
    
    startGame(){
        
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
        if(this.scene && this.scene.bullets.length > 0){
            for(const bullet of this.scene.bullets){
                if(bullet){
                    bullet.update(dt);
                    bullet.updateMatrix();
                }
            }
        }
        if(this.scene && this.scene.enemies.length > 0){
            for(const enemy of this.scene.enemies){
                if(enemy){
                    enemy.update(dt);
                    enemy.updateMatrix();
                }
            }
            if(this.scene.enemies.length == 1 && !this.scene.enemies[0].alive){
                this.scene.enemies.pop();
            }
        }

        if(this.scene && this.scene.towers.length > 0){
            for(const tower of this.scene.towers){
                tower.update(dt);
                tower.updateMatrix();
            }
        }
        if(this.scene){
            if(this.spawnCountown <= 0){
                this.createEnemy();
                this.spawnCountown = 1/this.spawnRate;   
            }
            this.spawnCountown -= dt;
        }
        
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
    }
    
    createWave(amount){
        this.time = Date.now();
        const dt = (this.time - this.startTime) * 0.001;
        
        if(this.spawnCountown <= 0){
            this.createEnemy();
            this.spawnCountown = 1/this.spawnRate;   
        }
        this.spawnCountown -= dt;
    }
    
    repeatOften() {
        console.log("repeating");
        globalID = requestAnimationFrame(repeatOften);
      }


    createEnemy(){
        //const m = this.scene.nodes[this.startIndex].matrix.map((x) => x);
        //console.log(this.scene);
        const tr = this.scene.nodes[this.startIndex].translation.map((x) => x);
        
        let enemy = new Enemy(this.scene.enemies.length, tr, this.scene, 1);
        
        this.scene.enemies.push(enemy);
        
    }

    createTower(node, type){
        const tr = this.scene.nodes[node].translation.map((x) => x);
        let tower = new Tower(tr, this.scene, type);
        
        this.scene.towers.push(tower);
        
    }

}

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('canvas');
    const app = new App(canvas);
    const gui = new dat.GUI();
    gui.add(app, 'enableCamera');
});
