let tablero = document.querySelector("#tetris"); //busca en el html un elemento con el id "tetris" y lo guarda en una variable llamada tablero
let scoreboard = document.querySelector("h2"); //mostrará la puntuación
let areaInstrucciones = document.getElementById("areaInstrucciones");
let formularioNombre = document.getElementById("formularioNombre");
let stop = document.getElementById("reiniciar");
let ctx = tablero.getContext("2d"); //permite dibujar en el tablero y se le da contexto 2D
ctx.scale(30,30); //he ajustado el tamaño de los bloques del tetris
let falling = false; //crea una variable llamada falling y la inicializa como false, controla si las piezas del tetris están cayendo o no

//INSTRUCCIONES INICIALES
areaInstrucciones.value = "¡Bienvenido al tetris! Por favor, escribe tu nombre";

//SE CAPTURA EL ENVÍO DEL NOMBRE PARA EMPEZAR EL JUEGO
formularioNombre.addEventListener("submit", function(event) { //cuando se envia el formulario dandole a empezar, esta funcion se activa
    event.preventDefault(); //evita que el formulario se envíe y la pag se recargue
    let nombreJugador = document.getElementById("nombre").value; //obtiene el valor ingresado en el campo de texto con el id "nombre" y lo guarda en una variable llamada nombreJugador, que luego aparecerá en las instrucciones
    areaInstrucciones.value = `¡Hola ${nombreJugador}! Aquí están las instrucciones: 
    - Usa las flechas izquierda y derecha del teclado para mover las piezas
    - Usa la flecha de arriba para rotarlas
    - Usa la flecha de abajo para que bajen más rápido.`;
    formularioNombre.style.display = "none"; //ocultar el formulario después de empezar el juego
    tablero.focus(); //enfoca el tablero para que el usuario pueda interactuar sin hacer clic
    setInterval(newGameState,500); //establece un temporizador que ejecuta la funcion newgamestate
});

stop.addEventListener("reiniciar", function(event) {
    clearInterval();
});


const SHAPES = [ //aquí he definido la forma de las piezas donde el 1 significa que será visible el color y el 0 que no. El 1 representa el color.
    [
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0]
    ],
    [
        [0,1,0],  
        [0,1,0],  
        [1,1,0]   
    ],
    [
        [0,1,0],
        [0,1,0],
        [0,1,1]
    ],
    [
        [1,1,0],
        [0,1,1],
        [0,0,0]
    ],
    [
        [0,1,1],
        [1,1,0],
        [0,0,0]
    ],
    [
        [1,1,1],
        [0,1,0],
        [0,0,0]
    ],
    [
        [1,1],
        [1,1],
    ]
]

const COLORS = [ //Aquí he definido el color de las formas. Cada color será el color de cada forma (en orden)

    "#EEFFFC",
    "#FFEAC5",
    "#B8FF9C",
    "#9CFFEA",
    "#9CB2FF",
    "#DBB0FF",
    "#FFB0ED",
    "#FFE1EB"
]
//Define el número de filas y columnas del juego
const ROWS = 20;
const COLS = 10;

let grid = generateGrid();
let piezaCayendo = null;
let score = 0;

function newGameState(){ //verifica si alguna fila está completamente llena y la elimina, actualizando la puntuación del jugador en función del número de filas eliminadas.
    checkGrid();
    if(!piezaCayendo){ //Aquí tenemos una condición if, donde si no hay ninguna pieza cayendo, genera una aleatoria
        piezaCayendo = generaPiezaAleatoria();
        dibujaPieza();
    }
    moveDown();
}

function checkGrid(){
    let count = 0; //Lo primero nos lleva la cuenta de cuántas filas se han llenado completamente. Aquí debajo tenemos condiciones donde según las filas que se llenen nos dan X puntuación.
    for(let i=0;i<grid.length;i++){ //El primer bucle “for” recorre cada fila del tablero.
        let allFilled = true; //Inicializa una variable allFilled en true que se utilizará para verificar si todas las celdas de una fila están llenas.
        for(let j=0;j<grid[0].length;j++){ //El segundo bucle “for” recorre cada celda de la fila actual.
            if(grid[i][j] == 0){ // Si encuentra una celda vacía (representada por 0), establece allFilled en false.
                allFilled = false //Después de verificar todas las celdas de una fila, si allFilled sigue siendo true, significa que la fila está completamente llena.
            }
        }
        if(allFilled){
            count++;
            grid.splice(i,1);
            grid.unshift([0,0,0,0,0,0,0,0,0,0]);
        }
//Dentro de este bloque if, que se ejecutará si allFilled es true
//- incrementa count para registrar que una fila está completa
//- elimina esa fila del tablero con grid.splice(i,1)
//-agrega una nueva fila vacía al principio del tablero con grid.unshift([0,0,0,0,0,0,0,0,0,0]). 

    }
    if(count == 1){
        score+=10;
    }else if(count == 2){
        score+=30;
    }else if(count == 3){
        score+=50;
    }else if(count>3){
        score+=100
    }
    scoreboard.innerHTML = "Puntuación: " + score;
}

function generateGrid(){ //crea un nuevo tablero vacío con un número de filas y columnas predefinido (ROWS y COLS) y llena cada celda con ceros, por lo que no hay ninguna pieza en esa posición.
    let grid = [];
    for(let i=0;i<ROWS;i++){
        grid.push([]);
        for(let j=0;j<COLS;j++){
            grid[i].push(0)
        }
    }
    return grid;
}

