"use strict";

var _questions = require("./questions.js");

var citiesContainer = document.querySelector(".cities-container");
var countriesContainer = document.querySelector(".countries-container");
var nuevaPartidaBtn = document.getElementById("nuevaPartida");
nuevaPartidaBtn.addEventListener("click", nuevaPartida, false);
var timer;

if (intentos == undefined) {
  var intentos = 0;
  var tiempoIntento = 0;
}

var paises;

function nuevaPartida() {
  vaciarNodo(citiesContainer);
  vaciarNodo(countriesContainer);
  paises = getPaisesRnd(_questions.gameData.countries);
  activarCiudadPais(paises);
  document.getElementById("timer").innerHTML = 0;
  timer = setInterval(actualizarTimer, 1000);
  nuevaPartidaBtn.disabled = true;
}

function finalizarPartida() {
  aciertos = 0;
  nuevaPartidaBtn.disabled = false;
  clearInterval(timer);
  tiempoIntento = document.getElementById("timer").innerHTML;
  intentos++; //actualizar grafico lineal

  dataIntentos.addRows([[intentos, parseInt(tiempoIntento, 10)]]);
  chartIntentos.draw(dataIntentos, google.charts.Line.convertOptions(optionsChartIntentos));
}

function actualizarTimer() {
  var tiempoRestante = document.getElementById("timer").innerHTML;
  tiempoRestante = parseInt(tiempoRestante) + 1;
  document.getElementById("timer").innerHTML = tiempoRestante;
}

function getPaisesRnd(paises) {
  paises = paises.slice(0);
  var resultado = [];
  var nPaises = 5;

  while (resultado.length < nPaises && paises.length > 0) {
    var indice = Math.floor(Math.random() * paises.length);
    var pais = paises[indice];
    var ciudad = pais.cities[Math.floor(Math.random() * pais.cities.length)];
    resultado.push({
      pais: pais,
      ciudad: ciudad
    });
    paises.splice(indice, 1); //elimino el pais seleccionado aleatoriamente
  }

  return resultado;
} //Mapa


var mymap = L.map('mapid').setView([28.456046923017453, -16.28343672568356], 13);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery© <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  mapId: "mapid",
  accessToken: 'pk.eyJ1IjoiZmFjdXJ1a3UiLCJhIjoiY2trbXVnczRsMGFsMTJ4cnczbnJmN3hxNiJ9.5VSUgLssABqEPOQtObd5OQ'
}).addTo(mymap); // marcador inicial del instituto

var marker = L.marker([28.456046923017453, -16.28343672568356]).addTo(mymap);
marker.bindPopup("<b>Bienvenido al CIFP César Manrique!</b>").openPopup(); // Load the Visualization API and the piechart package.

google.charts.load('current', {
  'packages': ['corechart']
});
google.charts.load('current', {
  'packages': ['line']
}); // Set a callback to run when the Google Visualization API is loaded.

google.charts.setOnLoadCallback(drawChart); //Grafico ocurrencias 

var chartOcurrencias;
var dataOcurrencias;
var optionsChartOcurrencias = {
  'title': 'Ocurrencias de países',
  'width': 400,
  'height': 300
}; //grafico lineal tiempoIntento

var chartIntentos;
var dataIntentos;
var optionsChartIntentos = {
  title: 'Tiempos por Partida',
  curveType: 'function',
  legend: {
    position: 'bottom'
  },
  series: {
    // Gives each series an axis name that matches the Y-axis below.
    0: {
      axis: 'Tiempo'
    }
  },
  axes: {
    // Adds labels to each axis; they don't have to match the axis names.
    y: {
      Tiempo: {
        label: 'Tiempo (s)'
      }
    }
  }
};

function drawChart() {
  // Create our data table.
  dataOcurrencias = new google.visualization.DataTable();
  dataOcurrencias.addColumn('string', 'paises');
  dataOcurrencias.addColumn('number', 'ocurrencias');
  chartOcurrencias = new google.visualization.PieChart(document.getElementById('chartOcurrencias'));
  dataIntentos = new google.visualization.DataTable();
  dataIntentos.addColumn("number", "Intentos");
  dataIntentos.addColumn("number", "Tiempos");
  dataIntentos.addRows([[0, 0]]);
  chartIntentos = new google.charts.Line(document.getElementById('chartIntentos')); // Instantiate and draw our chart, passing in some options.

  chartOcurrencias.draw(dataOcurrencias, optionsChartOcurrencias);
  chartIntentos.draw(dataIntentos, google.charts.Line.convertOptions(optionsChartIntentos));
}

