(function ($) {

    //======= PRELOADER ========//
    $(window).on('load', function () {
        $('#preloader').delay(800).fadeOut('slow');
        $('#onboard-page').delay(550).fadeIn('slow').css({
            'overflow': 'visible'
        });
    });

    //======= Sign Up ========//
    $('#signup-form').on('submit', function (e) {
        e.preventDefault()
        let userName = $("#signup-username").val()
        let userPass = $("#signup-userpass").val()
        if (localStorage) {
            let userData = JSON.parse(localStorage.getItem("userKey"))
            if (!userData) {
                userData = {}
            }
            userData[userName] = {
                "userName": userName,
                "userPass": userPass
            }
            localStorage.setItem('userKey', JSON.stringify(userData))
             window.location.href = "#onboard-page"
        } else {
            alert('Cannot sign up in Private mode!')
        }
    })

    //======= login ========//
    let loginUser
    let alertMessage = $(".alert")

    $('.login-btn').on('click', function() {
        alertMessage.empty()
        $("#login-username").val("")
        $("#login-userpass").val("")
    })

    $("#login-form").on('submit', function(e) {
        event.preventDefault()
        let name = $("#login-username").val()
        let password = $("#login-userpass").val()
        

        if(localStorage) {
            let userData = JSON.parse(localStorage.getItem("userKey"))
            if (!userData) userData = {}
            if (userData[name]) {
                if (userData[name].userName !== name || userData[name].userPass !== password) {
                    alertMessage.text("Username and password does not match! Please try again!")
                } else {
                    loginUser = name
                    user()
                    window.location.href = "#home"
                }
            } else {
                alertMessage.text("Username and password does not match! Please try again!")
            }

        } else {
            alertMessage.text('Cannot login in Private mode!')
        }
    })

    //======= trending ========//
    let trend = ["Reactions", "Stickers", "Emotions", "Dogs", "Entertainment", "Holidays"];
    let limit = 10;
    let index = 0;
    let offset = 0;
    let times = 0;
    let userInput;
    let favIconUrl = "images/fav-active.svg"
    let notFavUrl = "images/fav.svg"
    let favStatus = "fav"
    let notFavStatus = "notFav"
    renderBtn()
    renderFavOnFav()
    homeTrending()

    function renderBtn() {
        for (let i = index; i < trend.length; i++) {
            let button = $('<button>')
            button.addClass('trend-btn')
            button.text(trend[i])
            $(".trend-btn-container").prepend(button)
        }
    }

    function renderShowMore() {
        $(".find").empty()
        let showMore = $("<p class='moreGif'>")
        showMore.text("Show More GIFs")
        $(".find").append(showMore)
        seeMore()
    }
    
    function renderFavOnFav() {
        $(".favorite-gif-holder1").empty()
        $(".favorite-gif-holder2").empty()
        if(localStorage) {
            let favImages = JSON.parse(localStorage.getItem("favImages"))
            if (!favImages) {
                return
            }
            let keys = Object.keys(favImages)
            for (let i = 0; i < keys.length; i++) {
                let newGifDiv = renderGif(favImages[keys[i]], removeFromFav, favIconUrl, favStatus)
                if (i % 2 !== 0) {
                    $(".favorite-gif-holder2").append(newGifDiv)
                } else {
                    $(".favorite-gif-holder1").append(newGifDiv)
                }
            }    
        } else {
            alert('Cannot Fav in Private mode!')
        }
    }

    function renderGif(el, favFunction, url, status) {
        let gifDiv = $("<div class='gif-container'>")
        let gifImg = $("<img src='" + el.images.fixed_height_still.url + "' class='gifImage'>")
        gifImg.attr("status", "still")
        gifImg.attr("still-data", el.images.fixed_height_still.url)
        gifImg.attr("animated-data", el.images.fixed_height.url)
        let favDiv = $("<div class='addToFav'>")
        let favImgIcon = $("<img class='favIcon' src='" + url +"'>")
        favImgIcon.attr("status", status)
        favImgIcon.on('click', function() {
            favFunction(el)
        })

        favDiv.append(favImgIcon)
        gifDiv.append(gifImg).append(favDiv)

        return gifDiv
    }

    function changeStatus() {
        $(".gifImage").on("click", function () {
            if ($(this).attr("status") === "still") {
                $(this).attr("status", "animated");
                $(this).attr("src", $(this).attr("animated-data"));
            } else {
                $(this).attr("status", "still");
                $(this).attr("src", $(this).attr("still-data"));
            }
        })
    }

    function homeTrending() {

        let queryURL = "http://api.giphy.com/v1/gifs/trending?api_key=QnIjlHb0pE8FczDRCsZKc274TX74Vf74&limit=10"

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            let result = response.data
            for (let i = 0; i < result.length; i++) {
                let gifDiv = renderGifDiv(result[i])

                if (i % 2 !== 0) {
                    $(".gif-holder2").append(gifDiv)
                    
                } else {
                    $(".gif-holder1").append(gifDiv)
                }  
            }
            changeStatus()
            changeIconStatus()
        })
    }

    function renderGifDiv(image) {
        let gifDiv = renderGif(image, addToFav, notFavUrl, notFavStatus)
        if(localStorage) {
            let favImages = JSON.parse(localStorage.getItem("favImages"))
            if (favImages) {
                let keys = Object.keys(favImages)
                if (keys.includes(image.id)) {
                    gifDiv = renderGif(image, removeFromFav, favIconUrl, favStatus)
                }
            }
        }
        return gifDiv
    }

    function addToFav(el) {
        if(localStorage) {
            let favImages = JSON.parse(localStorage.getItem("favImages"))
            if (!favImages) {
                favImages = {}
            }
            favImages[el.id] = el
            localStorage.setItem('favImages', JSON.stringify(favImages))
            renderFavOnFav()
        } else {
            alert('Cannot Fav in Private mode!')
        }
    }

    function removeFromFav(el) {
        if(localStorage) {
            let favImages = JSON.parse(localStorage.getItem("favImages"))
            delete favImages[el.id]
            localStorage.setItem('favImages', JSON.stringify(favImages))
            renderFavOnFav()
        } else {
            alert('Cannot Fav in Private mode!')
        }
    }

    function pushInput(input) {
        if (!trend.includes(input)) {
            trend.push(input)
            $(".trend-btn-container").empty()
            renderBtn()
            $("#search-bar").val("")
        }
    }

    function searchGif(btn, val) {
        btn.on('click', function () {
            index++
            userInput = val.val().trim()
            $(".input").text(userInput)
            $(".discover-gif-holder1").empty()
            $(".discover-gif-holder2").empty()
            pushInput(userInput)
            getAPI(userInput)
            renderShowMore()
        })
    }

    let homeSearch = $(".search-icon")
    let discoverSearch = $(".discover-search-icon")
    let homeInput = $("#search-bar")
    let discoverInput = $("#discover-search-bar")


    searchGif(homeSearch, homeInput)
    searchGif(discoverSearch, discoverInput)

    function getAPI(selectedGame) {
        offset += 10 * times
        let queryURL = "https://api.giphy.com/v1/gifs/search?api_key=QnIjlHb0pE8FczDRCsZKc274TX74Vf74&q=" + selectedGame + "&limit=" + limit + "&offset=" + offset

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            let result = response.data
            for (let i = 0; i < result.length; i++) {
                let gifDiv = renderGifDiv(result[i])
                if (i % 2 !== 0) {
                    $(".discover-gif-holder2").append(gifDiv)
                } else {
                    
                    $(".discover-gif-holder1").append(gifDiv)
                }
            }
            changeStatus()
            changeIconStatus()

        })
    }

    function seeMore() {
        $(".moreGif").on("click", function () {
        times++
        getAPI(userInput)
    })
    }
    
    function changeIconStatus() {
        $(".favIcon").on("click", function () {
            if ($(this).attr("status") === "notFav") {
                $(this).attr("status", "fav");
                $(this).attr("src", "images/fav-active.svg");
            } else {
                $(this).attr("status", "notFav");
                $(this).attr("src", "images/fav.svg");
            }
        })
    }

    function user() {
        $(".username").text(loginUser)
    }




})(jQuery);