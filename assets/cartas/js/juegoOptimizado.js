//funcion anónima autoejecutable (autoinvocadas) para evitar que las variables y funciones definidas en este archivo se mezclen con otras en el ámbito global
//si necesito llamar a esta funcion inmediatamente despues de ser definida, la puedo envolver en parentesis y agregarle al final otros parentesis para que se ejecute
//esta instruccion lo que hace es crear un nuevo ámbito (scope) que no tiene una referencia por nombre, por lo que no se puede acceder desde fuera de este bloque de codigo, no va a ser posible llamar al objeto directamente
//(function() {
//})();

const miModulo= (() => {
    'use strict'; //modo estricto, para evitar errores comunes en JS, que sea estricto a la hora de interpretar el codigo, hará el código más limpio y seguro.
    //Otras funciones que tiene el useStrict son: evita la creación de variables globales accidentales, lanza errores en asignaciones a propiedades no modificables, prohibe el uso de palabras reservadas como nombres de variables, entre otras cosas.

    //todo el codigo del juego va aqui adentro
    let deck = [];
    const tipos = ['C', 'D', 'H', 'S'], //C de corazones, D de diamantes, H de corazones, S de spadas
    especiales = ['A', 'J', 'Q', 'K']; //A de as, J de jota, Q de reina, K de rey

    //Referencias a los elementos HTML
    const btnPedir = document.querySelector('#btnPedir'), //me trae el primer elemento que coincida con el selector
    btnNuevo = document.querySelector('#btnNuevo'),
    btnDetener = document.querySelector('#btnDetener');


    let puntosJugadores = []; //array para guardar los puntos de cada jugador, en la posicion 0 los puntos del jugador, en la posicion 1 los puntos de la computadora

    const puntosHTML = document.querySelectorAll('small'), //me trae todos los elementos que coincidan con el selector, en este caso los dos small (el del jugador y el de la computadora)
    divCartasJugadores = document.querySelectorAll('.divCartas'); //me trae todos los elementos que coincidan con el selector, en este caso los dos divs donde van las cartas del jugador y de la computadora
    
    //funcion para inicializar el juego
    const inicializarJuego = (numJugadores = 2) => {
    deck = crearDeck();
    puntosJugadores = []; //reinicio el array de puntos de los jugadores
    for(let i = 0; i < numJugadores; i++){
        puntosJugadores.push(0); //inicializo los puntos de cada jugador en 0. puntosJugadores[0] es el jugador, puntosJugadores[1] es la computadora
        //push agrega un elemento al final del array
    }
    puntosHTML.forEach(elem => elem.innerText = 0); //reinicio los puntos en la interfaz grafica, uso forEach para recorrer todos los elementos del array puntosHTML
    divCartasJugadores.forEach(elem => elem.innerHTML = '');
    btnPedir.disabled = false; //habilito el boton de pedir carta
    btnDetener.disabled = false; //habilito el boton de detener
}
//funcion para crear el deck
const crearDeck = () => {
     deck = []; //reinicio el deck
    //aqui me voy a crear todas las cartas, pero voy a empezar con los numeros
    for(let i = 2; i<=10; i++){ //recorro los numeros del 2 al 10
        for(let tipo of tipos){ //tipo va a tomar el valor de cada uno de los elementos del array
            deck.push(i + tipo); //de esta forma concateno el numero con el tipo, asi me queda 2C, 2D, 2H, 2S, 3C, 3D, etc 
            // push agrega ese valor al final del array
        }
        //deck.push(i + 'C'); //C de corazones
    }

    //ahora vamos a crear las cartas especiales
    for(let tipo of tipos){ //tipo va a tomar el valor de cada uno de los elementos del array
        for(let esp of especiales){
            deck.push(esp + tipo);
        }
    }


    return _.shuffle(deck); //underscore tiene una funcion que se llama shuffle que me permite mezclar un array de forma aleatoria; 
    //retorno el deck barajado al azar para poder usarlo en otras partes del codigo
}


//funcion para pedir una carta
const pedirCarta = () => {
    if(deck.length === 0){
        throw 'No hay cartas en el deck';
    }
    
    return deck.pop(); //pop me saca el ultimo elemento del array y me lo devuelve;
}

//pedirCarta();

//funcion para obtener el valor de la carta
const valorCarta = (carta) => {
    const valor = carta.substring(0, carta.length-1); //substring me permite extraer (retorna, regresa) una parte del string, o un string cortado en base a la pos inicial y un final que podemos definir (0, carta.length - 1); 
    //le digo que me extraiga desde la posicion 0 hasta la longitud del string -1 (para no incluir el tipo de carta)
    return (isNaN(valor)) ? //isNaN me dice si el valor no es un numero, devuelve true o false
        (valor === 'A') ? 11 : 10 //si es A vale 11, si no vale 10, porque si no es A, es J, Q o K, que valen 10. Aquí no hace falta multiplicar por 1 porque ya los estoy manejando y devolviendo como numeros
        : valor * 1; //si es un numero lo multiplico por 1 para convertirlo a numero (valor es un string)
    
    //const valor = carta[0]; la primera posicion del string es el valor de la carta. Se puede usar String como un array
    //con 10, por ejemplo, no funciona porque el 1 estaria en la posicion 0 y el 0 en la posicion 1
}

//valorCarta(pedirCarta()); si en consola el 5 sale gris, es porque lo esta tomando como string y no como numero, si sale morado es porque lo esta tomando como numero

const acumularPuntos = (carta, turno) => { //turno es 0 para el jugador y 1 para la computadora. Quiero acumular los puntos de cada uno, la computadora tambien es un jugador, entonces lo puedo manejar como un array, donde la posicion 0 es el jugador y la posicion 1 es la computadora
    puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
    puntosHTML[turno].innerText = puntosJugadores[turno];
    return puntosJugadores[turno]; //retorno los puntos acumulados del jugador o de la computadora, dependiendo del turno. Esto me va a servir para saber cuantos puntos tiene cada uno en el turnoComputadora. Se pone return porque asi puedo usar esta funcion para obtener los puntos acumulados en cualquier momento
    //si no pusiera return, no podria usar esta funcion para obtener los puntos acumulados, solo para sumarlos y mostrarlos en la interfaz grafica
}

const crearCartaHTML = (carta, turno) => {
    const imgCarta = document.createElement('img');
    imgCarta.src = `assets/cartas/${carta}.png`; //le asigno la ruta de la imagen, usando template string para poder insertar la variable carta
    imgCarta.classList.add('carta'); //le agrego la clase carta para que tenga el estilo correspondiente
    divCartasJugadores[turno].appendChild(imgCarta); //appendChild me permite agregar un elemento hijo a un elemento padre, en este caso estoy agregando la imagen de la carta al div de las cartas del jugador o de la computadora dependiendo del turno
}

const determinarGanador = () => {
    const [puntosMinimos, puntosMaquina] = puntosJugadores; //desestructuro el array puntosJugadores para obtener los puntos del jugador y de la computadora
      //cuando la computadora termina de pedir cartas, hay que ver quien ganó
    setTimeout(() => { //uso setTimeout para que el mensaje de quien ganó salga despues de un segundo, para que de tiempo a que se vean las cartas
        if(puntosMaquina === puntosMinimos){
            alert('Empate');
        } else if (puntosMinimos > 21){
            alert('La maquina gana');
        } else if (puntosComputadora > 21){
            alert('El jugador gana');
        } else {
            alert('La maquina gana');
        }
    }, 100);
}

//turno de la computadora. El turno de la computadora se va a disparar en dos ocasiones: cuando el jugador se pase de 21 puntos, o cuando el jugador decida detenerse, la maquina pedirá cartas hasta llegar a la puntuacion del jugador o 21
const turnoComputadora = (puntosMinimos) => { //puntosMinimos es la puntuacion que tiene el jugador, para que la iguale o la supere
    //tendremos un ciclo do while para que el jugador no toque un boton para que ejecute el turno de la computadora, el ciclo se va a ejecutar al menos una vez
    //porque si el jugador pide una carta, por ejemplo, le sale 5 en la primera tirada, yo siempre necesito por lo menos una carta
    //y si el jugador se detiene, es decir, lo deja en 0, yo siempre voy a necesitar que la computadora pida al menos una carta para superar al usuario
    let puntosMaquina = 0;
    do {
         puntosMaquina= acumularPuntos(pedirCarta(), puntosJugadores.length - 1);//llamo a la funcion para acumular puntos, le paso la carta que pide la computadora y el turno, que es la ultima posicion del array (puntosJugadores.length - 1)
        //se pone puntosJugadores.length - 1 porque la computadora siempre va a ser el ultimo jugador en el array. puntosJugadores.length me da la cantidad de jugadores, pero como los indices empiezan en 0, le resto 1 para obtener la posicion correcta
       crearCartaHTML(pedirCarta(), puntosJugadores.length - 1); //llamo a la funcion para crear la carta en la interfaz grafica, le paso la carta y el turno, que es la ultima posicion del array (puntosJugadores.length - 1)
    } while( (puntosMaquina < puntosMinimos) && (puntosMinimos <= 21) ); //mientras los puntos de la computadora sean menores a los puntos del jugador, y los puntos del jugador sean menores o iguales a 21, la computadora sigue pidiendo cartas
    determinarGanador(); //una vez que la computadora termina de pedir cartas, determino el ganador
}

//Eventos de los botones
//Necesito estar escuchando cuando el usuario haga click en los botones
//primero tengo que hacer referencia al elemento HTML, que es el boton de pedir carta
//los botones los tengo en el archivo index.html
//ya tienen asignado un id, por lo que puedo usar getElementById, y esto los identifica de forma unica
//cuando vamos a referenciar ese boton mas de una vez, es mejor guardarlo en una variable
btnPedir.addEventListener('click', () => {
    const carta = pedirCarta(); //creamos una variable carta que va a guardar la carta que nos devuelve la funcion pedirCarta
    //puntosJugador = puntosJugador + valorCarta(carta); //cada vez que el jugador pida una carta, se va a sumar el valor de esa carta a los puntos del jugador
    //ahora hay que tomar esa carta y mostrarla en la interfaz grafica, en donde pone la puntuacion del jugador
    //puntosHTML[0].innerText = puntosJugador; //innerText me permite modificar el texto que hay dentro de un elemento HTML. El [0] es porque puntosHTML es un arreglo de elementos small, y yo quiero el primero, que es el del jugador
    //creamos la imagen de la carta de forma dinamica, tengo que crear a partir de esto: <img class="carta" src="/assets/cartas/2S.png" alt="cartajugador">
    const puntosJugador= acumularPuntos(carta, 0); //llamo a la funcion para acumular puntos, le paso la carta que pide el jugador y el turno, que es 0 porque es el primer jugador
    crearCartaHTML(carta, 0); //llamo a la funcion para crear la carta en la interfaz grafica, le paso la carta y el turno, que es 0 porque es el primer jugador
   
    //ahora hay que evaluar si el jugador se paso de 21 puntos
    if(puntosJugador > 21){
        console.warn('Lo siento mucho, has perdido');
        btnPedir.disabled = true; //deshabilito el boton de pedir carta
        turnoComputadora(puntosJugador); //si el jugador se pasa de 21, la computadora no necesita pedir cartas, pero igual llamo a la funcion para que se ejecute el mensaje de quien ganó
        btnDetener.disabled = true; //deshabilito el boton de detener
    }
    else if(puntosJugador === 21){
        console.warn('21, genial!');
        btnPedir.disabled = true; //deshabilito el boton de pedir carta
        btnDetener.disabled = true; //deshabilito el boton de detener
        turnoComputadora(puntosJugador); //si el jugador llega a 21, la computadora tiene que jugar para ver si empatan o gana la computadora
    }
});

    btnDetener.addEventListener('click', () => {
        btnPedir.disabled = true; //deshabilito el boton de pedir carta
        btnDetener.disabled = true; //deshabilito el boton de detener
        turnoComputadora(puntosJugadores[0]); //cuando el jugador se detiene, es el turno de la computadora
    } );

    //debería ser capaz de exportar el evento de crear un nuevo juego, o sea, de reiniciar todo mi juego, para que, otros archivos, puedan reinianizarlo por si acaso fuera necesario 
    //btnNuevo.addEventListener('click', () => {
        //inicializarJuego();
        
    //
    //addEventListener es un metodo que me permite escuchar un evento en este caso el click
    //el segundo argumento es una funcion flecha que se ejecuta cuando se hace click en el boton
    //cuando el usuario haga click en el boton, se va a ejecutar la funcion flecha y me va a mostrar en consola la carta que me devuelve la funcion pedirCarta
    //una funcion que se coloca como argumento a otra funcion, se llama callback, es una funcion que se está mandando como argumento
    //dentro de la funcion flecha, llamo a la funcion pedirCarta y guardo el resultado en la variable carta
    //luego muestro en consola la carta que me devolvio la funcion pedirCarta
    //cada vez que haga click en el boton, me va a mostrar una carta diferente, porque la funcion pedirCarta saca la ultima carta del deck y la devuelve
    //necesito saber ahora cuantos puntos va acumulando el jugador con las cartas que va pidiendo, es ir contando o sumando cada valor de las cartas

    
    //la maquina tiene que pedir cartas hasta que supere los puntos del jugador o se pase de 21
    //si el jugador pide cartas y pulsa detener, la maquina tiene que empezar a pedir cartas. Si el jugador tiene 13 puntos, la maquina tiene que superar unicamente esos 13 puntos, llegar a los 13 o superior
    //Si la computadora llega a 13, por ejemplo, empatan 
    //Si la computadora se pasa de 21, gana el jugador
    //Si el jugador llega a 20 es un reto mas para la computadora, tiene que llegar a 20 sin pasarse, pero si se pasa, gana el jugador. Tendremos una condicion relativa, es decir, que depende de la puntuacion
    
    return { //esto es lo que voy a exponer al exterior, lo que quiero que sea publico
        nuevoJuego: inicializarJuego //hago referencia a la funcion inicializarJuego, pero la llamo nuevoJuego para que sea mas entendible desde afuera
    };

    })();
//cuando se ejecute el programa, va a ver que estoy creando mi funcion, e inmediatamente la estoy ejecutando o llamando 
//si defines una variable dentro de esta funcion y luego la llamas en consola, va a aparecer como que no está definida si tratas de acceder a ella desde fuera de la funcion
//no lo vamos a poder encontrar porque está ubicado en algun lugar de memoria sin un identificador por nombre, entonces es casi imposible saber donde se ubica esto en la memoria