function generaPiezaAleatoria(){ 
    let ran = Math.floor(Math.random()*7); //Esto elige un número aleatorio entre 0 y 6 (inclusive), que se utiliza para seleccionar una forma aleatoria de pieza de Tetris.
    //El Math.random() genera un número decimal entre 0 y 1, y al multiplicarlo por 7 y aplicar Math.floor(), se convierte en un número entero entre 0 y 6.
    let piece = SHAPES[ran];
    let colorIndex = ran+1;
    let x = 4; //Establece las coordenadas iniciales (x e y) donde se colocará la pieza en el tablero. 
    let y = 0;
    return {piece,colorIndex,x,y}
}

function dibujaPieza(){ //dibuja la pieza que está cayendo en el tablero
    let piece = piezaCayendo.piece; //Obtiene la forma de la pieza que está cayendo en el juego. 
    for(let i=0;i<piece.length;i++){ //El doble bucle for se utiliza para recorrer cada celda de la pieza, y la condición if verifica si la celda actual de la pieza está ocupada (representada por 1).
        for(let j=0;j<piece[i].length;j++){
            if(piece[i][j] == 1){
            ctx.fillStyle = COLORS[piezaCayendo.colorIndex];
            ctx.fillRect(piezaCayendo.x+j,piezaCayendo.y+i,1,1);
        }
        }
    }
}

function moveDown(){ // se encarga de mover la pieza que está cayendo hacia abajo en el tablero.
    if(!collision(piezaCayendo.x,piezaCayendo.y+1)) //Comprueba si hay una colisión entre la pieza y el tablero si se mueve hacia abajo. Si no hay colisión, la pieza se mueve hacia abajo.
        piezaCayendo.y+=1;
    else{
        let piece = piezaCayendo.piece
        for(let i=0;i<piece.length;i++){
            for(let j=0;j<piece[i].length;j++){
                if(piece[i][j] == 1){
                    let p = piezaCayendo.x+j;
                    let q = piezaCayendo.y+i;
                    grid[q][p] = piezaCayendo.colorIndex;
                }
            }
        }
        if(piezaCayendo.y == 0){ //Si hay colisión, la función coloca la pieza en su posición actual en el tablero y comprueba si la pieza ha alcanzado la parte superior del tablero. Si lo ha hecho, muestra un mensaje de "Has perdido", se reseteará el marcador a 0 y se generará una nueva grid con la función:
            alert("game over");
            grid = generateGrid();
            score = 0;
        }
        piezaCayendo = null;
    }
    renderGame();
}

function moveLeft(){
    if(!collision(piezaCayendo.x-1,piezaCayendo.y))
        piezaCayendo.x-=1;
    renderGame();
}

function moveRight(){
    if(!collision(piezaCayendo.x+1,piezaCayendo.y))
        piezaCayendo.x+=1;
    renderGame();
}

function rotate(){ //Crea una matriz vacía llamada rotatedPiece que almacenará la pieza rotada.
//Copia la forma de la pieza actual (piezaCayendo.piece) en la matriz piece.
//Crea una nueva matriz (rotatedPiece) con las mismas dimensiones que la pieza actual.
//Utiliza dos bucles for anidados para recorrer cada celda de la pieza actual (piece) y copiar su contenido en la matriz rotatedPiece, pero intercambiando las filas y columnas, rotando la pieza 90 grados en sentido horario.
    
    let rotatedPiece = [];
    let piece = piezaCayendo.piece;
    for(let i=0;i<piece.length;i++){
        rotatedPiece.push([]);
        for(let j=0;j<piece[i].length;j++){
            rotatedPiece[i].push(0);
        }
    }
    for(let i=0;i<piece.length;i++){
        for(let j=0;j<piece[i].length;j++){
            rotatedPiece[i][j] = piece[j][i]
        }
    }

    for(let i=0;i<rotatedPiece.length;i++){
        rotatedPiece[i] = rotatedPiece[i].reverse();
    }
    if(!collision(piezaCayendo.x,piezaCayendo.y,rotatedPiece))
        piezaCayendo.piece = rotatedPiece
    renderGame()
}

function collision(x,y,rotatedPiece){ //verifica si hay una colisión entre la pieza y el tablero en una posición determinada. Toma las coordenadas x e y de la pieza y opcionalmente una versión rotada de la pieza. Retorna true si hay una colisión y false si no la hay.
    let piece = rotatedPiece || piezaCayendo.piece
    for(let i=0;i<piece.length;i++){
        for(let j=0;j<piece[i].length;j++){
            if(piece[i][j] == 1){
            let p = x+j;
            let q = y+i;
            if(p>=0 && p<COLS && q>=0 && q<ROWS){
                if(grid[q][p]>0){
                    return true;
                }
            }else{
                return true;
            }}
        }
    }
    return false;
}

function renderGame(){
    for(let i=0;i<grid.length;i++){
        for(let j=0;j<grid[i].length;j++){
            ctx.fillStyle = COLORS[grid[i][j]];
            ctx.fillRect(j,i,1,1)
        }
    }
    dibujaPieza();
}

document.addEventListener("keydown",function(e){ 
    let key = e.key;
    if(key == "ArrowDown"){
        moveDown();
    }else if(key == "ArrowLeft"){
        moveLeft();
    }else if(key == "ArrowRight"){
        moveRight();
    }else if(key == "ArrowUp"){
        rotate();
    }
})
