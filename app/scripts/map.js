let moodColour; //Obj containing mood:colour
let data; //Used to store a copy of json - so we modify the copy, not the original
let adventurous, hungry, creative, tired, romantic, sad; //Used to filter the markers
let liked, visited; //Used to filter the markers

function setup() {
    noCanvas();
    /* Data is the variable we will use to keep track of user preferences. E.g. if a user says he/she likes a place, it will be stored in 'data'. And this will be stored in localStorage*/
    data = JSON.parse(localStorage.getItem('data')) || json; //Using localStorage 'data' if it exists, else use json (which is default data)
    //localStorage.setItem('data', JSON.stringify(json)) //save 'data' to localStorage
    moodColour = {
        adventurous: "rgba(66, 173, 244, 0.65)",
        hungry: "rgba(118, 69, 209, 0.65)",
        creative: "rgba(229, 150, 22, 0.65)",
        tired: "rgba(56, 181, 97, 0.65)",
        romantic: "rgba(218, 118, 104, 0.65)",
        sad: "rgba(244, 205, 65, 0.65)"
    }
    let map = createMap(51.509865, -0.118092); //Creates a map centered in London center
    setupMoodFilter(map);
    setupListFilter(map);
}

function draw() {
    noLoop();
}

function createMap(lat, long) {
    mapboxgl.accessToken = API_KEY;
    let map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v10',
        center: [long, lat],
        zoom: 12,
    });
    return map;
}

function createMarker(lat, long, map) {
    return new mapboxgl.Marker()
        .setLngLat([long, lat])
        .addTo(map)
}

function setupMarkersByMood(map, mood) { //Creates and places markers based on mood (adventurous, tired, sad, romantic, hungry, creative)
    let curMap = map;
    let curMarkers = [];
    for (let zone in data) {
        data[zone].forEach(placesObj => {
            const placesNames = Object.keys(placesObj)
            for (let place of placesNames) {
                let coords = [placesObj[place].long, placesObj[place].lat];
                let moods = placesObj[place].mood;

                if (moods.hasOwnProperty(mood)) {

                    //Marker
                    let el = document.createElement('div');
                    el.className = 'marker';
                    el.style.background = moodColour[mood];

                    //Name
                    let name = document.createElement('p');
                    name.className = 'marker-name';
                    name.innerHTML = placesObj[place].name;
                    el.appendChild(name);

                    //Icons
                    let icons = document.createElement('div');
                    icons.className = 'marker-icon-wrapper'

                    let settings = document.createElement('img')
                    settings.className = 'marker-icon'
                    settings.src = '../public/res/img/icons/settings.svg'
                    $(settings).attr('data-toggle', 'modal');
                    $(settings).attr('data-target', '#changeSettings');

                    $(settings).hover(e => { //Animate to signify click affordance
                        $(e.target).toggleClass('icon-hover')
                    })

                    $(settings).on('click', e => {
                        $('#modal-place_name').html(placesObj[place].name) //Set modal name to place clicked
                        $('#modal-place_name').attr('zone', zone)
                        $('#modal-place_name').attr('place', place)


                        if (placesObj[place].isVisited === "yes") { //Checks from data if place has been visited and modifies the UI accordingly
                            $('.visited-yes').addClass('btn-success')
                            $('.visited-no').removeClass('btn-danger')
                        } else {
                            $('.visited-no').addClass('btn-danger')
                            $('.visited-yes').removeClass('btn-success')
                        }

                        if (placesObj[place].isLiked === "yes") {
                            $('.liked-yes').addClass('btn-success')
                            $('.liked-no').removeClass('btn-danger')
                        } else {
                            $('.liked-no').addClass('btn-danger')
                            $('.liked-yes').removeClass('btn-success')
                        }

                        /* Resets hovered moods */
                        $('.grid-container-modal a').each((idx, el) => {
                            $(el).removeClass('hovered')
                        })
                        /* Turns on active moods */
                        Object.keys(moods).forEach(singleMood => {
                            $(`#${singleMood}`).addClass('hovered');
                        })

                    })
                    icons.appendChild(settings);

                    let showPlaceInfo = document.createElement('img')
                    showPlaceInfo.className = 'marker-icon'
                    showPlaceInfo.src = '../public/res/img/icons/placeholder.svg'
                    icons.appendChild(showPlaceInfo);

                    el.appendChild(icons);

                    el.addEventListener('mouseenter', () => {
                        $(name).toggleClass('hovered');
                        icons.style.display = 'inline-grid'
                    })

                    el.addEventListener('mouseleave', () => {
                        $(name).toggleClass('hovered');
                        icons.style.display = 'none'
                    })


                    //Add marker to map
                    let curMarker = new mapboxgl.Marker({
                            element: el,
                            anchor: 'bottom'
                        })

                        .setLngLat(coords)
                        .addTo(curMap);

                    curMarkers.push(curMarker)
                }
            }
        });
    }
    return curMarkers;
}

