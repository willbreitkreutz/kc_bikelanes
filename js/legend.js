var legend = {
    title: "Kansas City Bicycle Infrastructure",
    description: 'Data courtesy <a href="http://marc.org">Mid-America Regional Council</a>',
    sections: [{
        title: 'Bike-Ways',
        className: 'section',
        keys: [
            {
                coordinates: [39.0587, -94.628, 15],
                text: "Bike Lanes",
                overlayStyle:'bikeLanes',
                name:'bikeLaneMap'
            },
            {
                coordinates: [39.0903, -94.581, 15],
                text: "Signed Bike Routes",
                overlayStyle:'bikeLanes',
                name:'bikeRouteMap'
            },
            {
                coordinates: [39.0385, -94.576, 15],
                text: "Shared Use Paths",
                overlayStyle:'bikeLanes',
                name:'bikePathMap'
            }
        ]
    }
]};

var legendMaps ={};

var legendBox = getEl('#legend');

var header = newEl('div', 'legend-header', legendBox);

var title = newEl('h1', 'legend-title', header);
    title.innerHTML = legend.title;

var subtitle = newEl('p', 'legend-subtitle', header);
    subtitle.innerHTML = legend.description;

var legendBody = newEl('div', 'legend-body', legendBox);

legend.sections.forEach(function(section){
    var sectionEl = newEl('div', 'legend-section', legendBody);
    var sectionTitle = newEl('h4', 'legend-section-title', sectionEl);
        sectionTitle.innerHTML = section.title;

    var keyList = newEl('ul','key-item-list',sectionEl);
    section.keys.forEach(function(key){
        var keyItem = newEl('li','key-item',keyList);
        var mapEl = newEl('div', 'key-item-map', keyItem);

            var keymap = L.map(mapEl, {
                center: [key.coordinates[0], key.coordinates[1]],
                zoom: key.coordinates[2],
                zoomControl: false,
                attributionControl: false,
                dragging: false,
                scrollWheelZoom: false,
                doubleClickZoom: false
            });
            var streetmap = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png').addTo(keymap);
            legendMaps[key.name]=keymap;

            keyItem.addEventListener('click', function(e){
                map.setView([key.coordinates[0], key.coordinates[1]],key.coordinates[2]);
                e.preventDefault();
            });

        var zoomTo = newEl('div', 'key-item-zoom-to', keyItem);
        var keyName = newEl('p', 'key-item-name', keyItem);
            keyName.innerHTML = key.text;
    });
});




