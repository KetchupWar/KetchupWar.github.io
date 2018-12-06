var c=document.getElementById("myCanvas");
  c.width  = window.innerWidth;
  c.height = window.innerHeight;
  var ctx=c.getContext("2d");
  var i;
  var c;
  var w;
  var d;
  var t;
  
  // event.clientX
  // event.clientY
  
  // Keypresses
  var keys = {};
  window.onkeyup = function(e) { keys[e.keyCode] = false; }
  window.onkeydown = function(e) { keys[e.keyCode] = true; }
  // Initiate standard variables
  var dir;
  var dis;
  var xrot = 0;
  var yrot = 0;
  var zrot = 0;
  var x1;
  var y1;
  var z1;
  var px = 0;
  var py = 0;
  var pz = 0;
  var fov = 1.5;
  var yvel = 0;
  // Z order terms
  var newedge = [];
  var zterms = [];
  var avz = 0;
  var furtherlen;
  var furtheritem;
  
  // 3D Data
  var edges = [];
  var edgetype = [];
  var nodesX = [];
  var nodesY = [];
  var nodesZ = [];
  
  function drawdata() {
    // 3D Data
    nodesX = [-100,100,100,-100,-100,100,100,-100,300,-300];
    nodesY = [100,100,-100,-100,100,100,-100,-100,0,0];
    nodesZ = [100,100,100,100,-100,-100,-100,-100,0,0];
    edges = [[0,1,2,3],[1,2,7,8],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7],[8,8],[9,9]];
    edgetype = [1,1,1,1,1,1,1,1,1,1,1,1,2,2];
  }
  
  function rendershape() {
    if (edgetype[i] == 1) {
      ctx.beginPath();
      for (t=0;t<edges[i].length;t++) {
        gotoxyz(nodesX[edges[i][t]],nodesY[edges[i][t]],nodesZ[edges[i][t]]);
        if (z1>0) {
          perspective(x1,y1,z1);
          if (t==0) {
            ctx.moveTo(x1,y1);
          }
          else {
            ctx.lineTo(x1,y1);
          }
        }
      }
      ctx.fillStyle = "rgba(0, 0, 255)";
      ctx.fill();
      ctx.stroke();
      
    }
    if (edgetype[i] == 2) {
      gotoxyz(nodesX[edges[i][0]],nodesY[edges[i][0]],nodesZ[edges[i][0]]);
      perspective(x1,y1,z1);
      if (z1>0) {
        var img=document.getElementById("tree");
        var isize = (200*(210/(z1/fov)))
        pointto(nodesY[edges[i][0]]+py,Math.abs((nodesY[edges[i][0]]+500)-pz));
        // Get Angle
        x1 = nodesX[edges[i][0]]-px;
        y1 = -(nodesY[edges[i][0]]-py);
        z1 = (nodesZ[edges[i][0]]+500)-pz;
        pointto(x1,z1); // Y rotation
        x1 = dis*Math.sin(dir + (yrot)*Math.PI/180);
        z1 = dis*Math.cos(dir + (yrot)*Math.PI/180);
        pointto(y1,z1); // X Rotation
        y1 = dis*Math.sin(dir + (xrot)*Math.PI/180);
        z1 = dis*Math.cos(dir + (xrot)*Math.PI/180);
        var angle=dir;
        // Get Angle
        gotoxyz(nodesX[edges[i][0]],nodesY[edges[i][0]],nodesZ[edges[i][0]]);
        perspective(x1,y1,z1);
        ctx.drawImage(img,x1-isize/2,(y1-isize/2)+(isize-isize*Math.cos(angle)),isize,isize*Math.cos(angle));
      }
    }
  }
  function zorder() {
    for (d=0;d<edges.length;d++) {
      furtherlen = -999999999999999999999999999999999999999999999999;
      furtheritem = d;
      i = furtheritem;
      rendershape();
      edges.splice(furtheritem, 1);
      edgetype.splice(furtheritem, 1);
      d-=1;
    }
  }
  
  function pointto(x,y) {
    dir = Math.atan2(x,y);
    dis = Math.sqrt(x*x+y*y);
  }
  function perspective(x,y,z) {
    x1 = (200*(x/(z/fov)))+window.innerWidth/2;
    y1 = (200*(y/(z/fov)))+window.innerHeight/2;
  }
  function gotoxyz(x,y,z) {
    x1 = x-px;
    y1 = -(y-py);
    z1 = (z+500)-pz;
    pointto(x1,z1); // Y rotation
    x1 = dis*Math.sin(dir + (yrot)*Math.PI/180);
    z1 = dis*Math.cos(dir + (yrot)*Math.PI/180);
    pointto(y1,z1); // X Rotation
    y1 = dis*Math.sin(dir + (xrot)*Math.PI/180);
    z1 = dis*Math.cos(dir + (xrot)*Math.PI/180);
    pointto(x1,y1); // Z rotation
    x1 = dis*Math.sin(dir + (zrot)*Math.PI/180);
    y1 = dis*Math.cos(dir + (zrot)*Math.PI/180);
  }
  function control() {
    if (keys["38"]) {xrot+=1} // Up
    if (keys["40"]) {xrot-=1} // Down
    if (keys["37"]) {yrot+=1} // Left
    if (keys["39"]) {yrot-=1} // Right
    // Movement
    if (keys["87"]) { // Forward
      pz += 2*Math.cos(yrot*Math.PI/180);
      px += -2*Math.sin(yrot*Math.PI/180);
    }
    if (keys["83"]) { // Forward
      pz += -2*Math.cos(yrot*(Math.PI/180));
      px += 2*Math.sin(yrot*Math.PI/180);
    }
    if (keys["65"]) { // Move Left
      pz += -2*Math.cos((yrot-90)*(Math.PI/180));
      px += 2*Math.sin((yrot-90)*Math.PI/180);
    }
    if (keys["68"]) { // Move Right
      pz += -2*Math.cos((yrot+90)*(Math.PI/180));
      px += 2*Math.sin((yrot+90)*Math.PI/180);
    }
    if (keys["32"] && py<2) { // Jump
      yvel = 22;
    }
    py+=yvel;
    yvel-=1;
    if (py < 0) {
      py=0;
      yvel=0;
    }
  }
  function step() {
    ctx.clearRect(0, 0, c.width, c.height);
    var img=document.getElementById("back");
    ctx.drawImage(img,0,0,c.width,c.height)
    drawdata();
    zorder();
    control();
    window.requestAnimationFrame(step);
  }
  window.requestAnimationFrame(step);
