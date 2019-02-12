$(document).ready(function () {

    // setTimeout(function () {

    //     $('.owl-carousel').owlCarousel({
    //         loop: true,
    //         margin: 10,
    //         responsiveClass: true,
    //         nav: true,
    //         navText: [
    //             "<i class='fa fa-chevron-left'></i>",
    //             "<i class='fa fa-chevron-right'></i>"
    //         ],

    //         responsive: {
    //             0: {
    //                 items: 2,
    //                 nav: true,
    //                 loop: false
    //             },
    //             600: {
    //                 items: 3,
    //                 nav: false,
    //                 loop: false
    //             },
    //             1000: {
    //                 items: 4,
    //                 nav: true,
    //                 loop: false,
    //                 margin: 20
    //             }
    //         }
    //     });
    // }, 5000);

    $('.item a').click(function () {
        var activeLink = $(this).data('target');
        var targetTab = $('.tab.' + activeLink);


        targetTab.siblings().removeClass('active');
        targetTab.addClass('active');
        //activeLink.removeClass('bg_color');
        //alert($(this).data('target'));
    });

    /*** add class in slider for background***/

    $('.item').click(function () {

        $('.item').removeClass('bg_gray1');
        $(this).addClass('bg_gray1');
    });


    /***mobile menu toggle menu***/
    jQuery(" .navbar-toggle").click(function () {
        jQuery(".navigation").slideToggle().toggleClass("active");
    });


})

/**** js for tag input****/


$(function () { // DOM ready

    // ::: TAGS BOX

    $("#tags input").on({
        focusout: function () {
            var txt = this.value.replace(/[^a-z0-9\+\-\.\#]/ig, ''); // allowed characters
            if (txt) $("<span/>", {text: txt.toLowerCase(), insertBefore: this});
            this.value = "";
            var spancount = $('#tags > span').length;
            $('.selected_user_text').find('p span').text(spancount);
        },
        keyup: function (ev) {
            // if: comma|enter (delimit more keyCodes with | pipe)
            // if(/(188|13)/.test(ev.which)) $(this).focusout();


        }

    });


    $('#tags').on('click', 'span', function () {
        //$(this).text().remove();
        if (confirm("Remove " + $(this).text() + "?")) $(this).remove();
        var spancount = $('#tags > span').length--;
        $('.selected_user_text').find('p span').text(spancount);
    });

    $('.clear_list').click(function () {
        $('#tags span').remove();
        confirm('Remove all user');
    });


});


/**** js for active class****/
$(document).ready(function () {

    $('nav a').each(function () {
        //$(function() {
        if ((location.pathname.split("/")[2]) !== "") {
            $('nav a[href^="' + location.pathname.split("/")[2] + '"]').addClass('active');
        }
    });
});

/****multiple selection droupdown*********/

$(".dropdown dt a").on('click', function () {
    $(".dropdown dd ul").slideToggle('fast');

    //$(".dropdown dt a span").addClass('active_droup');


});

$(".dropdown dd ul li a").on('click', function () {
    $(".dropdown dd ul").hide();


});

function getSelectedValue(id) {
    return $("#" + id).find("dt a span.value").html();
}

$(document).bind('click', function (e) {
    var $clicked = $(e.target);
    if (!$clicked.parents().hasClass("dropdown")) $(".dropdown dd ul").hide();
});

$('.mutliSelect input[type="checkbox"]').on('click', function () {

    var title = $(this).closest('.mutliSelect').find('input[type="checkbox"]').val(),
        title = $(this).val() + ",";

    if ($(this).is(':checked')) {
        var html = '<span title="' + title + '">' + title + '</span>';
        $('.multiSel').append(html);
        $(".hida").hide();
    } else {
        $('span[title="' + title + '"]').remove();
        var ret = $(".hida");
        $('.dropdown dt a').append(ret);

    }
});


/****ja for clear serchbox***/

$('.survey_content_right span.fa.fa-close').click(function () {
    //  alert('test')
    $('input#search_value').val('');
});


$(document).ready(function () {
    /***edit and modification button**/

    $('#edit_profile').click(function () {
        $('#form_profile .form_content').show();
        $('#form_profile .table_content').hide();
    });
    $('#cancel_edit_profile').click(function () {
        $('#form_profile .form_content').hide();
        $('#form_profile .table_content').show();
    });

    $('#editPassword').click(function () {
        $('.content_new_passwod').show();
        $('.content_old_passwod').hide();
    });

    $('#cancel_edit_password').click(function () {
        $('.content_new_passwod').hide();
        $('.content_old_passwod').show();
    });

});

/*********droup doen country********/
$("ul.country").on("click", ".init", function () {
    $(this).closest("ul").children('li:not(.init)').toggle();
});

var allOptions = $("ul.country").children('li:not(.init)');
$("ul.country").on("click", "li:not(.init)", function () {
    allOptions.removeClass('selected');
    $(this).addClass('selected');
    $("ul.country").children('.init').html($(this).html());
    allOptions.toggle();
});
