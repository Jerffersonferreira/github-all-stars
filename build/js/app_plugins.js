"use strict";

var app_plugins = {
    bootstrap_select: function() {
        if ( $(".bs-select").length > 0 )
            $(".bs-select").selectpicker({
                language: 'pt_BR',
                iconBase: '',
                tickIcon: 'fa fa-check',
            });
    },
    bootstrap_popover: function(){
        $("[data-toggle='popover']").popover();

        $(".popover-hover").on("mouseenter",function(){
            $(this).popover('show');
        }).on("mouseleave",function(){
            $(this).popover('hide');
        });

        $(".modal").on("show.bs.modal", function () {
            $("[data-toggle='popover']").popover("hide");
        });
    },
    statusbar: {
        init: function() {
            $(".app-statusbar-open, .app-statusbar-close").on("click",function () {
                app_plugins.statusbar.open($(this).attr('href'));
                return false;
            });
        },
        open: function(id) {
            $(".app-statusbar").hide();
            if($(id).is(":hidden")) $(id).fadeIn();
        }
    },
    loaded: function() {
        app_plugins.bootstrap_select();
        app_plugins.bootstrap_popover();
        app_plugins.statusbar.init();
    }
};

$(function(){
    app_plugins.loaded();
});
