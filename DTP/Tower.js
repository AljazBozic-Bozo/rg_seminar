import Utils from './Utils.js';
import Node from './Node.js';
import Bullet from './Bullet.js';

const mat4 = glMatrix.mat4;
const vec3 = glMatrix.vec3;
const quat = glMatrix.quat;

let shot;
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
            this.range = 4;
        }
        if(type == 1){
            this.mesh = scene.nodes[19].mesh;
            this.scale = [0.15,0.15,0.15];
            this.fireRate = 3;
            this.range = 5;
        }

        this.r = [0,0,0];
        
        this.shootCountown = 0;
        
        this.updateMatrix();
    }
    start(){

    }

    update(dt){
        if(this.scene.enemies.length > 0){
            this.detectEnemy();
            
            if(this.enemy!=undefined && this.enemy.alive){
                this.followEnemy();
                
                if(this.shootCountown <= 0){
                    console.log(this.enemy);
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
        let enemySet=false;
        this.scene.enemies.forEach(enemy => {
            if(enemy){
            const distance = vec3.distance(this.translation, enemy.translation);
            if(distance < this.range && distance<closestDistance){
                closestDistance = distance;
                closestEnemy = enumerate;
                this.enemy = enemy;
                enemySet=true;
            }
            enumerate++;
            }
        });
        if(!enemySet){
            this.enemy = undefined;
        }
        //return enemy;
    }

    followEnemy(){  
        const c = this;
        const target = this.enemy;

        if(!target){
            return;
        }

        const pi = Math.PI;
        const twopi = pi*2;

        const currentDir = [-Math.sin(c.r[1]), 0, -Math.cos(c.r[1])];
        const desiredDir = vec3.sub(vec3.create(), target.translation, c.translation);
        desiredDir[1] = 0;
        vec3.normalize(desiredDir, desiredDir);

        const angle = vec3.angle(currentDir, desiredDir);
        c.r[1] += angle;

        const newDir = [-Math.sin(c.r[1]), 0, -Math.cos(c.r[1])];
        const newAngle = vec3.angle(newDir, desiredDir);
        if(newAngle > angle){
            c.r[1] -= 2*angle;
        }

        c.r[1] = ((c.r[1]%twopi) + twopi) % twopi;

        const degrees = c.r.map(x => x * 180 /pi);
        quat.fromEuler(c.rotation, ...degrees);
        
        
        c.updateMatrix();
        
    }

    shoot(target){
        const m = this.matrix.map((x) => x);
        const bulletId = this.scene.bullets.length;
        let bullet = new Bullet(bulletId, m, this.type, target, this.scene);
        this.scene.bullets.push(bullet);
        shot = new Audio('/sound/laser.mp3');
        shot.play();
        
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