if (aciertos == undefined) {
  var aciertos = 0;
}

var countryTemplate = document.getElementById("countryTemplate");
var cityTemplate = document.getElementById("cityTemplate");
var cities = [];
var countries = [];
var ocurrencias = [];

_questions.gameData.countries.forEach(function (country) {
  ocurrencias.push({
    "pais": country.name,
    "ocurrencias": 0
  });
});

function activarCiudadPais(paises) {
  paises.forEach(function (_ref) {
    var pais = _ref.pais,
        ciudad = _ref.ciudad;
    var drag = document.importNode(cityTemplate.content, true).firstElementChild;
    drag.firstElementChild.innerHTML = ciudad.name;
    drag.setAttribute("class", "city");
    drag.setAttribute("data-code", pais.code);
    drag.setAttribute("data-location", ciudad.location);
    drag.setAttribute("data-name", ciudad.name);
    var _drop = document.importNode(countryTemplate.content, true).firstElementChild;
    _drop.firstElementChild.innerHTML = pais.name;

    _drop.setAttribute("class", "country droppable");

    _drop.setAttribute("data-code", pais.code);

    _drop.setAttribute("data-name", pais.name); // CIUDADES DRAGGABLE


    $(drag).draggable({
      revert: true
    }); //PAISES DROPPABLE

    $(_drop).droppable({
      tolerance: "touch",
      drop: function drop(event, ui) {
        //acierto de la ciudad en el país correspondiente
        if (ui.draggable[0].dataset.code == this.dataset.code) {
          //Viajar en el mapa
          var latlon = ui.draggable[0].dataset.location.split(",");
          mymap.flyTo([latlon[0], latlon[1]], 13); //Marcador del mapa

          var marker = L.marker([latlon[0], latlon[1]]).addTo(mymap);
          marker.bindPopup("<b>Bienvenido a " + ui.draggable[0].dataset.name + "!</b>").openPopup();
          $(this).addClass("ui-state-highlight"); //pintar fondo

          $(ui.draggable[0]).draggable({
            //stop drag revert
            revert: false
          });
          $(ui.draggable[0]).draggable("destroy", true); //stop drag

          $(this).droppable("option", "disabled", true); //stop drop

          dataOcurrencias = new google.visualization.DataTable();
          dataOcurrencias.addColumn('string', 'paises');
          dataOcurrencias.addColumn('number', 'ocurrencias');
          ocurrencias.find(function (pais) {
            if (pais.pais == _drop.dataset.name) {
              pais.ocurrencias += 1;
            }

            dataOcurrencias.addRows([[pais.pais, pais.ocurrencias]]);
          });
          chartOcurrencias.draw(dataOcurrencias, optionsChartOcurrencias); //comprobar el fin

          aciertos++; //fin de partida

          if (aciertos == 5) {
            finalizarPartida();
          }
        } else {
          $(ui.draggable[0]).draggable({
            revert: true
          });
        }
      }
    });
    cities.push(drag);
    countries.push(_drop);
  });
  appendCiudadesPaises();
}
/**
 * Funcion que añade al DOM las ciudades y paises en orden aleatorio
 */


function appendCiudadesPaises() {
  cities = cities.slice(0);

  while (cities.length > 0) {
    var indice = Math.floor(Math.random() * cities.length);
    var ciudad = cities[indice];
    citiesContainer.appendChild(ciudad);
    cities.splice(indice, 1);
  }

  countries.slice(0);

  while (countries.length > 0) {
    var _indice = Math.floor(Math.random() * countries.length);

    var pais = countries[_indice];
    countriesContainer.appendChild(pais);
    countries.splice(_indice, 1);
  }
}

function vaciarNodo(nodo) {
  while (nodo.hasChildNodes()) {
    nodo.removeChild(nodo.firstChild);
  }
}

function crearNodo(tipoElemento, textoNodo, clasesNodo, atributosNodo) {
  var nodo = document.createElement(tipoElemento);

  if (textoNodo != "") {
    var nodoTexto = document.createTextNode(textoNodo);
    nodo.appendChild(nodoTexto);
  }

  if (clasesNodo.length > 0) {
    clasesNodo.forEach(function (clase) {
      nodo.classList.add(clase);
    });
  }

  if (atributosNodo.length > 0) {
    atributosNodo.forEach(function (atributo) {
      nodo.setAttribute(atributo.name, atributo.value);
    });
  }

  return nodo;
}