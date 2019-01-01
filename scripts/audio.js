$('#sound-icon').click(() => { //When you click the speaker icon
    let isOn = sessionStorage.getItem("audioIsOn") || "no"; //get sessionStorage variable or assume it's no
    if (isOn == "yes") { //If when you click music is on:
        $('#sound-icon').get(0).src = './res/img/icons/soundoff.png' //change icon
        sessionStorage.setItem("audioIsOn", "no") //set sessionStorage variable
    }

    if (isOn == "no") { //If music is off do the same
        $('#sound-icon').get(0).src = './res/img/icons/soundon.png'
        sessionStorage.setItem("audioIsOn", "yes")
    }

    isOn = sessionStorage.getItem("audioIsOn") || "no"
    if (isOn == "yes") {
        $('#hungryMood').hover(() => {
            $('#hungry').get(0).play();
        })

        $('#hungryMood').mouseleave(() => {
            let sound = $('#hungry').get(0);
            sound.pause();
            sound.currentTime = 0;
        })

        $('#sadMood').hover(() => {
            $('#sad').get(0).playbackRate = 1.5;
            $('#sad').get(0).play();
        })

        $('#sadMood').mouseleave(() => {
            let sound = $('#sad').get(0);
            sound.pause();
            sound.currentTime = 0;
        })

        $('#tiredMood').hover(() => {
            $('#tired').get(0).play();
        })

        $('#tiredMood').mouseleave(() => {
            let sound = $('#tired').get(0);
            sound.pause();
            sound.currentTime = 0;
        })

        $('#romanticMood').hover(() => {
            $('#romantic').get(0).play();
        })

        $('#romanticMood').mouseleave(() => {
            let sound = $('#romantic').get(0);
            sound.pause();
            sound.currentTime = 0;
        })

        $('#adventMood').hover(() => {
            $('#adventurous').get(0).play();
        })

        $('#adventMood').mouseleave(() => {
            let sound = $('#adventurous').get(0);
            sound.pause();
            sound.currentTime = 0;
        })

        $('#creativeMood').hover(() => {
            $('#creative').get(0).play();
        })

        $('#creativeMood').mouseleave(() => {
            let sound = $('#creative').get(0);
            sound.pause();
            sound.currentTime = 0;
        })
    } else {
        //If sound is off, do nothing
        $('#creativeMood').off()
        $('#adventMood').off()
        $('#tiredMood').off()
        $('#hungryMood').off()
        $('#romanticMood').off()
        $('#sadMood').off()
    }
});
