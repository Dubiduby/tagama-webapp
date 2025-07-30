import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export function initMap(coordinates, location) {
  // Verificar si las coordenadas existen
  if (!coordinates) {
    console.warn("No coordinates provided for map");
    return;
  }

  // Convertir coordenadas a formato [lat, lng] para Leaflet
  let coordsArray;
  
  if (typeof coordinates === 'object' && coordinates.lat && coordinates.lng) {
    // Formato objeto {lat, lng}
    coordsArray = [coordinates.lat, coordinates.lng];
  } else if (Array.isArray(coordinates) && coordinates.length === 2) {
    // Formato array [lat, lng]
    coordsArray = coordinates;
  } else if (typeof coordinates === 'string') {
    // Formato string "lat,lng"
    try {
      const coords = JSON.parse(coordinates);
      if (coords.lat && coords.lng) {
        coordsArray = [coords.lat, coords.lng];
      } else {
        const [lat, lng] = coordinates.split(',');
        coordsArray = [parseFloat(lat), parseFloat(lng)];
      }
    } catch {
      const [lat, lng] = coordinates.split(',');
      coordsArray = [parseFloat(lat), parseFloat(lng)];
    }
  } else {
    console.warn("Invalid coordinates format:", coordinates);
    return;
  }

  // Verificar que las coordenadas son válidas
  if (!coordsArray || coordsArray.length !== 2 || 
      isNaN(coordsArray[0]) || isNaN(coordsArray[1])) {
    console.warn("Invalid coordinates:", coordsArray);
    return;
  }

  const map = L.map("map").setView(coordsArray, 15);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.marker(coordsArray).addTo(map).bindPopup(location || "Ubicación del workshop");
  map.scrollWheelZoom.disable();
}
