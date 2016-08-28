/**
 * Facebook Page Album Integration plugin (fbpai Plugin)
 * @author AR Softs Solutions - http://www.arsofts.com/
 * @revision 1.0.0
 * @date August 28, 2016
 * @copyright (c) 2016 AR Softs Solutions (www.arsofts.com)
 * @license Creative Commons Attribution-ShareAlike 2.5 India (CC BY-SA 2.5 IN) - https://creativecommons.org/licenses/by-sa/2.5/in/
 * @Visit http://fbpai.arsofts.com/ for more informations, discussions etc about this library
 */

jQuery.fn.fbpai = function(options) {

    var defaults = {
        app_id : '',
        app_secret : '',
        page_id : '',
        album_fields : 'id,name,description,link,cover_photo,count',
        photo_fields : 'source,images,name,description',
        removed_albums: ['Timeline Photos', 'Mobile Uploads', 'Cover Photos', 'Profile Pictures'],
        thumb_size: 160,
        photo_size: "auto",
        album_per_page: 50,
        photo_per_page: 100,
        loading_img: "",
        back_link: 'http://'+window.location.hostname+window.location.pathname,
        labels: {
            back_button: "Back to Albums",
            no_albums: "No albums available",
            no_photos: "No photos available",
            page: "Page",
            prev: "Previous",
            next: "Next"
        },
        fancybox_config : {
            prevEffect : 'fade',
            nextEffect : 'fade',
            openEffect  : 'elastic',
            closeEffect : 'elastic',
            closeBtn  : true,
            arrows    : true,
            nextClick : true,
            helpers : {
                thumbs : {
                    width  : 50,
                    height : 50
                }
            }
        }
    };
    var settings = $.extend( {}, defaults, options);
    if(settings.app_id=="") {
        alert('App Id Required !');
    } else if(settings.app_secret=="") {
        alert('App Secret Required !');
    } else if(settings.page_id=="") {
        alert('FB Page Id Required !');        
    } else {
        var my_gallery = $(this);
        my_gallery.addClass('fbai_container');
        my_gallery.append('<div class="loader"></div>');
        var aid = $.urlParam('album_id');
        if(aid==null)
        {
            // album listing
            var url = "http://api.arsofts.com/fba";
            var req = {
                app_id      : settings.app_id,
                app_secret  : settings.app_secret,
                page_id     : settings.page_id
            };
            $.postJSON(url, req, function(rsp) {
                var items = [];
                $.each(rsp['data'], function( key, val ) {
                    my_gallery.append('<div class="fbai_album">'+
                        '<a title="'+val['count']+' '+val['count_text']+'" href="?album_id='+val['id']+'">'+
                            '<div class="photo" style="background: url('+val['cover_photo']+');">'+
                            '</div>'+
                        '</a>'+
                        '<h3><a href="?album_id='+val['id']+'">'+val['name']+' ('+val['count']+')</a></h3>'+
                    '</div>');
                    my_gallery.find('.loader').remove();
                });
            });
        }
        else
        {
            // photo listing
            var url = "http://api.arsofts.com/fba";
            var req = {
                app_id      : settings.app_id,
                app_secret  : settings.app_secret,
                page_id     : settings.page_id,
                album_id    : aid
            };
            $.postJSON(url, req, function(rsp) {
                my_gallery.append('<div class="fbai_back_btn"><a href="'+settings.back_link+'"><button type="button" class="btn btn-primary">'+settings.labels.back_button+'</button></a></div><br/>');
                var items = [];
                $.each(rsp['data'], function( key, val ) {
                    my_gallery.append('<div class="fbai_photo">'+
                        '<a class="fbai_fancybox" data-fancybox-group="thumb" href="'+val['source']+'"><img src="'+val['thumb']+'" /></a>'+
                    '</div>');
                    my_gallery.find('.loader').remove();
                });
            });
        }
        $('.fbai_fancybox').fancybox(settings.fancybox_config);
    }
}

$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if(results==null) { return null; }
    else { return results[1] || 0; }
}

$.postJSON = function(url, req, response_callback) {
    $.post(url, req, function(response) {
        if(typeof response_callback == 'function') {
            response_callback.call(this, response);
        }
    });
}
