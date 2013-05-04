function request(method, url, body, callback) {
    var req = new XMLHttpRequest();
    req.open(method, url, true);
    req.addEventListener('load', function(){
        callback(req, req.responseText);
    }, false);
    req.send(body);
}

function init() {
    var mostPopular= document.getElementById("most_popular");
    mostPopular.on('click', function(e){sortBy("most_popular");},false);
    var priceLowHigh = document.getElementById("price_low_high");
    priceLowHigh.on('click', function(e){sortBy("price_low_high");},false);
    var eventDate = document.getElementById("event_date");
    eventDate.on('click', function(e){sortBy("event_date");},false);
    var postDate = document.getElementById("post_date");
    postDate.on('click', function(e){sortBy("post_date");},false);
}
window.addEventListener('load', init, false);

function sortBy(type){
	request('GET', '/' + type, null);
}

