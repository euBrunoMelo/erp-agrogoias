// Módulo de Mapas - Leaflet.js
// Funções para gerenciar mapas, marcadores e polígonos
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-control-geocoder';
import 'leaflet-measure';

// Coordenadas padrão: Goiânia-GO
const DEFAULT_CENTER = [-16.6864, -49.2556];
const DEFAULT_ZOOM = 13;

// Variáveis globais para mapas
let propertyMap = null;
let propertyMarker = null;
let plotMap = null;
let plotDrawControl = null;
let plotDrawnLayer = null;

/**
 * Inicializa um mapa básico
 * @param {string} containerId - ID do elemento HTML que conterá o mapa
 * @param {Array} center - [latitude, longitude] (opcional)
 * @param {number} zoom - Nível de zoom (opcional)
 * @returns {L.Map} Instância do mapa Leaflet
 */
export function initMap(containerId, center = DEFAULT_CENTER, zoom = DEFAULT_ZOOM) {
    // Verificar se o container existe
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container ${containerId} não encontrado`);
        return null;
    }

    // Criar mapa
    const map = L.map(containerId, {
        center: center,
        zoom: zoom,
        zoomControl: true
    });

    // Adicionar tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // Invalidar tamanho após um pequeno delay (importante para mapas em modais)
    setTimeout(() => {
        map.invalidateSize();
    }, 100);

    return map;
}

/**
 * Inicializa mapa para propriedade (com marcador arrastável)
 * @param {string} containerId - ID do container
 * @param {Object} coordinates - Coordenadas iniciais {lat, lng} ou null
 * @param {Function} onCoordinateChange - Callback quando coordenadas mudam
 * @returns {Object} {map, marker}
 */
export function initPropertyMap(containerId, coordinates = null, onCoordinateChange = null) {
    // Limpar mapa anterior se existir
    if (propertyMap) {
        propertyMap.remove();
        propertyMap = null;
        propertyMarker = null;
    }

    // Coordenadas iniciais
    const center = coordinates 
        ? [coordinates.lat || coordinates[0], coordinates.lng || coordinates[1]]
        : DEFAULT_CENTER;

    // Criar mapa
    propertyMap = initMap(containerId, center, 15);
    if (!propertyMap) return null;

    // Adicionar geocoder (busca de endereços)
    const geocoder = L.Control.Geocoder.nominatim();
    L.Control.geocoder({
        geocoder: geocoder,
        position: 'topright',
        placeholder: 'Buscar endereço...',
        errorMessage: 'Endereço não encontrado',
        defaultMarkGeocode: false
    }).on('markgeocode', function(e) {
        const latlng = e.geocode.center;
        propertyMap.setView(latlng, 15);
        if (propertyMarker) {
            propertyMarker.setLatLng(latlng);
        } else {
            propertyMarker = L.marker(latlng, { draggable: true }).addTo(propertyMap);
            propertyMarker.on('dragend', handlePropertyMarkerDrag);
        }
        if (onCoordinateChange) {
            onCoordinateChange(latlng.lat, latlng.lng);
        }
    }).addTo(propertyMap);

    // Criar marcador arrastável
    propertyMarker = L.marker(center, { 
        draggable: true,
        icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        })
    }).addTo(propertyMap);

    // Evento de arrastar marcador
    propertyMarker.on('dragend', handlePropertyMarkerDrag);

    // Popup com coordenadas
    updatePropertyMarkerPopup();

    // Evento de clique no mapa para mover marcador
    propertyMap.on('click', function(e) {
        propertyMarker.setLatLng(e.latlng);
        updatePropertyMarkerPopup();
        if (onCoordinateChange) {
            onCoordinateChange(e.latlng.lat, e.latlng.lng);
        }
    });

    function handlePropertyMarkerDrag() {
        updatePropertyMarkerPopup();
        const latlng = propertyMarker.getLatLng();
        if (onCoordinateChange) {
            onCoordinateChange(latlng.lat, latlng.lng);
        }
    }

    function updatePropertyMarkerPopup() {
        const latlng = propertyMarker.getLatLng();
        propertyMarker.bindPopup(`
            <strong>Localização da Propriedade</strong><br>
            Latitude: ${latlng.lat.toFixed(6)}<br>
            Longitude: ${latlng.lng.toFixed(6)}
        `).openPopup();
    }

    return { map: propertyMap, marker: propertyMarker };
}

/**
 * Inicializa mapa para talhão (com desenho de polígono)
 * @param {string} containerId - ID do container
 * @param {Array} coordinates - Coordenadas do polígono existente ou null
 * @param {Function} onPolygonChange - Callback quando polígono muda
 * @returns {Object} {map, drawControl, drawnLayer}
 */
export function initPlotMap(containerId, coordinates = null, onPolygonChange = null) {
    // Limpar mapa anterior se existir
    if (plotMap) {
        plotMap.remove();
        plotMap = null;
        plotDrawControl = null;
        plotDrawnLayer = null;
    }

    // Coordenadas iniciais
    const center = coordinates && coordinates.length > 0
        ? [coordinates[0][0], coordinates[0][1]]
        : DEFAULT_CENTER;

    // Criar mapa
    plotMap = initMap(containerId, center, 15);
    if (!plotMap) return null;

    // Adicionar geocoder
    const geocoder = L.Control.Geocoder.nominatim();
    L.Control.geocoder({
        geocoder: geocoder,
        position: 'topright',
        placeholder: 'Buscar localização...',
        errorMessage: 'Localização não encontrada'
    }).addTo(plotMap);

    // Adicionar controle de medida
    new L.Control.Measure({
        position: 'topright',
        primaryLengthUnit: 'meters',
        secondaryLengthUnit: 'kilometers',
        primaryAreaUnit: 'sqmeters',
        secondaryAreaUnit: 'hectares'
    }).addTo(plotMap);

    // Configurar desenho
    const drawOptions = {
        position: 'topleft',
        draw: {
            polygon: {
                allowIntersection: false,
                showArea: true,
                shapeOptions: {
                    color: '#16a34a',
                    fillColor: '#16a34a',
                    fillOpacity: 0.3
                }
            },
            rectangle: false,
            circle: false,
            marker: false,
            circlemarker: false,
            polyline: false
        },
        edit: {
            featureGroup: new L.FeatureGroup(),
            remove: true
        }
    };

    plotDrawnLayer = new L.FeatureGroup();
    plotMap.addLayer(plotDrawnLayer);

    plotDrawControl = new L.Control.Draw(drawOptions);
    plotMap.addControl(plotDrawControl);

    // Carregar polígono existente se fornecido
    if (coordinates && coordinates.length > 0) {
        loadPlotPolygon(coordinates);
    }

    // Eventos de desenho
    plotMap.on(L.Draw.Event.CREATED, function(e) {
        const layer = e.layer;
        plotDrawnLayer.clearLayers();
        plotDrawnLayer.addLayer(layer);
        
        const latlngs = layer.getLatLngs()[0];
        
        if (onPolygonChange) {
            // Converter para formato [lat, lng]
            const coords = latlngs.map(latlng => [latlng.lat, latlng.lng]);
            onPolygonChange(coords);
        }
        
        // Calcular área
        const area = calculatePolygonArea(latlngs);
        layer.bindPopup(`Área: ${area.toFixed(2)} hectares`).openPopup();
    });

    plotMap.on(L.Draw.Event.EDITED, function(e) {
        const layers = e.layers;
        layers.eachLayer(function(layer) {
            const latlngs = layer.getLatLngs()[0];
            
            if (onPolygonChange) {
                // Converter para formato [lat, lng]
                const coords = latlngs.map(latlng => [latlng.lat, latlng.lng]);
                onPolygonChange(coords);
            }
            
            // Atualizar área
            const area = calculatePolygonArea(latlngs);
            layer.setPopupContent(`Área: ${area.toFixed(2)} hectares`);
        });
    });

    plotMap.on(L.Draw.Event.DELETED, function(e) {
        plotDrawnLayer.clearLayers();
        if (onPolygonChange) {
            onPolygonChange(null);
        }
    });

    return { map: plotMap, drawControl: plotDrawControl, drawnLayer: plotDrawnLayer };
}

/**
 * Carrega um polígono existente no mapa
 * @param {Array} coordinates - Array de coordenadas [[lat, lng], ...]
 */
export function loadPlotPolygon(coordinates) {
    if (!plotMap || !plotDrawnLayer) return;

    plotDrawnLayer.clearLayers();

    if (coordinates && coordinates.length > 0) {
        // Converter para formato Leaflet
        const latlngs = coordinates.map(coord => [coord[0] || coord.lat, coord[1] || coord.lng]);
        
        const polygon = L.polygon(latlngs, {
            color: '#16a34a',
            fillColor: '#16a34a',
            fillOpacity: 0.3
        });

        plotDrawnLayer.addLayer(polygon);
        plotMap.fitBounds(polygon.getBounds());

        // Calcular e mostrar área
        const area = calculatePolygonArea(latlngs);
        polygon.bindPopup(`Área: ${area.toFixed(2)} hectares`).openPopup();
    }
}

/**
 * Calcula área de um polígono em hectares usando fórmula de Shoelace
 * @param {Array} latlngs - Array de coordenadas [{lat, lng}, ...] ou [[lat, lng], ...]
 * @returns {number} Área em hectares
 */
export function calculatePolygonArea(latlngs) {
    if (!latlngs || latlngs.length < 3) return 0;

    // Converter para formato consistente
    const points = latlngs.map(point => {
        if (Array.isArray(point)) {
            return { lat: point[0], lng: point[1] };
        }
        return { lat: point.lat, lng: point.lng };
    });

    // Fórmula de Shoelace para área esférica
    const R = 6371000; // Raio da Terra em metros
    let area = 0;

    for (let i = 0; i < points.length; i++) {
        const j = (i + 1) % points.length;
        const lat1 = points[i].lat * Math.PI / 180;
        const lng1 = points[i].lng * Math.PI / 180;
        const lat2 = points[j].lat * Math.PI / 180;
        const lng2 = points[j].lng * Math.PI / 180;

        area += (lng2 - lng1) * (2 + Math.sin(lat1) + Math.sin(lat2));
    }

    area = Math.abs(area * R * R / 2);
    return area / 10000; // Converter m² para hectares
}

/**
 * Obtém coordenadas do marcador da propriedade
 * @returns {Object|null} {lat, lng} ou null
 */
export function getPropertyCoordinates() {
    if (!propertyMarker) return null;
    const latlng = propertyMarker.getLatLng();
    return {
        type: 'Point',
        coordinates: [latlng.lng, latlng.lat] // GeoJSON: [longitude, latitude]
    };
}

/**
 * Obtém coordenadas do polígono do talhão
 * @returns {Object|null} GeoJSON Polygon ou null
 */
export function getPlotCoordinates() {
    if (!plotDrawnLayer || plotDrawnLayer.getLayers().length === 0) return null;

    const layer = plotDrawnLayer.getLayers()[0];
    const latlngs = layer.getLatLngs()[0];
    
    // Converter para formato GeoJSON
    const coordinates = latlngs.map(latlng => [latlng.lng, latlng.lat]); // [longitude, latitude]
    coordinates.push(coordinates[0]); // Fechar polígono

    return {
        type: 'Polygon',
        coordinates: [coordinates]
    };
}

/**
 * Limpa o mapa de propriedade
 */
export function clearPropertyMap() {
    if (propertyMap) {
        propertyMap.remove();
        propertyMap = null;
        propertyMarker = null;
    }
}

/**
 * Limpa o mapa de talhão
 */
export function clearPlotMap() {
    if (plotMap) {
        plotMap.remove();
        plotMap = null;
        plotDrawControl = null;
        plotDrawnLayer = null;
    }
}

/**
 * Converte coordenadas do banco para formato Leaflet
 * @param {Object} coordinates - Coordenadas do banco (GeoJSON)
 * @returns {Array|null} [lat, lng] ou null
 */
export function parseCoordinates(coordinates) {
    if (!coordinates) return null;

    if (coordinates.type === 'Point') {
        // GeoJSON: [longitude, latitude]
        return {
            lat: coordinates.coordinates[1],
            lng: coordinates.coordinates[0]
        };
    }

    if (coordinates.type === 'Polygon') {
        // Retornar array de coordenadas
        return coordinates.coordinates[0].map(coord => [coord[1], coord[0]]); // [lat, lng]
    }

    return null;
}
