// Initialize and add the map
function initMap() {
    // positions: church, restaurant and where to center
    var church_pos = {lat: 49.8739682, lng: 19.5253851};
    var restaurant_pos = {lat: 49.7781462, lng: 19.3188456};
    var hotel_pos = {lat: 49.889402, lng: 19.485535};
    var center_pos = {lat: 49.8242539, lng: 19.407922};

    // initialize map
    var map = new google.maps.Map(
        document.getElementById('map'), {zoom: 11, center: center_pos});

    // Markers for church and restaurant
    var church_marker = new google.maps.Marker({position: church_pos, map: map, title: 'Kościół'});
    var hotel_marker = new google.maps.Marker({position: hotel_pos, map: map, title: 'Hotel'});
    var resto_marker = new google.maps.Marker({position: restaurant_pos, map: map, title: 'Restauracja'});

}