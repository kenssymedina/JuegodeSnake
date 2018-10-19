'use strict';

window.addEventListener('load', init);
document.addEventListener('keydown', readKey);

var canvas ;
var ctx ;
var lastkey;
var body = new Array();
var keys = {UP: 38,RIGHT: 39, DOWN:40, LEFT:37, ENTER:13, SPACE:32 }
var pause = true;
var dir =1;
var food;
var eat;
var die;
var collisions = 0;
var speed = 200;

// TAREA
var contador = 8;
var obstaculos = new Array();
var nivel = 1;
// UP: 0, RIGHT:1, DOWN:2, LEFT:3

//BLOQUES QUE SALGAN DE LA IZQUIERDA
var bloques = new Array();
var bloques2 = new Array();
var velocidadAlea = new Array();
var velocidadAlea2 = new Array();

function init()
{
    canvas = document.querySelector('#canvas');
    ctx = canvas.getContext('2d');
    eat = new Audio();
    die = new Audio();

    eat.src = 'assets/chomp.oga';
    die.src = 'assets/dies.oga';

    // validacion para saber si hay datos en localStorage
    if ('guardado' in localStorage) 
    {
        console.log('Estoy en algo guardado');
        guardado();
        localStorage.removeItem('guardado');
        
        
    } else {
        console.log('No estoy en algo guardado');
        
        reiniciar();
        localStorage.setItem('guardado', true);
    }

    //para hacer que los obstaculos salgan alineados arriba
    // var acum;
    var x = 5;
    for (let i = 0; i< 13; i++) {
        x +=10;
        bloques.push(new Rectangle(x, 10, 10,10, '#FFF', 'assets/muro11.png'));

        x +=10;
    }

     //para hacer que los obstaculos salgan alineados de la izquierda
     // recordar repintarlos, en paint
    // var acum;
    var y = 30;
    for (let i = 0; i< 10; i++) {
        y +=10;
        bloques2.push(new Rectangle(10, y, 10,10, '#FFF', 'assets/muro1.png'));

        y +=15;
    }
    
    
    move();
    rePaint();

    // ctx.fillStyle = '#fff';
    // ctx.fillRect(50, 50, 10,10);
}

function paint ()
{
    // PAINT se encarga de pintar toda la pantalla
    ctx.fillStyle = '#000'; // una propiedad
    ctx.fillRect(0 , 0 , canvas.width , canvas.height); // este es un metodo
    ctx.fillStyle = '#fff'; // una propiedad
    
    if (pause)
    {
        ctx.font='20px Arial';
        ctx.fillText('PRESIONE ENTER',  60,140);  
        ctx.fillText('PARA INICIAR',  80,170);    
    }else{
        
        ctx.font='12px Arial';
        ctx.fillText('Key: ' + lastkey,110,20);
        ctx.fillText('Scores: ' + collisions,20,20);
        ctx.fillText('Nivel:' +nivel, 240,20);


    }
    

    
    food.paintImage(ctx);

    for (let i = 0;i < body.length; i++)
    {
        body[i].paintImage(ctx);
    }

    
    for (let i = 0;i < obstaculos.length; i++)
    {
        obstaculos[i].paintImage(ctx);
    }

    // PPINTO LOS BLOQUES QUE VIENEN DE ARRIBA
    for (let i = 0;i < bloques.length; i++)
    {
        bloques[i].paintImage(ctx);
    }
    //PINTO LOS BLOQUES QUE VIENEN DE LA IZQUIERDA
    for (let i = 0;i < bloques2.length; i++)
    {
        bloques2[i].paintImage(ctx);
    }
    
}

function move()
{
    setTimeout(move, speed);
    setDirection();
}

