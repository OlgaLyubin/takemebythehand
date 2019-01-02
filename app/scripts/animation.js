$(document).ready(function() { //Waits for page to load

    $('.moodsConts.romanticMood').click(() => { //If you click on romantic mood

        let c = document.createElement('canvas') //Create a canvas
        $(c).click(e => {
            $(e.target).remove();
        })
        c.zIndex = 10; //Put the canvas on top of everything
        c.style = 'position:absolute; top:0; left:0;'
        let w = window.innerWidth
        let h = window.innerHeight
        c.width = w
        c.height = h
        let ctx = c.getContext("2d");


        var imgTag = new Image(); //Create a new image
        var x = 0; //Sets its coordinates
        var y = c.height;
        var hearts = []; //Create an array to store the images
        var maxHearts = 100; //amount of images
        var minScale = 0.4; //minimum scale


        for (var a = 0; a < maxHearts; a++) { //Populate the hearts array with images with random height and speed
            var scale = (Math.random() * (1 - minScale)) + minScale;
            hearts.push({
                x: Math.random() * c.width,
                y: Math.random() * c.height / 2 - c.height / 2,
                ys: Math.random() + 18, //Speed
                height: scale * 60,
                width: scale * 60,
                opacity: scale
            });
        }

        setInterval(function() { //Animate at 30 frames per seconds
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
                heart.ys += heart.y / c.height; //Acceleration based on the y position on the screen
            }
        }, 30); //30 frames per second

        $('body').get(0).appendChild(c); //Show the canvas

        setTimeout(function() {
            $(c).remove() //Deleting the canvas after x amount of time
        }, 2500);
    })
})
