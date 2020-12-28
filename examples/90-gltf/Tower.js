import Utils from './Utils.js';
import Node from './Node.js';
import Bullet from './Bullet.js';

const mat4 = glMatrix.mat4;
const vec3 = glMatrix.vec3;

//TODO


//mesh: 18 rdeč, 19 moder

export default class Tower extends Node{
    
    constructor(tr, scene){
        super(tr);
        //this.reset();
        //this.updateMatrix();
        //this.updateTransform();
        //this.updateTransform();

        this.moveTower(tr);

        vec3.add(this.translation, this.translation, [0,0.5,0]);
        this.scale = [0.5,0.2,0.5];
        //this.rotation = 

        this.scene = scene;
        this.mesh = scene.nodes[18].mesh;

        this.range = 10;
        
        this.updateMatrix();
        console.log(this);
    }
    start(){

    }

    update(){
        if(this.scene.enemies.length > 0){
            this.target = this.detectEnemy();
            if(this.target>=0){
                this.shoot(this.target);
                this.followEnemy();
                this.updateMatrix();
            }
        }
    }

    detectEnemy(){//preveri če je enemy v dometu in je najbližji, vrne index enemy
        let closestDistance=100;
        let closestEnemy=-1;
        let enumerate = 0;
        this.scene.enemies.forEach(enemy => {
            const distance = vec3.distance(this.translation, enemy.translation);
            if(distance < this.range && distance<closestDistance){
                closestDistance = distance;
                closestEnemy = enumerate;
                this.enemy = enemy;
            }
            enumerate++;
        });
        return closestEnemy;
    }

    followEnemy(){    
        let direction = vec3.create();
        vec3.sub(direction, this.translation, this.enemy.translation);
        vec3.normalize(direction, direction);
        this.rotation[1] = -direction[1];
    }

    shoot(target){
        const m = this.matrix.map((x) => x);
        const bulletId = this.scene.bullets.length;
        let bullet = new Bullet(bulletId, m, 1, target, this.scene);
        this.scene.bullets.push(bullet);
    }

    moveTower(location){
        this.translation = location;
    }

    reset(){
        this.tr = [0,0,0];
        this.rotation = [0,0,0,1];
        this.scale=[1,1,1];
    }
}