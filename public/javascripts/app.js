const brnoLat = 49.194213;
const brnoLng = 16.611515;
const brnoZoom = 14;

var map;
var markers = [];
var allData = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: brnoLat, lng: brnoLng},
        zoom: brnoZoom
    });

    fetch(`${window.location.origin}/data`).then(response => response.json()).then(data => {
        for(var i = 0; i < data.length; i++) {
            const item = data[i];
            const latitude = item.latitude;
            const longitude = item.longitude;
            const alcoholOrDrugs = item.alcoholOrDrugs;

            allData.push({
                latitude: latitude,
                longitude: longitude,
                alcoholOrDrugs: alcoholOrDrugs,
            });
        }
        addMarkers(allData);
    });
}

function addMarkers(data) {
    removeAllMarkers();
    for(var i = 0; i < data.length; i++) {
        const item = data[i];
        markers.push(new google.maps.Marker({
            position: {lat: item.latitude, lng: item.longitude},
            sName: i,
            map: map,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8.5,
                fillColor: "#F00",
                fillOpacity: 0.4,
                strokeWeight: 0.4
            },
        }));
    }
}

function removeAllMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}