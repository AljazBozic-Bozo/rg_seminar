import Utils from './Utils.js';
import Node from './Node.js';

const mat4 = glMatrix.mat4;
const vec3 = glMatrix.vec3;

//TODO


//mesh: 18 rdeč, 19 moder

export default class Tower extends Node{
    
    constructor(tr, scene){
        super(tr);
        //this.reset();
        this.translation = tr;
        //this.updateTransform();

        //vec3.add(this.translation, this.translation, [0,1,0]);
        //this.scale = [0.5,0.5,0.5];
        //this.rotation = 

        this.scene = scene;
        
        this.mesh = scene.nodes[21].mesh;
        
        this.updateMatrix();
        console.log(this);
        
    }
    start(){

    }

    update(){
        
    }
    reset(){
        this.tr = [0,0,0];
        this.rotation = [0,0,0,1];
        this.scale=[1,1,1];
        this.updateMatrix();
    }

}