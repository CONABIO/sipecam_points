var map = null;
var node_map = null;
var ecosystem = 'default';
var degradation = 'default';

function filterEcosystems() {
    const sites = [...new Set(sitios.map(s => s.Ecosistema))].sort();

    sites.forEach(n => {
        let o = new Option(n, n);
        /// jquerify the DOM object 'o' so we can use the html method
        $(o).html(n);
        $('#ecosistema-select').append(o);
    });
}

function initMap() {
    mapboxgl.accessToken = 'pk.eyJ1IjoibnRyaW5pZGFkLWNvbmFiaW8iLCJhIjoiY2s1NWc5d3B3MGpsazNkc2JvdDl0dmswOSJ9.7aVSqlGPrLBHjt23HjBgPA';
			
	map = new mapboxgl.Map({
				container: 'map',
				style: 'mapbox://styles/ntrinidad-conabio/ck680atts0k851inxdfu5p1gh'
			});
    map.on('load', function () {
        map.addSource('sipecam-sites-src', {
            type: 'geojson',
            data: {
              "type": "FeatureCollection",
              "features": []
            }
        });


        map.addLayer({
            "id": "sipecam-sites",
            "type": "symbol",
            "source": 'sipecam-sites-src',
            "layout": {
                "icon-image": "alfiler",
                "icon-allow-overlap": false,
                "icon-size": 0.05,
                "text-field": "{id_sipecam}",
                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                "text-offset": [0, 0.9],
                "text-anchor": "top",
                "text-size": 10,
                "text-allow-overlap": true
            },
            "paint": {
                "text-color": "#f46f02",
            }
        });
        

        map.on('click', 'sipecam-sites', e => {
            const site_id = e.features[0].properties.id_sipecam;
            const info = sitios.find(b => b.id_sipe == site_id);
            
            const t = `<tr><td>FID_sipeca</td><td>${info.FID_sipeca}</td></tr>`
                    + `<tr><td>FID_sipe_1</td><td>${info.FID_sipe_1}</td></tr>`
                    + `<tr><td>ANP</td><td>${info.anpMarcelo}</td></tr>`
                    + `<tr><td>Ecosistema</td><td>${info.Ecosistema}</td></tr>`
                    + `<tr><td>ID Ecosistema</td><td>${info.id_Ecosist}</td></tr>`
                    + `<tr><td>ID Cúmulo</td><td>${info.ID_cumulo}</td></tr>`
                    + `<tr><td>ID SIPECAM</td><td>${info.id_sipe}</td></tr>`
                    + `<tr><td>Integridad</td><td>${info.cat_itegr}</td></tr>`
                    + `<tr><td>Coordenadas</td><td>${info["coords.x1"]}, ${info["coords.x2"]}</td></tr>`;
            
            $('#info-table tbody').html(t);
            $('#info-modal .modal-footer p').text(`Longitud ${info.LONGITUD},  Latitud ${info.LATITUD},  Altitud ${info.Altitud_m}.`);
            $('#info-modal').modal('show');

            setTimeout(() => {
                node_map.resize();
                setNodePin(info.LONGITUD, info.LATITUD);
            }, 250);
        });

        placeSites();
    });
   
}

function initNodeMap() {
    mapboxgl.accessToken = 'pk.eyJ1IjoibnRyaW5pZGFkLWNvbmFiaW8iLCJhIjoiY2s1NWc5d3B3MGpsazNkc2JvdDl0dmswOSJ9.7aVSqlGPrLBHjt23HjBgPA';
			
	node_map = new mapboxgl.Map({
		container: 'node_map',
        style: 'mapbox://styles/ntrinidad-conabio/ck680atts0k851inxdfu5p1gh',
        zoom: 7
	});
    node_map.on('load', function () {
        node_map.addSource('sipecam-sites-src', {
            type: 'geojson',
            data: {
              "type": "FeatureCollection",
              "features": []
            }
        });


        node_map.addLayer({
            "id": "sipecam-sites",
            "type": "symbol",
            "source": 'sipecam-sites-src',
            "layout": {
                "icon-image": "alfiler",
                "icon-allow-overlap": false,
                "icon-size": 0.08,
                "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
                "text-offset": [0, 0.9],
                "text-anchor": "top",
            }
        });
    });
   
}

function placeSites() {
    let p = sitios;

    if (ecosystem != 'default') {
        p = p.filter(s => s.Ecosistema === ecosystem);
    }

    if (degradation != 'default') {
        p = p.filter(s => s.cat_itegr === degradation);
    }

    p = p.map(s => {
        const lng = s.LONGITUD != 0 ? Number(s.LONGITUD) : -99.1269;
        const lat = s.LATITUD != 0 ? Number(s.LATITUD) : 19.4978;
        return {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [lng, lat]
            },
            'properties': {
                'id': s.FID_sipeca,
                'ecosistema': s.Ecosistema,
                'integridad': s.cat_itegr,
                'id_sipecam': s.id_sipe
            }
        }
    });
 
    map.getSource('sipecam-sites-src').setData({
        "type": "FeatureCollection",
        "features": p
    });

    $('#sites-number').text(`${p.length}`);
}

function setNodePin(lng, lat) {
    node_map.getSource('sipecam-sites-src').setData({
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [lng, lat]
            }
        }]
    });

    node_map.flyTo({
        center: [lng, lat]
    });
}

$(function(){ 
    initMap();
    filterEcosystems();
    initNodeMap();

    $('#ecosistema-select').on('change',function() {
        map.getSource('sipecam-sites-src').setData({
            "type": "FeatureCollection",
            "features": []
        });
        ecosystem = $('#ecosistema-select').val();
        placeSites();
        // console.log('ecosistema', this.value);
    });

    $('#degradacion-select').on('change',function() {
        map.getSource('sipecam-sites-src').setData({
            "type": "FeatureCollection",
            "features": []
        });
        degradation = $('#degradacion-select').val();
        placeSites();
    });

});