function setDirection()
{
    if (lastkey == keys.ENTER || lastkey == keys.SPACE)
    {
        pause = !pause;
        lastkey = null;
    }

            // USAR LOCALSTORAGE para guardar los puntos
        //console.log('puntos: '+ localStorage.getItem('collision'));
        localStorage.setItem('collision',collisions);

        // USAR LOCALSTORAGE para guardar el nivel
        //console.log('Nivel: '+ localStorage.getItem('nivel'));
        localStorage.setItem('nivel',nivel);
        
        // USAR LOCALSTORAGE para guardar el nivel
        //console.log('Contador: '+ localStorage.getItem('contador'));
        localStorage.setItem('contador',contador);

        // USAR LOCALSTORAGE para guardar el cuerpo
        localStorage.setItem('body',JSON.stringify(body));

        // USAR LOCALSTORAGE para guardar los obstaculos
        localStorage.setItem('obstaculos',JSON.stringify(obstaculos));

        // USAR LOCALSTORAGE para guardar la comida
        localStorage.setItem('food',JSON.stringify(food));

    if (!pause) 
    {

        // Nuevo OBSTACULO
        if (collisions == contador) 
        {
            for (let i = 0; i < 2; i++) {
                console.log('nuevo obstaculo');
                let obstaX = random(canvas.width / 10 -1 ) * 10;
                let obstaY = random(canvas.height / 10 -1) * 10;
                obstaculos.push(new Rectangle(obstaX,obstaY,10,10, '#F0291D', 'assets/muro1.png'));
            }
            contador += 8;
        }

        // para recorrer un ARREGLOOOOO, y saber cuando intercepta con un obstaculo
        for (let i = 0; i < obstaculos.length; i++) {
            
            if (body[0].intersects(obstaculos[i])) 
            {
                //si colisiona con un obstaculo, que pierda parte de su cuerpo
                // console.log(i);
                body.pop(); // pop es el ultimo
                // ahora elimino parte del cuerpo
                console.log(body.length);// length es el tamano del cuerpo
                if (body.length < 1) 
                {
                    console.log('haz muerto');
                    reiniciar();
                    die.play();    
                }
                console.log('si toco el obstaculos'); 
            }
        }

        // REINICIAR DESPUES DE HABER TOCADO MI CUERPO
        for (let i = 2; i < body.length; i++) {
            if (body[0].intersects(body[i])) {
               reiniciar();
               die.play();
            }
        }


                
        // verificar colision con el cuerpo
        for(let i = 3; i< body.length; i ++)
        {
            // que cuando toque su cuerpo, se reinicie el juego
            if(body[0].intersects (body[i]))
            {
                console.log('colision con el cuerpo');
                
            }
            
            //sonido cuando colisione con el cuerpo
            //die.play();
        }
        // verificar colision con la comida
        if (body[0].intersects(food)) 
        {
            collisions +=1;
            body.push(new Rectangle(food.x, food.y, 10, 10 , '#fff', 'assets/body.png'));
            food.x = random(canvas.width / 10 -1 ) * 10;
            food.y = random(canvas.height / 10 -1) * 10;

            //sonido cuando coma\
            eat.play();
            // NIVELES TAMBIEN Y DE PASO AGREGUE LA VELOCIDAD

            if(collisions == 5)
            {
                speed -= 5;
                nivel = 2;
            }
                
            else if (collisions == 10)
            {
                speed -= 5;
                nivel = 3
            }
                
            else if (collisions == 15)
            {
                speed -= 5;
                nivel = 4;
            }
                
            else if (collisions == 20)
            {
                speed -= 5;
                nivel = 5;
            }
            
            else if( collisions == 25)
            {
                speed -=5;
                nivel = 6;
            }
        }

        // AHORA PARA BLOQUEAR LAS PAREDES CUANDO LLEGUE AL NIVEL 6
        //console.log(`x: ${body[0].x} Y: ${body[0].y}`); 
        // esto me sirve para saber la distancia de culebra en cierto punto JAMAS BORRAR

       

        if (nivel == 6) 
        {

            console.log('nivel6 de la muerte');
            //validar que los bordes sean mortales
            if ((body[0].x >= 0 && body[0].y == 0 ) || 
                (body[0].x == 0 && body[0].y >= 0 ) ||
                (body[0].x == 290 && body[0].y >= 0 ) ||
                (body[0].x >= 0 && body[0].y == 290 ) ) 
            {
                console.log('moriste');
                reiniciar();
                die.play();
                
            }  
        }
        //para que el cuerpo siga a la cabeza
        for (let i = body.length - 1; i > 0; i--) 
        {
            body[i].x = body[i - 1].x;
            body[i].y = body[i - 1].y;
        }
        //para darle direccion al cuerpo de la culebrita(sin que se regrese)
        if (lastkey == keys.UP && dir !=2)
            dir= 0;
        
        if (lastkey == keys.RIGHT && dir !=3)
            dir= 1;

        if (lastkey == keys.DOWN && dir !=0)
            dir= 2;

        if (lastkey == keys.LEFT && dir !=1)
            dir= 3;
        
        //copia
        if (dir == 0)
            body[0].y -= 10;
        
        if (dir == 1)
            body[0].x += 10;

        if (dir == 2)
            body[0].y += 10;

        if (dir == 3)
            body[0].x -= 10;


        //     if (lastkey == keys.UP && dir !=2)
        //     body[0].y -= 10;
        
        // if (lastkey == keys.RIGHT && dir !=3)
        //     body[0].x += 10;

        // if (lastkey == keys.DOWN && dir !=0)
        //     body[0].y += 10;

        // if (lastkey == keys.LEFT && dir !=1)
        //     body[0].x -= 10;


        // para regresar el cuerpo en el sentido opuesto
        if (body[0].x > canvas.width)
            body[0].x = -10;

        if (body[0].x + body[0].w < 0)
            body[0].x = canvas.width;

        if (body[0].y > canvas.height)
            body[0].y = -10;

        if (body[0].y + body[0].h < 0)
            body[0].y = canvas.height;


        //para darle velocidad a los bloques que caeran de arriba

        for (let i = 0; i < bloques.length; i++) {
            let movRandom = random(5);
            // por si esta entre 0 y 3 que vuelva a darle otra velocidad
            while(movRandom >= 0 && movRandom < 3) {
                movRandom = random(5);  
                
            }
            // para que cada bloque tenga su propia velocidad
            velocidadAlea.push(movRandom);
            bloques[i].y += velocidadAlea[i];

            // para que cuando caigan los bloques regresen de arriba tambien
            if (bloques[i].y > 300) 
            {
                bloques[i].y = 0;  
            }
            
        }

        //CREA BLOQUES ALEATORIOS 
        //para darle velocidad a los bloques que caeran de la IZQUIERDA

        for (let i = 0; i < bloques2.length; i++) {
            let movRandom = random(5);// el 5 es que tan rapido se movera
            // por si esta entre 0 y 3 que vuelva a darle otra velocidad
            while(movRandom >= 0 && movRandom < 3) {
                movRandom = random(5);  
                
            }
            // para que cada bloque tenga su propia velocidad
            velocidadAlea2.push(movRandom);
            bloques2[i].x += velocidadAlea2[i];

            // para que cuando caigan los bloques regresen de arriba tambien
            if (bloques2[i].x > 290) 
            {
                bloques2[i].x = 0;  
            }
            
            
        }

        //DETECTAR COLISIONES DE LOS BLOQUES QUE CAEN DE ARRIBA Y SALEN DE LA IZQUIERDA
        for (let i = 0; i < bloques.length; i++) 
        {
            if (body[0].intersects(bloques[i])) 
            {
                reiniciar();
                die.play();   
            } 
        }

        //DETECTAR COLISIONES DE LOS BLOQUES QUE SALEN DE LA IZQUIERDA
        for (let i = 0; i < bloques2.length; i++) 
        {
            if (body[0].intersects(bloques2[i])) 
            {
                reiniciar();
                die.play();   
            } 
        }
        

    }    
}