function setupMarkersList(map, key) { //Creates and places markers based on isVisited or isLiked
    let curMap = map;
    let curMarkers = [];
    for (let zone in data) {
        data[zone].forEach(placesObj => {
            const placesNames = Object.keys(placesObj)
            for (let place of placesNames) {
                let coords = [placesObj[place].long, placesObj[place].lat];
                let list = placesObj[place][key];
                let moods = placesObj[place].mood;

                if (list == "yes") {

                    //Marker
                    let el = document.createElement('div');
                    el.className = 'marker';
                    el.style.background = (key == "isVisited") ? "rgba(255, 100, 100, 0.65)" : "rgba(100, 100, 255, 0.65)";

                    //Name
                    let name = document.createElement('p');
                    name.className = 'marker-name';
                    name.innerHTML = placesObj[place].name;
                    el.appendChild(name);

                    //Icons
                    let icons = document.createElement('div');
                    icons.className = 'marker-icon-wrapper'

                    let settings = document.createElement('img')
                    settings.className = 'marker-icon'
                    settings.src = '../public/res/img/icons/settings.svg'
                    $(settings).attr('data-toggle', 'modal');
                    $(settings).attr('data-target', '#changeSettings');

                    $(settings).hover(e => { //Animate to signify click affordance
                        $(e.target).toggleClass('icon-hover')
                    })

                    $(settings).on('click', e => {
                        $('#modal-place_name').html(placesObj[place].name) //Set modal name to place clicked
                        $('#modal-place_name').attr('zone', zone)
                        $('#modal-place_name').attr('place', place)


                        if (placesObj[place].isVisited === "yes") { //Checks from data if place has been visited and modifies the UI accordingly
                            $('.visited-yes').addClass('btn-success')
                            $('.visited-no').removeClass('btn-danger')
                        } else {
                            $('.visited-no').addClass('btn-danger')
                            $('.visited-yes').removeClass('btn-success')
                        }

                        if (placesObj[place].isLiked === "yes") {
                            $('.liked-yes').addClass('btn-success')
                            $('.liked-no').removeClass('btn-danger')
                        } else {
                            $('.liked-no').addClass('btn-danger')
                            $('.liked-yes').removeClass('btn-success')
                        }

                        /* Resets hovered moods */
                        $('.grid-container-modal a').each((idx, el) => {
                            $(el).removeClass('hovered')
                        })
                        /* Turns on active moods */
                        Object.keys(moods).forEach(singleMood => {
                            $(`#${singleMood}`).addClass('hovered');
                        })

                    })
                    icons.appendChild(settings);

                    let showPlaceInfo = document.createElement('img')
                    showPlaceInfo.className = 'marker-icon'
                    showPlaceInfo.src = '../public/res/img/icons/placeholder.svg'
                    icons.appendChild(showPlaceInfo);

                    el.appendChild(icons);

                    el.addEventListener('mouseenter', () => {
                        $(name).toggleClass('hovered');
                        icons.style.display = 'inline-grid'
                    })

                    el.addEventListener('mouseleave', () => {
                        $(name).toggleClass('hovered');
                        icons.style.display = 'none'
                    })


                    //Add marker to map
                    let curMarker = new mapboxgl.Marker({
                            element: el,
                            anchor: 'bottom'
                        })

                        .setLngLat(coords)
                        .addTo(curMap);

                    curMarkers.push(curMarker)
                }
            }
        });
    }
    return curMarkers;
}

