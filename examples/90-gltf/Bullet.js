import Node from './Node.js';

const mat4 = glMatrix.mat4;
const vec3 = glMatrix.vec3;

export default class Bullet extends Node {

    constructor(matrix, mesh){
        super(matrix);
        this.matrix = matrix;
        //console.log("Bullet initialised");
        this.updateTransform();
        //this.scale = [3,3,3];
        this.translation = [
                -1.9570178985595703,
                26.451894760131836,
                20.80174446105957
            ];
        this.mesh = mesh;


        this.bulletSpeed = 500;
    }

    
    update(dt){
        const forward = vec3.set(vec3.create(), -Math.sin(this.rotation[1]), 0, -Math.cos(this.rotation[1]));
        //const forward = vec3.set(vec3.create(), );
        //vec3.inverse(forward,forward);    
        const velocity = [0, 0, 0];
        let acc = vec3.create();
        vec3.add(acc, acc, forward);
        
        vec3.scaleAndAdd(velocity, velocity, acc, dt*this.bulletSpeed);
        

        vec3.scaleAndAdd(this.translation, this.translation, velocity, dt)
        this.updateMatrix();
    }
}