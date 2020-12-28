import Utils from './Utils.js';
import Node from './Node.js';

const mat4 = glMatrix.mat4;
const vec3 = glMatrix.vec3;

export default class Enemy extends Node{
    
    constructor(tr, scene){
        super(tr);

        this.translation = tr;
        this.scale = [0.5,0.5,0.5];
        this.scene = scene;
        this.updateMatrix();
        
        this.alive = true;

        this.mesh = scene.nodes[22].mesh;
        this.waypointIndex = 0;
        this.waypoints = scene.waypoints;
        this.health = 10;

        this.enemySpeed = 100;
    }
    start(){

    }

    update(dt){
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
                    
                }
            }
        }
    }

}