const brnoLat = 49.194213;
const brnoLng = 16.611515;
const brnoZoom = 16;

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

            allData.push({
                day: item.day,
                dayNight: item.dayNight,
                type: item.type,
                causedBy: item.causedBy,
                alcohol: item.alcohol,
                mainCause: item.mainCause,
                diedCount: item.diedCount,
                roadCondition: item.roadCondition,
                weather: item.weather,
                latitude: item.latitude,
                longitude: item.longitude
            });
        }

        addMarkers(allData);
    });
}

function addMarkers(data) {
    removeAllMarkers();
    for(var i = 0; i < data.length; i++) {
        const item = data[i];

        const day = item.day;
        const dayNight = item.dayNight;
        const type = item.type;
        const causedBy = item.causedBy;
        const alcohol = item.alcohol;
        const mainCause = item.mainCause;
        const diedCount = item.diedCount;
        const roadCondition = item.roadCondition;
        const weather = item.weather;
        const latitude = parseFloat(item.latitude);
        const longitude = parseFloat(item.longitude);

        const marker = new google.maps.Marker({
            position: {lat: latitude, lng: longitude},
            sName: i,
            map: map,
        });

        const contentText = `
        <table>
            <tr>
              <td><strong>Day</strong></td>
              <td>${day}</td>
            </tr>
            <tr>
                <td><strong>Day/Night</strong></td>
                <td>${dayNight}</td>
            </tr>
            <tr>
              <td><strong>Type</strong></td>
              <td>${type}</td>
            </tr>
            <tr>
                <td><strong>Caused by</strong></td>
                <td>${causedBy}</td>
            </tr>
            <tr>
              <td><strong>Alcohol</strong></td>
              <td>${alcohol}</td>
            </tr>
            <tr>
                <td><strong>Main cause</strong></td>
                <td>${mainCause}</td>
            </tr>
            <tr>
                <td><strong>Died</strong></td>
                <td>${diedCount}</td>
            </tr>
            <tr>
                <td><strong>Road condition</strong></td>
                <td>${roadCondition}</td>
            </tr>
            <tr>
                <td><strong>Weather</strong></td>
                <td>${weather}</td>
            </tr>
        </table>
        `;

        const infoWindow = new google.maps.InfoWindow({
            content: contentText
        });

        marker.addListener('click', function() {
            infoWindow.open(map, marker);
        });

        markers.push(marker);
    }
}

function removeAllMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}