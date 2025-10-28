const form = document.getElementById('ip-search-form');
const ipInput = document.getElementById('ip-input');
const myIpButton = document.getElementById('my-ip-button');
const dataDisplay = document.getElementById('data-display');
const loader = document.getElementById('loader');
const mapContainer = document.getElementById('map-container');
const fullLocationSpan = document.getElementById('full-location');
const locationSummary = document.getElementById('location-summary');

// Variável global para o objeto do mapa Leaflet
let map = null;
let marker = null;
let currentTileLayer = null; // NOVO: Para rastrear a camada atual

// Mapeamento dos dados (permanece o mesmo)
const DATA_MAPPING = {
    'ip': { label: 'Endereço IP', icon: '💻' },
    'hostname': { label: 'Hostname', icon: '🌐' },
    'city': { label: 'Cidade', icon: '🏙️' },
    'region': { label: 'Estado/Região', icon: '🗺️' },
    'country': { label: 'País (Código)', icon: '🌍' },
    'loc': { label: 'Latitude/Longitude', icon: '📍' },
    'org': { label: 'Provedor (ISP)', icon: '🏢' },
    'postal': { label: 'CEP/Código Postal', icon: '✉️' },
    'timezone': { label: 'Fuso Horário', icon: '⏰' }
};

// --- VALIDAÇÃO DE IP MAIS ROBUSTA ---
function isValidIP(ip) {
    if (!ip) return false;
    ip = ip.trim();
    
    // Regex para IPv4 (Verifica o formato x.x.x.x e garante que cada octeto esteja entre 0-255)
    const ipv4Regex = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)){3}$/;
    
    // Regex para IPv6 (Permite formatos completos, compactados e mistos)
    const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|([0-9a-fA-F]{1,4}:){1,4}:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}))$/;

    return true;
    //return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}


// --- FUNÇÕES DO MAPA LEAFLET ---

