import Utils from './Utils.js';
import Node from './Node.js';

const mat4 = glMatrix.mat4;
const vec3 = glMatrix.vec3;
let audio;

export default class Enemy extends Node{
    
    constructor(enemyId, tr, scene, type){
        super(tr);

        this.id = enemyId;
        this.translation = tr;
        
        this.scene = scene;
        
        
        this.alive = true;

        if(type == 0){ 
            this.scale = [0.5,0.5,0.5];
            this.mesh = scene.nodes[22].mesh;
            
            this.health = 10;
            this.enemySpeed = 300;
        }

        if(type == 1){ 
            this.scale = [0.3,0.3,0.3];
            this.mesh = scene.nodes[23].mesh;
            
            this.health = 20;
            this.enemySpeed = 200;
        }
        this.health += 2*this.scene.difficulty;
        this.enemySpeed += 2*this.scene.difficulty;
        
        this.waypointIndex = 0;
        this.waypoints = scene.waypoints;
        
        this.updateMatrix();
    }
    start(){

    }

    update(dt){
        this.checkHealth();
        if(this.alive){
            let direction = vec3.create();
            vec3.sub(direction, this.translation, this.waypoints[this.waypointIndex].translation);
            vec3.normalize(direction, direction);
            direction[0] = -direction[0];
            direction[1] = 0;
            direction[2] = -direction[2];
            const velocity = [0, 0, 0];
            let acc = vec3.create();
            vec3.add(acc, acc, direction);
            
            vec3.scaleAndAdd(velocity, velocity, acc, dt*this.enemySpeed);
            

            vec3.scaleAndAdd(this.translation, this.translation, velocity, dt)
            this.updateMatrix();

            if(vec3.distance(this.translation, this.waypoints[this.waypointIndex].translation)<=0.5){
                this.waypointIndex++;
                if(this.waypointIndex >= this.waypoints.length){
                    
                    this.alive = false;
                    this.scene.health -= this.health;
                    console.log("At the end");
                    audio = new Audio('/sound/destroy.mp3');
                    audio.play();
                    
                }
            }
        }
    }

    checkHealth(){
        if(this.health<=0){
            //console.log( this.scene.enemies.indexOf(this));
            this.alive = false;
            this.scene.enemies[this.id] = false;
            this.scene.score += 100 + 1 * this.scene.difficulty;
            this.scene.money += 20  + 1 * this.scene.difficulty;
            this.scene.numOfEnemies --;
            audio = new Audio('/sound/destroy.mp3');
            audio.play();
            console.log("dead");
            //if(this.id == 0){
            //    this.scene.enemies.shift();
            //}
            //if(this.id == this.scene.enemies.length){
            //    this.scene.enemies.pop();
            //}
            //if (this.id > -1) {
            //    this.scene.enemies.splice(this.id, 1);
            //}
        }
    }

}