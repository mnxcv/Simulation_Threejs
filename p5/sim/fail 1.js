//parameters
const body_cnt = 50;
const body_size = 3;
const placing_radius = 10;
const bg_color = "black";
const dot_color = "white";
const fps = 100;
const dt = 1/fps;
const grav_const = 10;
const body_mass = 10;
const randmax = 1;
const randmin = 1;
//중심 : width/2, height/2임


class Body{
  constructor(mass){
    this.xloc;
    this.yloc;
    this.xvel = 0;
    this.yvel = 0;
    this.mass = body_mass;
    this.xacc = 0;
    this.yacc = 0;
  }
  distsq(Body){
    let xdiff = this.xloc - Body.xloc;
    let ydiff = this.yloc - Body.yloc;
    return xdiff*xdiff + ydiff*ydiff;
  }
  anglevec(Body){
    let xdiff = Body.xloc - this.xloc;
    let ydiff = Body.yloc - this.yloc;
    let diffnorm = xdiff * xdiff + ydiff * ydiff;
    return [xdiff/diffnorm, ydiff/diffnorm];
  }
}
/*bodies definition*/
let bodies = [];
for(let i = 0; i<body_cnt; i++){
  let body = new Body();
  bodies.push(body);
}
/*drawing functions*/
function reset(){
  background(bg_color);
}
function all_dots_draw(){
  for(let i = 0; i<body_cnt; i++){
    noStroke();
    fill(dot_color);
    ellipse(bodies[i].xloc + width/2, bodies[i].yloc + height/2, body_size, body_size);
  }
}
/*moving functions*/
function bodies_loc_init(){
  const rotating = 2 * Math.PI / body_cnt;
  let angle = 0;
  for(let i = 0; i<body_cnt; i++){
    let xmulrandseed = Math.random();
    let ymulrandseed = Math.random();
    let xmul = randmin * (1 - xmulrandseed) + randmax * xmulrandseed;
    let ymul = randmin * (1 - ymulrandseed) + randmax * ymulrandseed;
    bodies[i].xloc = placing_radius * Math.cos(angle) * xmul;
    bodies[i].yloc = placing_radius * Math.sin(angle) * ymul;
    angle += rotating;
  }
}
function setAcc(){
  for(let i = 0; i < body_cnt; i++){
    bodies[i].xacc = 0;
    bodies[i].yacc = 0;
  }
  for(let i = 0; i < body_cnt; i++){
    for(let j = 0; j < body_cnt; j++){
      if(i<j){
        let distsq = bodies[i].distsq(bodies[j]);
        let aveci = bodies[i].anglevec(bodies[j]);
        let avecj = bodies[j].anglevec(bodies[i]);
        let totacc = grav_const * body_mass / distsq;
        //a = GM/r^2
        bodies[i].xacc += totacc * aveci[0];
        bodies[i].yacc += totacc * aveci[1];
        bodies[j].xacc += totacc * avecj[0];
        bodies[j].yacc += totacc * avecj[1];
      }
    }
  }
}
function setSpeed(){
  //a = dv/dt
  //adt = dv
  for(let i = 0; i < body_cnt; i++){
    let dvx = bodies[i].xacc * dt;
    let dvy = bodies[i].yacc * dt;
    bodies[i].xvel += dvx;
    bodies[i].yvel += dvy;
  }
}
function setloc(){
  //v = ds/dt
  //vdt = ds
  for(let i = 0; i < body_cnt; i++){
    let dsx = bodies[i].xvel * dt;
    let dsy = bodies[i].yvel * dt;
    bodies[i].xloc += dsx;
    bodies[i].yloc += dsy;
  }
}
function collisonchk(){

}

function setup(){
  createCanvas(windowWidth, windowHeight);
  reset();
  frameRate(fps);
  
  bodies_loc_init();
}

function draw(){
  reset();
  setAcc();
  setSpeed();
  setloc();
  all_dots_draw();
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  reset();
}