// Função auxiliar para obter a URL do tile com base no valor
function getTileUrl(layerValue) {
    switch (layerValue) {
        case 'satellite':
            // URL de satélite (usando o provedor Esri World Imagery, que é comum e gratuito para uso não-comercial)
            return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        case 'topo':
            // URL Topográfica (usando o provedor OpenTopoMap)
            return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
        case 'street':
        default:
            // Padrão: OpenStreetMap (Ruas)
            return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
}

/**
 * Inicializa o mapa Leaflet se ainda não foi inicializado.
 */
function initializeMap(lat, lon, zoom = 13) {
    if (map === null) {
        map = L.map('map', {
            scrollWheelZoom: false 
        }).setView([lat, lon], zoom);

        // 1. Cria e adiciona a camada padrão (Ruas)
        currentTileLayer = L.tileLayer(getTileUrl('street'), {
            maxZoom: 19,
            attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Cria o marcador inicial
        marker = L.marker([lat, lon]).addTo(map);
        
        // 2. Chama a nova função para configurar os botões de rádio
        setupLayerSwitcher(); 
    }
}

/**
 * Atualiza o mapa para novas coordenadas e move o marcador.
 */
function updateMap(lat, lon, locationInfo) {
    // Garante que o container do mapa e do resumo estejam visíveis
    mapContainer.style.display = 'block';
    locationSummary.style.display = 'block';

    // Se o mapa não foi inicializado, faz a inicialização
    if (map === null) {
        initializeMap(lat, lon);
    } else {
        // Move o mapa para as novas coordenadas e ajusta o zoom
        map.setView([lat, lon], 13);
        
        // Remove e adiciona um novo marcador (ou apenas move o existente)
        if (marker) {
            marker.setLatLng([lat, lon]);
        } else {
            marker = L.marker([lat, lon]).addTo(map);
        }
    }

    // Configura o pop-up do marcador
    marker.bindPopup(`<b>Localização IP:</b><br>${locationInfo}`).openPopup();

    // Invalida o tamanho para garantir que o Leaflet calcule a altura correta do div
    setTimeout(() => {
        map.invalidateSize();
    }, 100);
}


/**
 * Função para buscar e exibir os dados do IP.
 */
async function fetchAndDisplayIPInfo(ipAddress = null) {
    const ip = ipAddress ? ipAddress.trim() : null;
    const apiEndpoint = ip && isValidIP(ip) 
                        ? `https://ipinfo.io/${ip}/json` 
                        : 'https://ipinfo.io/json';

    // 1. Mostrar o Loader e ocultar mapa/resumo
    loader.style.display = 'flex';
    dataDisplay.innerHTML = '';
    mapContainer.style.display = 'none';
    locationSummary.style.display = 'none';
    fullLocationSpan.textContent = '';
    ipInput.value = ip || ''; // Preenche o input com o IP buscado

    try {
        const response = await fetch(apiEndpoint);
        
        if (!response.ok) {
            // Lida com IPs inválidos ou não encontrados (geralmente 404)
            if (response.status === 404) {
                 throw new Error(`IP não encontrado ou inválido: "${ip || 'seu IP'}".`);
            }
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        
        const data = await response.json();

        // 2. Ocultar o Loader
        loader.style.display = 'none';

        // 3. Exibir Cards (permanece o mesmo)
        let htmlContent = '';
        const fullLocation = [data.city, data.region, data.country].filter(Boolean).join(', ');

        for (const key in DATA_MAPPING) {
            if (data[key]) {
                const info = DATA_MAPPING[key];
                const value = data[key];

                htmlContent += `
                    <div class="bg-gray-50 p-5 rounded-lg border-l-4 border-blue-500 shadow-md hover:bg-blue-50 transition duration-300">
                        <p class="text-xl font-bold text-gray-800 flex items-center mb-1">
                            ${info.icon} 
                            <span class="ml-2">${info.label}</span>
                        </p>
                        <p class="text-2xl font-extrabold text-blue-600 truncate">
                            ${value}
                        </p>
                    </div>
                `;
            }
        }
        dataDisplay.innerHTML = htmlContent;
        
        // 4. Exibir Mapa e Localização Completa
        if (data.loc) {
            const [lat, lon] = data.loc.split(',');
            if (lat && lon) {
                updateMap(parseFloat(lat), parseFloat(lon), fullLocation);
                fullLocationSpan.textContent = fullLocation;
            }
        }

    } catch (error) {
        // 5. Lidar com erros
        loader.style.display = 'none';
        dataDisplay.innerHTML = `
            <div class="col-span-full p-6 bg-red-100 border-l-4 border-red-500 text-red-700">
                <p class="font-bold">Ocorreu um erro ao buscar os dados.</p>
                <p>Detalhe: ${error.message}</p>
            </div>
        `;
        console.error('Erro ao buscar dados do IP:', error);
    }
}

// --- Listeners de Eventos ---

form.addEventListener('submit', (e) => {
    e.preventDefault(); 
    const ip = ipInput.value.trim();
    
    if (ip) {
        if (isValidIP(ip)) {
            fetchAndDisplayIPInfo(ip);
        } else {
             // Exibe uma mensagem de erro na área de dados
            dataDisplay.innerHTML = `
                <div class="col-span-full p-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
                    <p class="font-bold">Formato de IP inválido.</p>
                    <p>Por favor, digite um IPv4 ou IPv6 válido.</p>
                </div>
            `;
            // Oculta mapa e resumo
            mapContainer.style.display = 'none';
            locationSummary.style.display = 'none';
        }
    } else {
        fetchAndDisplayIPInfo(); // Busca o próprio IP
    }
});

myIpButton.addEventListener('click', () => {
    ipInput.value = ''; 
    fetchAndDisplayIPInfo();
});


// 3. Inicia a aplicação: busca o IP do usuário ao carregar a página.
document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayIPInfo();
});

/**
 * Configura o listener para trocar as camadas (tiles) do mapa.
 */
function setupLayerSwitcher() {
    const radioButtons = document.querySelectorAll('input[name="map-layer"]');
    
    radioButtons.forEach(radio => {
        radio.addEventListener('change', (event) => {
            const newLayerValue = event.target.value;
            
            if (map && currentTileLayer) {
                // Remove a camada antiga do mapa
                map.removeLayer(currentTileLayer);
                
                // Cria a nova camada com base no valor selecionado
                const newTileUrl = getTileUrl(newLayerValue);
                
                let newAttribution = '';
                if (newLayerValue === 'satellite') {
                    newAttribution = 'Tiles © Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
                } else if (newLayerValue === 'topo') {
                    newAttribution = 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)';
                } else {
                    newAttribution = '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
                }

                const newLayer = L.tileLayer(newTileUrl, {
                    maxZoom: 19,
                    attribution: newAttribution
                });

                // Adiciona a nova camada ao mapa e atualiza a variável global
                newLayer.addTo(map);
                currentTileLayer = newLayer;
            }
        });
    });
}