function reiniciar()
{
    body.splice(0,body.length);
    obstaculos.splice(0,obstaculos.length);
    collisions = 0;
    contador = 8;

    // si solo quiero que aparezca la cabeza y quito el cuerpo
    body.push(new Rectangle(50, 50, 10, 10, '#DCF70E', 'assets/head.png'));
    body.push(new Rectangle(40, 50, 10, 10, '#fff', 'assets/body.png'));
    body.push(new Rectangle(30, 50, 10, 10, '#fff', 'assets/body.png'));
    body.push(new Rectangle(20, 50, 10, 10, '#fff', 'assets/body.png'));

    let obstaX = random(canvas.width / 10 -1 ) * 10;
    let obstaY = random(canvas.height / 10 -1) * 10;
    food = new Rectangle(obstaX,obstaY,10,10, '#F0291D', 'assets/fruit.png');

    console.log('colision con el mismo cuerpo');
    pause = true;

    nivel = 1;
}

function guardado() 
{
    body.splice(0,body.length);
    obstaculos.splice(0,obstaculos.length);
    collisions = parseInt(localStorage.getItem('collision'));
    nivel = parseInt(localStorage.getItem('nivel'));
    contador = parseInt(localStorage.getItem('contador'));
   
    // RECUPERAR LOS ARREGLOS DEL LOCALSTORAGE

    // RECUPERAR EL CUERPO
    let cargarBody = new Array();
    cargarBody = JSON.parse(localStorage.getItem('body'));
    console.log(cargarBody);
    

    // if (cargarBody.length > 0) 
    // {
        for (let i = 0; i < cargarBody.length; i++)
        {
            body.push(new Rectangle(cargarBody[i].x, cargarBody[i].y, cargarBody[i].w, cargarBody[i].h, cargarBody[i].c ,cargarBody[i].src));
            
        }
    // }
    
    // RECUPERAR LOS OBSTACULOS
    let cargarObstaculos = new Array();
    cargarObstaculos = JSON.parse(localStorage.getItem('obstaculos'));

    // if (cargarObstaculos.length > 0 ) 
    // {
        for (let i = 0; i < cargarObstaculos.length; i++) 
        {
            obstaculos.push(new Rectangle(cargarObstaculos[i].x, cargarObstaculos[i].y, cargarObstaculos[i].w, cargarObstaculos[i].h, cargarObstaculos[i].c, cargarObstaculos[i].src ));    
        }    
    // }

    // RECUPERAR LA COMIDA
    let cargarFood = new Array();
    cargarFood = JSON.parse(localStorage.getItem('food'));

    // if (cargarFood.length > 0 ) 
    // {
            food= new Rectangle(cargarFood.x, cargarFood.y, cargarFood.w, cargarFood.h, cargarFood.c, cargarFood.src );       
    // }
    
    //

    // console.log('colision con el mismo cuerpo');
    pause = true;

}

