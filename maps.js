const map = L.map('map').setView([45.78191671914715, 4.748414], 13); //create the map




var greenIcon = L.icon({            //create the green marker for add to "Favoris"
    iconUrl: 'clipart2953301.png',

    iconAnchor:   [11, 41], // point of the icon which will correspond to marker's location
    iconSize:     [30, 40], // size of the icon



});


if(navigator.geolocation) {                             //Get the current location
    function maPosition(position) {
        var popup = L.popup()
            .setLatLng([position.coords.latitude , position.coords.longitude])
            .setContent("On est la")
            .openOn(map);
    }

    if(navigator.geolocation)
        navigator.geolocation.getCurrentPosition(maPosition);
} else {
    // Pas de support, proposer une alternative ?
}


var api = "https://api.jcdecaux.com/vls/v1/stations?contract=lyon&apiKey=ed01e060cf060e0356db159ccd729604caa3efc2"


loadDoc(api, bike); //first load off the bike
loadDoc(api,updateMarker); //first load of the favoris list


function loadDoc(url, cFunction) {      //function who get the json files from the api
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {cFunction(this);}
    xhttp.open("GET", url);
    xhttp.send();
}



function bike (xhttp){  //function who place the marker on the maps

    var json = JSON.parse(xhttp.response) //the json files from the api
    map.eachLayer((layer) => {          //clear the map
        layer.remove();
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    for(i = 0; i<json.length; i++) {

        if(localStorage.getItem("favoris"+i) == "True"){        //condition for know which marker place
            var bike_marker_green = L.marker([json[i].position.lat, json[i].position.lng], {icon: greenIcon }).addTo(map).bindPopup( //green marker
                "<table class=\"w3-table\">\n" +
                "<tr>\n" +
                "<th  id=\'name\' type=\"button\" class=\"w3-button w3-khaki w3-round-large\">" +json[i].name+"</th>"+
                "<td>"+ json[i].status+"<br></td>"+

                "<td><button id='fav' onclick='addFavoris("+ i +"), loadDoc(api, updateMarker, loadDoc(api, bike))'>Favoris</button><br></td>"+

                "</tr>\n" +
                "<tr>\n" +
                "<th> Velo disponible : </th>"+
                "<td>"+ json[i].available_bikes+"/"+ json[i].bike_stands+"<br></td>"+
                "</tr>\n" +
                "</table>");
        }else {

            var bike_marker_green = L.marker([json[i].position.lat, json[i].position.lng]).addTo(map).bindPopup(        //default marker
                "<table class=\"w3-table\">\n" +
                "<tr>\n" +
                "<th  id=\'name\' type=\"button\" class=\"w3-button w3-khaki w3-round-large\">" +json[i].name+"</th>"+
                "<td>"+ json[i].status+"<br></td>"+

                "<td><button id='fav' onclick='addFavoris("+ i +"), loadDoc(api, updateMarker), loadDoc(api, bike)'>Favoris</button><br></td>"+

                "</tr>\n" +
                "<tr>\n" +
                "<th> Velo disponible : </th>"+
                "<td>"+ json[i].available_bikes+"/"+ json[i].bike_stands+"<br></td>"+
                "</tr>\n" +
                "</table>");
        };


    };
    };




function addFavoris(i){                                         //function who update the marker in the local storage
    if(localStorage.getItem("favoris"+i) == "True"){
        localStorage.setItem("favoris"+i, "False");
    }else{
        localStorage.setItem("favoris"+i, "True");
    }


}

function updateMarker(json){                                //the function who list your favoris marker
    const xhttp = json
    json = JSON.parse(json.response);
    document.getElementById('favoris').innerHTML = "Vos favoris sont :";
    for(a = 0; a<json.length; a++) {

        if(localStorage.getItem("favoris"+a) == "True"){

            document.getElementById('favoris').innerHTML += "<br>"+json[a].name + " Il y a "+json[a].available_bikes+"/"+ json[a].bike_stands+" Velo disponible";

        }



    }
}
