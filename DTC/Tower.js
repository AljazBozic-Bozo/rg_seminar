import Utils from './Utils.js';
import Node from './Node.js';
import Bullet from './Bullet.js';

const mat4 = glMatrix.mat4;
const vec3 = glMatrix.vec3;

//TODO


//mesh: 18 rdeč, 19 moder

export default class Tower extends Node{
    
    constructor(tr, scene, type){
        super(tr);
        //this.reset();
        //this.updateMatrix();
        //this.updateTransform();
        //this.updateTransform();

        this.moveTower(tr);
        this.type = type;
        this.scene = scene;
        vec3.add(this.translation, this.translation, [0,0.5,0]);
        if(type == 0){
            this.mesh = scene.nodes[18].mesh;
            this.scale = [0.5,0.2,0.5];
            this.fireRate = 1.5;
            this.range = 9;
        }
        if(type == 1){
            this.mesh = scene.nodes[19].mesh;
            this.scale = [0.15,0.15,0.15];
            this.fireRate = 3;
            this.range = 10;
            //this.rotation = [-0.9,0,0,1];
        }


        
        
        this.shootCountown = 0;
        
        this.updateMatrix();
    }
    start(){

    }

    update(dt){
        if(this.scene.enemies.length > 0){
            this.detectEnemy();
            
            if(this.enemy!==undefined){
                this.followEnemy();
                if(this.shootCountown <= 0){
                    this.shoot(this.enemy);
                    this.shootCountown = 1/this.fireRate;   
                }
                this.shootCountown -= dt;


                //this.shoot(this.enemy);
                //this.followEnemy();
                //this.updateMatrix();
            }
        }
    }

    detectEnemy(){//preveri če je enemy v dometu in je najbližji, vrne index enemy
        let closestDistance=100;
        let closestEnemy=-1;
        let enumerate = 0;
        this.scene.enemies.forEach(enemy => {
            if(enemy){
            const distance = vec3.distance(this.translation, enemy.translation);
            if(distance < this.range && distance<closestDistance){
                closestDistance = distance;
                closestEnemy = enumerate;
                this.enemy = enemy;
            }
            enumerate++;
            }
        });
        //return enemy;
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
        let bullet = new Bullet(bulletId, m, this.type, target, this.scene);
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