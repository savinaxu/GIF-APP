(function ($) {
    "use strict";

    //======= PRELOADER ========//
    $(window).on('load', function() {
		$('#preloader').delay(800).fadeOut('slow');
        $('#onboard-page').delay(550).fadeIn('slow').css({
            'overflow': 'visible'
        });
    });

    //======= Sign Up ========//
    $('#signup-submit').on('click', function() {
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
        } else {
            alert('Cannot sign up in Private mode!')
        }
    })

    //======= login ========//
    // $("#login-submit").on('click', function() {
    //     event.preventDefault()
    //     let name = $("#login-username").val()
    //     let password = $("#login-userpass").val()
    //     let alretMessage = $(".alert")

    //     if(localStorage) {
    //         let userData = JSON.parse(localStorage.getItem("userKey"))
    //         if (userData[name]) {
    //             if (userData[name][userName] !== name || userData[name][userPass] !== password) {
    //                 alretMessage.text("Username and password does not match! Please try again!")
    //             } else {
    //                 window.location.href = "#login-page"
    //             }
    //         }
    //     }
    // })

     //======= trending ========//
    let trend = ["Reactions", "Stickers", "Emotions", "Dogs", "Entertainment", "Holidays"];
    let limit = 10;
    let rating = "PG";
    let index = 0;
    let offset = 0;
    let times = 0;
    let currentData;
    renderBtn()

    function renderBtn() {
        for (let i = index; i < trend.length; i++) {
            let button = $('<button>')
            button.addClass('trend-btn')
            button.text(trend[i])
            $(".trend-btn-container").append(button)
        }
        // addClickHandler()
    }

    function pushInput(input) {
        if (!trend.includes(input)) {
            trend.push(input)
            $(".trend-btn-container").empty()
            renderBtn()
            $("#search-bar").val("")
        }
    }

    $(".search-btn").on('click', function() {
        event.preventDefault()
        index++
        let userInput = $("#search-bar").val().trim()
        pushInput(userInput)
    })

    // function addClickHandler() {
    //     $(".gameBtn").on("click",function() {
    //         $("#populates").empty()
    //         $(".moreGif").empty()
    //         limit = 10
    //         times = 0
    //         let data = $(this).text()
    //         currentData = $(this).text()
    //         getAPI(data)
    //         showMoreBtn()
    //         showMoreGifs()
    //     })
    // }



})(jQuery);