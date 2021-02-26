import {
    gameData
} from "../DATOS/questions.js"
//CONTADOR
var contadorjuego = document.getElementById("contador");
var cont = contadorjuego.value
//MAPAS
var mymap;
var marcador;
//TIEMPO GRAFICA 
var ArrayTiempo = [
    ['Ejemplo', 'Tiempo']
    
]
//VECES PAIS
var ArrayPizza=[
    ['Queso', 'Veces que aparece']
    
];
//DESORDENAR 
function Desordenar(DatosPaises) {
    var paisesDesordenados = [];
    var DatosDesordenados = (DatosPaises.sort(() => (Math.random() - 0.5)));
    for (let cnt = 0; cnt < 5; cnt++) {

        paisesDesordenados.push(DatosDesordenados[cnt]);
    }
    return paisesDesordenados;
}

function AleatorioTres() {
    var numeros = [0, 1, 2];
    var numaaleatorio = numeros[Math.floor(Math.random() * numeros.length)];

    return numaaleatorio;
};


//URL ES FICHERO QUESTIONS
var url = '../DATOS/questions.js'
//BOTON NUEVA PARTIDA
var botonewgame = document.getElementById('NuevaPartida');

botonewgame.addEventListener('click', () => {
    //MAPA EN CESAR
    mymap.flyTo(coordenadas, 13),
        L.marker(coordenadas).addTo(mymap);
    //DESACTIVA BOTON
    cont = "0";
    botonewgame.setAttribute('disabled', "true");
    //DESTRUCTOR
    destructor();
    //EMPIEZA EL CONTADOR
    var intevalo = setInterval(contador, 1000);
    var aciertos = 0;
    //DESOREDENAR VALORES
    var num = AleatorioTres();
    Desordenar(gameData.countries);
    var DatosDesordenados = Desordenar(gameData.countries);
    var datosPaises = Desordenar(DatosDesordenados);
    constructorCiudades(DatosDesordenados, num);
    constructorPaises(datosPaises);

    //HACER QUE SEAN DRAGABLES Y DROPABLES
    $(function () {
        $(".ciudades").draggable({
            revert: true,
        });
        $(".cuerpopaises").droppable({
            drop: function (event, ui) {
                $(this)
                ui.draggable.draggable('option', 'revert', false)
                ui.draggable.draggable('disable');
                event.target.style.backgroundColor = "#D4F1BC";
                aciertos++;
                pasarAPizza(event.target.parentNode.firstElementChild.textContent);
               
                //PASAR A GRAFICO PIZZA
                google.charts.setOnLoadCallback(drawChart2);
                if (aciertos == 5) {
                    
                    //TIEMPO
                    clearInterval(intevalo);
                    ArrayTiempo.push(['Tiempo',parseInt(contadorjuego.value)]);                    
                    google.charts.setOnLoadCallback(drawChart1);                    
                    //HABILITAR BOTON
                    botonewgame.disabled = false;
                }
                //FLY
                movimientomapa(ui.draggable[0].textContent);

            }
        });
    });

})
//CONTADOR
function contador() {
    contadorjuego.value = cont;
    cont++;
}
//CREAR DIV CIUDADES
function constructorCiudades(datos, num) {
    var datospasados = datos;
    var redesorden = datospasados.sort(() => (Math.random() - 0.5));
    var contadordivs = 0;
    redesorden.forEach(pais => {
        if (contadordivs < 5) {
            var divPaises = document.getElementById('DivCiudades');
            var nuevodiv = document.createElement('div');
            var titulo = document.createElement('spam');
            //ESTRUCTURA
            divPaises.appendChild(nuevodiv);
            nuevodiv.className = "ciudades";
            nuevodiv.id = 'city' + pais.code;
            nuevodiv.appendChild(titulo);
            titulo.innerText = pais.cities[num].name;
            contadordivs++;
        }
    });

}
//CREAR DIVS PAISES
function constructorPaises(datos) {

    datos.forEach(pais => {
        var divPaises = document.getElementById('DivPaises');
        var nuevodiv = document.createElement('div');
        var divnombre = document.createElement('div');
        var titulo = document.createElement('spam');
        var divresto = document.createElement('div');
        //ESTRUCTURA
        divPaises.appendChild(nuevodiv);
        nuevodiv.appendChild(divnombre);
        nuevodiv.className = "paises";
        divnombre.appendChild(titulo);
        divnombre.className = "nombrepaises"
        titulo.innerText = pais.name
        nuevodiv.appendChild(divresto);
        divresto.id = pais.code;
        divresto.className = "cuerpopaises";
        $(`#${pais.code}`).droppable({
            accept: `#city${pais.code}`,

        });
    });


}
//DESTRUCTOR

function destructor() {
    var borrarciudaes = document.getElementById('DivCiudades');
    var borrarpaises = document.getElementById('DivPaises');
    while (borrarciudaes.firstChild != null) {
        borrarciudaes.removeChild(borrarciudaes.firstElementChild);
        borrarpaises.removeChild(borrarpaises.firstElementChild);
    }

}
//CORDENADAS POR DEFECTO CESAR
var coordenadas = [28.455970688984355, -16.28325747316448]
//ONLOAD
window.onload = lanzadora();

function lanzadora() {
    mapa();
}
//MAPA
// CoordenadasCesar = [28.455970688984355, -16.28325747316448]

function mapa() {
    const tilesProvider = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    mymap = L.map('mapa').setView(coordenadas, 12);
    L.tileLayer(tilesProvider, {
        maxZoom: 20,

    }).addTo(mymap);
    marcador = L.marker(coordenadas).addTo(mymap);


};
//MOV MAPA

function movimientomapa(ciudad) {

    gameData.countries.forEach(pais => {
        pais.cities.forEach(city => {
            if (city.name == ciudad) {

                mymap.flyTo(city.location, 13),
                    L.marker(city.location).addTo(mymap);
            }
        });


    });
}
//CHART 1
google.charts.load('current', {
    'packages': ['corechart']
});
/* google.charts.setOnLoadCallback(drawChart1); */

function drawChart1() {
    var data = google.visualization.arrayToDataTable(ArrayTiempo);

    var options = {
        title: 'Tiempos por Partida',
        curveType: 'function',

    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    chart.draw(data, options);
}
//CHART 2
function pasarAPizza(nombrePais){
    var comprobar = false;
    ArrayPizza.forEach(element => {
        
       if(element[0] == nombrePais){
            comprobar=true;
            element[1]++;
       }
       
    });
    if(!comprobar){
        ArrayPizza.push([nombrePais, 1]);
    }
   
}
google.charts.load('current', {
    'packages': ['corechart']
});
function drawChart2() {

    var data = google.visualization.arrayToDataTable(ArrayPizza);


    var chart = new google.visualization.PieChart(document.getElementById('piechart'));

    chart.draw(data);
}

