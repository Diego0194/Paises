// Dimensiones del mapa
var width = 960;
var height = 500;

// Crear el lienzo SVG
var svg = d3.select("#map")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Proyección para el mapa del mundo
var projection = d3.geoMercator()
  .scale(130)
  .translate([width / 2, height / 1.5]);

// Generar ruta de los países
var path = d3.geoPath().projection(projection);

// Lista de códigos ISO de países para colorear
var countriesToColor = ["MYS", "FR1"]; // Ejemplo: Estados Unidos

// Función para determinar si un país debe estar coloreado
function shouldColor(countryCode) {
  return countriesToColor.includes(countryCode);
}

// Función para abrir una lightbox con la imagen del país
function openLightbox(countryCode, countryName) {
  // Cerrar cualquier lightbox previamente abierta
  closeLightbox();

  // Crear el elemento de la lightbox
  var lightbox = d3.select("body")
    .append("div")
    .attr("class", "lightbox")
    .on("click", function() {
      // Cerrar la lightbox al hacer clic fuera de ella
      closeLightbox();
    });

  // Crear la estructura de la polaroid
  var polaroid = lightbox.append("div")
    .attr("class", "polaroid");

  // Agregar la imagen del país a la polaroid
  polaroid.append("img")
    .attr("src", "img/" + countryCode + ".JPG") // Ruta de la imagen del país
    .attr("alt", countryCode);

  // Agregar el nombre del país en la parte inferior de la polaroid
  polaroid.append("div")
    .attr("class", "country-name")
    .text(countryName);
}

// Función para cerrar la lightbox
function closeLightbox() {
  d3.selectAll(".lightbox").remove();
}

// Cargar datos GeoJSON del mapa del mundo
d3.json("ne_110m_admin_0_countries.geojson")
  .then(function(data) {
    // Dibujar los países
    svg.selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("class", function(d) {
        // Verificar si d.properties está definido antes de acceder a sus propiedades
        if (d.properties && d.properties.BRK_A3) {
          var countryCode = d.properties.BRK_A3; // Acceder al código ISO del GeoJSON
          var countryName = d.properties.NAME; // Obtener el nombre del país
          // Si el país está en la lista de países a colorear, asignar la clase "colored"
          return shouldColor(countryCode) ? "colored" : "";
        }
        return ""; // No asignar ninguna clase si no se puede acceder a las propiedades del país
      })
      .on("click", function(event, d) {
        // Abrir la lightbox solo si el país está en la lista de países a colorear
        if (d.properties && d.properties.BRK_A3) {
          var countryCode = d.properties.BRK_A3;
          var countryName = d.properties.NAME; // Obtener el nombre del país
          if (shouldColor(countryCode)) {
            openLightbox(countryCode, countryName);
          }
        }
      });
  })
  .catch(function(error) {
    console.error("Error al cargar el archivo GeoJSON:", error);
  });
