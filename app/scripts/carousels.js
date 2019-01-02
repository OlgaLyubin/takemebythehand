$(document).ready(function() {
    let currentPage = window.location.href.split('/carousels.html?')[1]; //Get the final part of our link, used as a variable
    let data = JSON.parse(localStorage.getItem('data')) || json; //Gets the data from localStorage or json
    //localStorage.setItem('data', JSON.stringify(json)) //Reset data
    let isEmpty = true; //Is the carousel empty? this is set to false as soon as one place is added to a carousel

    let wrapper = document.createElement('div')
    wrapper.className = 'carouselElement moodsContent'

    let title;
    if (currentPage == "isLiked") {
        title = 'These are the places you liked:'
    } else if (currentPage == "isVisited") {
        title = 'These are the places you want to visit:'
    } else {
        title = `If you are feeling ${currentPage}, you might like this:`;
    }
    $('.moodTitle').html(title);


    /*Display romantic animation on page load*/
    if (currentPage == "romantic") {
        let c = document.createElement('canvas')
        $(c).click(e => {
            $(e.target).remove();
        })
        c.zIndex = 10;
        c.style = 'position:absolute; top:0; left:0;'
        let w = window.innerWidth
        let h = window.innerHeight
        c.width = w
        c.height = h
        let ctx = c.getContext("2d");


        var imgTag = new Image();
        var x = 0;
        var y = c.height;
        var hearts = [];
        var maxHearts = 100;
        var minScale = 0.4;


        for (var a = 0; a < maxHearts; a++) {
            var scale = (Math.random() * (1 - minScale)) + minScale;
            hearts.push({
                x: Math.random() * c.width,
                y: Math.random() * c.height / 2 - c.height / 2,
                ys: Math.random() + 18,
                height: scale * 60,
                width: scale * 60,
                opacity: scale
            });
        }

        setInterval(function() {
            ctx.clearRect(0, 0, c.width, c.height);

            for (var i = 0; i < hearts.length; i++) {
                var heart = hearts[i];
                heart.image = new Image();
                heart.image.style.height = heart.height;
                heart.image.src = `../public/res/img/icons/romantic.svg`;
                ctx.globalAlpha = heart.opacity;
                ctx.drawImage(heart.image, heart.x, heart.y, heart.width, heart.height);
            }

            for (var b = 0; b < hearts.length; b++) {
                var heart = hearts[b];
                heart.y += heart.ys;
                heart.ys += heart.y / c.height;
            }
        }, 30);

        $('body').get(0).appendChild(c);

        setTimeout(function() {
            $(c).remove() //Deleting the canvas after x amount of time
        }, 2500);
    }



    if (currentPage != "isLiked" && currentPage != "isVisited") { //If the current page link is not isLiked or isVisited, then fill the carousel with moods
        for (let zone in data) {
            data[zone].forEach(placesObj => {
                const placesNames = Object.keys(placesObj);
                for (let place of placesNames) {

                    if (placesObj[place].mood.hasOwnProperty(currentPage)) {
                        isEmpty = false; //Not empty anymore
                        let moods = placesObj[place].mood;

                        //We will create all the elements needed to be put inside the carousel
                        let wrapper = document.createElement('div')
                        wrapper.className = 'carouselElement moodsContent'

                        $('#carousel').get(0).appendChild(wrapper)

                        let placePic = document.createElement('img')
                        placePic.src = `.${placesObj[place].picture}`
                        placePic.className = 'carouselPics'

                        wrapper.appendChild(placePic)

                        let nameOfPlace = document.createElement('h2')
                        nameOfPlace.className = 'placeName'
                        $(nameOfPlace).html(placesObj[place].name)

                        wrapper.appendChild(nameOfPlace)

                        let description = document.createElement('p')
                        description.className = 'description'
                        $(description).html(placesObj[place].description)

                        wrapper.appendChild(description)

                        let clock = document.createElement('img')
                        clock.src = './res/img/icons/clock.png'
                        clock.className = 'clock'
                        $(clock).attr('data-toggle', 'tooltip');
                        $(clock).attr('data-placement', 'bottom');
                        $(clock).attr('title', `Weekdays:\n ${placesObj[place].weekdays} \n Weekends:\n ${placesObj[place].weekends}`);

                        wrapper.appendChild(clock)


                        let settings = document.createElement('img')
                        settings.src = './res/img/icons/settingsicon.png'
                        settings.className = 'settingsicon'
                        $(settings).attr('data-toggle', 'modal');
                        $(settings).attr('data-target', '#changeSettings');

                        wrapper.appendChild(settings)


                        let pound = document.createElement('img')
                        pound.src = './res/img/icons/pound.png'
                        pound.className = 'pound'
                        $(pound).attr('data-toggle', 'tooltip');
                        $(pound).attr('data-placement', 'bottom');
                        $(pound).attr('title', `£ ${placesObj[place].price}`);

                        wrapper.appendChild(pound)

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
                    }
                }
            })
        }
    } else { //If page link contains isLiked or isVisited, then fill the carousel with those places (liked or wishlist places)
        for (let zone in data) {
            data[zone].forEach(placesObj => {
                const placesNames = Object.keys(placesObj);
                for (let place of placesNames) {

                    if (placesObj[place][currentPage] == "yes") {
                        isEmpty = false; //Not empty anymore
                        let moods = placesObj[place].mood;


                        let wrapper = document.createElement('div')
                        wrapper.className = 'carouselElement moodsContent'

                        $('#carousel').get(0).appendChild(wrapper)

                        let placePic = document.createElement('img')
                        placePic.src = `.${placesObj[place].picture}`
                        placePic.className = 'carouselPics'

                        wrapper.appendChild(placePic)

                        let nameOfPlace = document.createElement('h2')
                        nameOfPlace.className = 'placeName'
                        $(nameOfPlace).html(placesObj[place].name)

                        wrapper.appendChild(nameOfPlace)

                        let description = document.createElement('p')
                        description.className = 'description'
                        $(description).html(placesObj[place].description)

                        wrapper.appendChild(description)

                        let clock = document.createElement('img')
                        clock.src = './res/img/icons/clock.png'
                        clock.className = 'clock'
                        $(clock).attr('data-toggle', 'tooltip');
                        $(clock).attr('data-placement', 'bottom');
                        $(clock).attr('title', `Weekdays:\n ${placesObj[place].weekdays} \n Weekends:\n ${placesObj[place].weekends}`);

                        wrapper.appendChild(clock)


                        let settings = document.createElement('img')
                        settings.src = './res/img/icons/settingsicon.png'
                        settings.className = 'settingsicon'
                        $(settings).attr('data-toggle', 'modal');
                        $(settings).attr('data-target', '#changeSettings');

                        wrapper.appendChild(settings)


                        let pound = document.createElement('img')
                        pound.src = './res/img/icons/pound.png'
                        pound.className = 'pound'
                        $(pound).attr('data-toggle', 'tooltip');
                        $(pound).attr('data-placement', 'bottom');
                        $(pound).attr('title', `£ ${placesObj[place].price}`);

                        wrapper.appendChild(pound)

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
                    }
                }
            })
        }
    }

    /* Display error message if carousels are empty */
    if (isEmpty) { //If the carousel is empty, display a message
        let emptyCarousel = document.createElement('h1');
        if (currentPage == "isLiked") {
            $(emptyCarousel).html("You didn't like any place yet..")
            $(emptyCarousel).addClass('emptyCarousel')
        }
        if (currentPage == "isVisited") {
            $(emptyCarousel).html("You didn't add any place to the wishlisth yet..")
            $(emptyCarousel).addClass('emptyCarousel')
        }
        $('#carousel').get(0).appendChild(emptyCarousel)
    }


});

$(document).ready(function() {
    $('#carousel').slick({
        dots: true,
        slidesToShow: 3,
        arrows: true,
    });
});

$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
});
