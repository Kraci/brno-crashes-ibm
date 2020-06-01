const brnoLat = 49.194213;
const brnoLng = 16.611515;
const brnoZoom = 16;
const all = "All";

var map;
var markers = [];
var allData = [];

var dayNightFilter = all;
var diedFilter = all;
var alcoholFilter = all;

function initMap() {
    showLoading(true);

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

        showLoading(false);
        updateMarkers(allData);
    });
}

function showLoading(show) {
    const loader = document.getElementById("loader");
    loader.style.display = show ? "block" : "none";
}

function updateMarkers(data) {
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

function alcoholCondition(alcohol) {
    if (alcoholFilter === all) {
        return true;
    }
    if (alcoholFilter === true) {
        return alcohol !== "No" && alcohol !== "Not tested";
    }
    if (alcoholFilter === false) {
        return alcohol === "No";
    }
    return false;
}

function updateFilteredData() {
    var filteredData = [];
    allData.forEach(d => {
        if ((dayNightFilter === all || d.dayNight === dayNightFilter) &&
            (diedFilter === all || d.diedCount === diedFilter) &&
            (alcoholCondition(d.alcohol))) {
            filteredData.push(d);
        }
    });
    updateMarkers(filteredData);
}

function toggleButton(btn, toggle) {
    if (toggle) {
        btn.classList.remove("uk-button-default");
        btn.classList.add("uk-button-primary");
    } else {
        btn.classList.remove("uk-button-primary");
        btn.classList.add("uk-button-default");
    }
}

function isActive(btn) {
    return btn.classList.contains("uk-button-primary");
}

// Day Night Filter

const dayNightFilterBtn = document.querySelector("#day-night-filter");
const dayBtn = document.querySelector("#day-btn");
const nightBtn = document.querySelector("#night-btn");

function dayClicked() {
    if (isActive(dayBtn)) {
        toggleButton(dayBtn, false);
        dayNightFilterBtn.innerHTML = all;
        dayNightFilter = all;
    } else {
        toggleButton(dayBtn, true);
        toggleButton(nightBtn, false);
        dayNightFilterBtn.innerHTML = "Day";
        dayNightFilter = "Day";
    }
    updateFilteredData();
}

function nightClicked() {
    if (isActive(nightBtn)) {
        toggleButton(nightBtn, false);
        dayNightFilterBtn.innerHTML = all;
        dayNightFilter = all;
    } else {
        toggleButton(nightBtn, true);
        toggleButton(dayBtn, false);
        dayNightFilterBtn.innerHTML = "Night";
        dayNightFilter = "Night";
    }
    updateFilteredData();
}

// Died Filter

const diedFilterBtn = document.querySelector("#died-filter");
const diedBtn = document.querySelector("#died-btn");
const notDiedBtn = document.querySelector("#not-died-btn");

function diedClicked() {
    if (isActive(diedBtn)) {
        toggleButton(diedBtn, false);
        diedFilterBtn.innerHTML = all;
        diedFilter = all;
    } else {
        toggleButton(diedBtn, true);
        toggleButton(notDiedBtn, false);
        diedFilterBtn.innerHTML = ">0";
        diedFilter = 1;
    }
    updateFilteredData();
}

function notDiedClicked() {
    if (isActive(notDiedBtn)) {
        toggleButton(notDiedBtn, false);
        diedFilterBtn.innerHTML = all;
        diedFilter = all;
    } else {
        toggleButton(notDiedBtn, true);
        toggleButton(diedBtn, false);
        diedFilterBtn.innerHTML = "0";
        diedFilter = 0;
    }
    updateFilteredData();
}

// Alcohol Filter

const alcoholFilterBtn = document.querySelector("#alcohol-filter");
const alcoholBtn = document.querySelector("#alcohol-btn");
const noAlcoholBtn = document.querySelector("#no-alcohol-btn");

function alcoholClicked() {
    if (isActive(alcoholBtn)) {
        toggleButton(alcoholBtn, false);
        alcoholFilterBtn.innerHTML = all;
        alcoholFilter = all;
    } else {
        toggleButton(alcoholBtn, true);
        toggleButton(noAlcoholBtn, false);
        alcoholFilterBtn.innerHTML = "Alcohol";
        alcoholFilter = true;
    }
    updateFilteredData();
}

function noAlcoholClicked() {
    if (isActive(noAlcoholBtn)) {
        toggleButton(noAlcoholBtn, false);
        alcoholFilterBtn.innerHTML = all;
        alcoholFilter = all;
    } else {
        toggleButton(noAlcoholBtn, true);
        toggleButton(alcoholBtn, false);
        alcoholFilterBtn.innerHTML = "No Alcohol";
        alcoholFilter = false;
    }
    updateFilteredData();
}