data = JSON.parse(localStorage.getItem('data')) || json;

function updateStat(stat, query, elemY, elemN, value) {
    $(query).on('click', e => {
        // $('#select').get(0).play();
        let zone = $(e.target).closest('.modal-content').find('#modal-place_name').attr('zone')
        let place = $(e.target).closest('.modal-content').find('#modal-place_name').attr('place')
        data[zone][0][place][stat] = value;
        localStorage.setItem('data', JSON.stringify(data))

        if (data[zone][0][place][stat] === "yes") { //Checks from data if place has been visited and modifies the UI accordingly
            $(elemY).addClass('btn-success')
            $(elemN).removeClass('btn-danger')
        } else {
            $(elemN).addClass('btn-danger')
            $(elemY).removeClass('btn-success')
        }
    })
}

updateStat("isVisited", ".visited-yes", ".visited-yes", ".visited-no", "yes");
updateStat("isVisited", ".visited-no", ".visited-yes", ".visited-no", "no");
updateStat("isLiked", ".liked-yes", ".liked-yes", ".liked-no", "yes");
updateStat("isLiked", ".liked-no", ".liked-yes", ".liked-no", "no");


function updateMood(mood) {
    $(`#${mood}`).on('click', e => {
        // $('#select').get(0).play();
        let zone = $(e.target).closest('.modal-content').find('#modal-place_name').attr('zone')
        let place = $(e.target).closest('.modal-content').find('#modal-place_name').attr('place')
        let target = $(e.target).closest('.modal-mood');
        if (data[zone][0][place]["mood"].hasOwnProperty(mood)) {
            //If the place has MORE THAN 1 mood, then can delete. This is because if you delete all the moods from a place, it'll get lost in a limbo with no escape
            if (Object.keys(data[zone][0][place]["mood"]).length > 1) {
                delete data[zone][0][place]["mood"][mood];
                $(target).removeClass('hovered');
                $(target).css('background', 'rgba(222, 20, 20, 0.5)')
                $(target).mouseleave(e => {
                    $(e.target).removeAttr('style');
                })
            } else { //If mood is 1 or less, do not delete and tell the user why he can't do that
                $('.mood-error').css('display', 'initial')
            }
        } else {
            data[zone][0][place]["mood"][mood] = 1;
            $(target).addClass('hovered');
            $(target).css('background', 'rgba(20, 222, 20, 0.5)')
            $(target).mouseleave(e => {
                $(e.target).removeAttr('style');
            })
        }

        if (Object.keys(data[zone][0][place]["mood"]).length > 1) {
            $('.mood-error').css('display', 'none') //Hide the error message
        }

        $('.modal-content').mousemove(() => {
            $(target).removeAttr('style');
        })


        localStorage.setItem('data', JSON.stringify(data))
    })
}

updateMood("adventurous");
updateMood("sad");
updateMood("romantic");
updateMood("hungry");
updateMood("tired");
updateMood("creative");