function setIsLiked(zone, place, isLiked) {
    data[zone][0][place].isLiked = isLiked;
}

function setIsVisited(zone, place, isVisited) {
    data[zone][0][place].isLiked = isVisited;
}

function removeMarkers(markersArray) { //Removes all markers of a mood
    if (markersArray != null) {
        for (let marker of markersArray) {
            marker.remove()
        }
    }
}

function setupListFilter(map) {
    $('.like-btn').click(e => {
        removeMarkers(liked);
        liked = setupMarkersList(map, "isLiked");

        removeMarkers(visited);
        removeMarkers(adventurous);
        removeMarkers(hungry);
        removeMarkers(sad);
        removeMarkers(romantic);
        removeMarkers(creative);
        removeMarkers(tired);
    })

    $('.wish-btn').click(e => {
        removeMarkers(visited);
        visited = setupMarkersList(map, "isVisited");

        removeMarkers(liked);
        removeMarkers(adventurous);
        removeMarkers(hungry);
        removeMarkers(sad);
        removeMarkers(romantic);
        removeMarkers(creative);
        removeMarkers(tired);
    })

}

function setupMoodFilter(map) {
    $('.adventMood').not('.modal-mood').click(e => {
        removeMarkers(adventurous); //Remove markers so they don't pile up
        adventurous = setupMarkersByMood(map, 'adventurous');

        $('.moodsConts').not('#adventMood').each((idx, mood) => {
            $(mood).removeClass('selected')
        })

        removeMarkers(liked);
        removeMarkers(visited);
        removeMarkers(hungry);
        removeMarkers(sad);
        removeMarkers(romantic);
        removeMarkers(creative);
        removeMarkers(tired);
    })

    $('.sadMood').not('.modal-mood').click(e => {
        removeMarkers(sad);
        sad = setupMarkersByMood(map, 'sad');

        $('.moodsConts').not('#romanticMood').each((idx, mood) => {
            $(mood).removeClass('selected')
        })

        removeMarkers(liked);
        removeMarkers(visited);
        removeMarkers(adventurous);
        removeMarkers(romantic);
        removeMarkers(hungry);
        removeMarkers(creative);
        removeMarkers(tired);
    })

    $('.romanticMood').not('.modal-mood').click(e => {
        removeMarkers(romantic);
        romantic = setupMarkersByMood(map, 'romantic');

        $('.moodsConts').not('#romanticMood').each((idx, mood) => {
            $(mood).removeClass('selected')
        })

        removeMarkers(liked);
        removeMarkers(visited);
        removeMarkers(sad);
        removeMarkers(adventurous);
        removeMarkers(hungry);
        removeMarkers(creative);
        removeMarkers(tired);
    })

    $('.tiredMood').not('.modal-mood').click(e => {
        removeMarkers(tired);
        tired = setupMarkersByMood(map, 'tired');

        $('.moodsConts').not('#tiredMood').each(mood => {
            $(mood).removeClass('selected')
        })

        removeMarkers(liked);
        removeMarkers(visited);
        removeMarkers(sad);
        removeMarkers(romantic);
        removeMarkers(hungry);
        removeMarkers(creative);
        removeMarkers(adventurous);
    })

    $('.hungryMood').not('.modal-mood').click(e => {
        removeMarkers(hungry);
        hungry = setupMarkersByMood(map, 'hungry');

        $('.moodsConts').not('#romanticMood').each((idx, mood) => {
            $(mood).removeClass('selected')
        })

        removeMarkers(liked);
        removeMarkers(visited);
        removeMarkers(adventurous);
        removeMarkers(sad);
        removeMarkers(romantic);
        removeMarkers(creative);
        removeMarkers(tired);
    })

    $('.creativeMood').not('.modal-mood').click(e => {
        removeMarkers(creative);
        creative = setupMarkersByMood(map, 'creative');

        $('.moodsConts').not('#romanticMood').each((idx, mood) => {
            $(mood).removeClass('selected')
        })

        removeMarkers(liked);
        removeMarkers(visited);
        removeMarkers(sad);
        removeMarkers(romantic);
        removeMarkers(hungry);
        removeMarkers(adventurous);
        removeMarkers(tired);
    })

}
