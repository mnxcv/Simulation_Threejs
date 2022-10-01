//class
class Body{
    constructor(){
        let mass = 1;
        let loc = new THREE.Vector3();
        let vel = new THREE.Vector3();
        let acc = new THREE.Vector3();
    }
    Body_init(){
        this.mass = 1;
        this.loc = new THREE.Vector3(0, 0, 0);
        this.vel = new THREE.Vector3(0, 0, 0);
        this.acc = new THREE.Vector3(0, 0, 0);
    }
    acc_init(){
        this.acc = new THREE.Vector3(0, 0, 0);
    }
}
//parameter
const scale = 0.001;
const softening = 20;
const gravity_const = 500000000;
const camera_loc = new THREE.Vector3(0, 0, 100);
const Body_rad = 13;
const randposmin = -400000;
const randposmax = 400000;
const Body_cnt = 200;
const wd = window.innerWidth;
const hg = window.innerHeight;
const Body_color = 0xffffff;
const material = new THREE.MeshPhysicalMaterial
    ({color : Body_color});
material.clearcoatRoughness = 0.5;
material.ior = 1;
material.sheen = 1.0;
const fps = 60; //real constant
const dt = 1/fps; // real constant
//scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera
(75, wd/hg, 0.1, 5000);
camera.position.z = 1000;
camera.lookAt(new THREE.Vector3(0, 0, 0));
const renderer = new THREE.WebGLRenderer();
renderer.setSize(wd, hg);
document.body.appendChild(renderer.domElement);

let controls = new THREE.TrackballControls( camera, renderer.domElement);
//light(disable this time)

const light1 = new THREE.PointLight(0xffffff, 0.7, 20000, 0.99);
light1.position.set(1000, 1000, 1000);
const light2 = new THREE.PointLight(0x999999, 0.7, 20000, 0.99);
light2.position.set(-1000, -1000, -1000);
scene.add(light1);``
scene.add(light2);

//function(initial)
let real_bodies = [];
function randposgenerator(){
    let x = randposmin + (randposmax - randposmin) * Math.random();
    let y = randposmin + (randposmax - randposmin) * Math.random();
    let z = randposmin + (randposmax - randposmin) * Math.random();
    return new THREE.Vector3(x, y, z);
}
function make_Body_array(){
    ret = [];
    for(let i = 0; i<Body_cnt; i++){
        let tmp = new Body();
        tmp.Body_init();
        tmp.loc = randposgenerator();
        ret.push(tmp);
    }
    return ret;
}
function Body_print(body){
    const geometry = new THREE.SphereGeometry(Body_rad);
    const bd = new THREE.Mesh(geometry, material);
    bd.position.x = body.loc.x * scale;
    bd.position.y = body.loc.y * scale;
    bd.position.z = body.loc.z * scale;
    real_bodies.push(bd);
    scene.add(bd);
}
function Bodies_print(body_arr){
    for(let i = 0; i<Body_cnt; i++){
        //console.log(body_arr[i].loc);
        Body_print(body_arr[i]);
    }
}
//function(repeat)
function sq(num){
    return num*num;
}
function distsq(body1, body2){
    let xdiff = body2.loc.x - body1.loc.x;
    let ydiff = body2.loc.y - body1.loc.y;
    let zdiff = body2.loc.z - body1.loc.z;
    return sq(xdiff) + sq(ydiff) + sq(zdiff);
}
/**body1->body2 unit vector of location, returns Vector3*/
function unit_vec(body1, body2){
    let dx = body2.loc.x - body1.loc.x;
    let dy = body2.loc.y - body1.loc.y;
    let dz = body2.loc.z - body1.loc.z;
    let nrm = Math.sqrt(sq(dx) + sq(dy) + sq(dz));
    return new THREE.Vector3(dx/nrm, dy/nrm, dz/nrm);
}
function calc_acceleration(body_arr){
    for(let i = 0; i<Body_cnt; i++){
        body_arr[i].acc_init();
    }
    for(let i = 0; i<Body_cnt; i++){
        for(let j = 0; j<Body_cnt; j++){
            if(i < j){
                let dsq = distsq(body_arr[i], body_arr[j]);
                let dsqrev = 1/Math.sqrt(dsq + sq(softening));
                //console.log(dsqrev);
                //F = ma = G * Mm/r^2
                //a = GM/r^2
                let size_of_acc = gravity_const * body_arr[j].mass * dsqrev;
                let u = unit_vec(body_arr[i], body_arr[j]);
                
                body_arr[i].acc.x += size_of_acc * u.x;
                body_arr[i].acc.y += size_of_acc * u.y;
                body_arr[i].acc.z += size_of_acc * u.z;
                body_arr[j].acc.x -= size_of_acc * u.x;
                body_arr[j].acc.y -= size_of_acc * u.y;
                body_arr[j].acc.z -= size_of_acc * u.z;
            }
        }
    }
}
function add_velocity(body_arr){
    //a = dv/dt, dv = adt
    //console.log(body_arr);
    for(let i = 0; i<Body_cnt; i++){
        //console.log(body_arr[i].vel);
        body_arr[i].vel.x += body_arr[i].acc.x * dt;
        body_arr[i].vel.y += body_arr[i].acc.y * dt;
        body_arr[i].vel.z += body_arr[i].acc.z * dt;
        //console.log(body_arr[i].vel);
    }
}
function add_dist(body_arr){
    //a = dv/dt, dv = adt
    for(let i = 0; i<Body_cnt; i++){
        body_arr[i].loc.x += body_arr[i].vel.x * dt;
        body_arr[i].loc.y += body_arr[i].vel.y * dt;
        body_arr[i].loc.z += body_arr[i].vel.z * dt;
        //console.log(body_arr[i].loc);
    }
}
function move_obj(body_arr){
    for(let i = 0; i<Body_cnt; i++){
        real_bodies[i].position.x = (body_arr[i].loc.x * scale);
        real_bodies[i].position.y = (body_arr[i].loc.y * scale);
        real_bodies[i].position.z = (body_arr[i].loc.z * scale);
    }
}
function rep(body_arr){
    calc_acceleration(body_arr);
    add_velocity(body_arr);
    add_dist(body_arr);
    move_obj(body_arr);
}
//before run
body_array = make_Body_array();
Bodies_print(body_array);
//run
function animate(){
    requestAnimationFrame(animate);
    rep(body_array);
    controls.update();
    renderer.render(scene, camera);
}
animate();