function rePaint() 
{
    // se encarga de actualizar la pantalla como AJAX
    requestAnimationFrame(rePaint);
    paint();    
}


function readKey(e)
{
    lastkey = e.keycode || e.which;
}

function random (size)
{
    return Math.floor(Math.random() * size); //redondea al entero mas alto
}

function Rectangle(x,y,w,h,c,src = '') 
{
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
    //
    this.src = src;
    //
    this.body = new Image();
    this.body.src = src;
    this.body.onload = this.paintImage;

    this.paintImage = function (context)
    {
        context.drawImage(this.body,this.x, this.y);
    }

    this.fill = function (context)
    {
        context.fillStyle = this.c;
        context.fillRect(this.x, this.y, this.w, this.h);
    }

    this.intersects = function(obj)
    {
        return (this.x + this.w) > obj.x && //de derecha
            this.x < (obj.x + obj.w) && //de izquierda
            (this.y + this.h) > obj.y &&// de arriba
            this.y < (obj.y + obj.h) //de abajo
    }
}

// Lista de adiciones al proyecto (TAREA)
// 1. Agregar dos obstaculos cada 8 colisiones ya
// 2. Resetear el juego cuando cuando colisiones con el cuerpo ya
// 3. Corregir el aumento de la velocidad ya
// 4. Definir solo 6 niveles:
// 5. En el nivel 6: No colisionar con las paredes.

// Investigacion: (para agregarle al juego):
// Agregar localstorage para almacenar los niveles ya
