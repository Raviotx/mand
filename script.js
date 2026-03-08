// ---------- TABULEIRO DE XADREZ ----------
const canvas = document.getElementById('chessboard');
const ctx = canvas.getContext('2d');
const size = 8;
let queen = {row: 7, col: 3};
let king = {row: 0, col: 4};

function resizeChessCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientWidth;
}
window.addEventListener('resize', resizeChessCanvas);
resizeChessCanvas();

function getTileSize() {
    return canvas.width / size;
}

function drawBoard() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const tileSize = getTileSize();
    for(let row=0; row<size; row++){
        for(let col=0; col<size; col++){
            ctx.fillStyle = (row+col)%2===0 ? '#f0d9b5' : '#b58863';
            ctx.fillRect(col*tileSize, row*tileSize, tileSize, tileSize);
        }
    }
    ctx.font = `${tileSize*0.8}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillStyle = "white";
    ctx.fillText("♕", queen.col*tileSize + tileSize/2, queen.row*tileSize + tileSize/2);
    ctx.strokeText("♕", queen.col*tileSize + tileSize/2, queen.row*tileSize + tileSize/2);

    ctx.fillStyle = "black";
    ctx.fillText("♔", king.col*tileSize + tileSize/2, king.row*tileSize + tileSize/2);
}

drawBoard();

canvas.addEventListener('click', () => {
    moveQueenToKing();
});

function moveQueenToKing() {
    const dx = king.col - queen.col;
    const dy = king.row - queen.row;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    let step = 0;

    const moveInterval = setInterval(() => {
        if(step >= steps){
            clearInterval(moveInterval);
            document.getElementById('chess-container').classList.add('hidden');
            document.getElementById('animation-container').classList.remove('hidden');
            resizeSunCanvas();
            startAnimation();
            return;
        }
        queen.col += dx/steps;
        queen.row += dy/steps;
        drawBoard();
        step++;
    }, 200);
}

// ---------- ANIMAÇÃO CÉU + GIRASSÓIS + FRASE ----------
const sunCanvas = document.getElementById('sunflower-canvas');
const sunCtx = sunCanvas.getContext('2d');

function resizeSunCanvas() {
    sunCanvas.width = sunCanvas.clientWidth;
    sunCanvas.height = sunCanvas.clientWidth * 0.75; // proporção 4:3
}
window.addEventListener('resize', resizeSunCanvas);
resizeSunCanvas();

let sunflowers = [];
let stars = [];
let textAlpha = 0;

// estrelas
for(let i=0;i<200;i++){
    stars.push({
        x: Math.random()*sunCanvas.width,
        y: Math.random()*sunCanvas.height,
        radius: Math.random()*2+1,
        alpha: Math.random(),
        delta: Math.random()*0.02
    });
}

function createSunflower() {
    for(let i=0;i<3;i++){
        const x = Math.random() * sunCanvas.width;
        const y = -50;
        const size = 20 + Math.random()*25;
        const speed = 1 + Math.random()*2; // mais lento e natural
        const sway = Math.random()*0.05;   // balançando levemente
        sunflowers.push({x,y,size,speed,sway,angle:0});
    }
}

function drawAnimation() {
    sunCtx.fillStyle = "#0b0c2a";
    sunCtx.fillRect(0,0,sunCanvas.width,sunCanvas.height);

    // estrelas piscando
    for(let star of stars){
        sunCtx.beginPath();
        sunCtx.arc(star.x, star.y, star.radius,0,Math.PI*2);
        sunCtx.fillStyle = `rgba(255,255,255,${star.alpha})`;
        sunCtx.fill();
        star.alpha += (Math.random()*0.04 - star.delta);
        if(star.alpha<0) star.alpha=0;
        if(star.alpha>1) star.alpha=1;
    }

    // girassóis
    sunCtx.font = `${sunCanvas.width*0.04}px Arial`;
    for(let sf of sunflowers){
        sunCtx.save();
        sf.angle += sf.sway;
        sunCtx.translate(sf.x + Math.sin(sf.angle)*5, sf.y,);
        sunCtx.rotate(sf.angle);
        sunCtx.fillText("🌻", -sf.size/2, sf.size/2);
        sunCtx.restore();
        sf.y += sf.speed;
    }
    sunflowers = sunflowers.filter(sf => sf.y < sunCanvas.height+50);

    // frase central
    if(textAlpha<1) textAlpha += 0.01;
    sunCtx.font = `${sunCanvas.width*0.06}px 'Comic Sans MS', cursive, sans-serif`;
    sunCtx.textAlign = "center";
    sunCtx.fillStyle = `rgba(255,255,255,${textAlpha})`;
    sunCtx.shadowColor = "yellow";
    sunCtx.shadowBlur = 25;
    sunCtx.fillText("Feliz Dia da mulher para aquela que é amada", sunCanvas.width/2, sunCanvas.height/2);
    sunCtx.shadowBlur = 0;
}

function startAnimation() {
    setInterval(createSunflower, 100);
    requestAnimationFrame(loop);
}

function loop() {
    drawAnimation();
    requestAnimationFrame(loop);
}