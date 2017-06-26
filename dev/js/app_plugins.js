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
    bootstrap_tooltip: function() {
        $("[data-toggle='tooltip']").tooltip();
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
        app_plugins.bootstrap_tooltip();
        app_plugins.statusbar.init();
    }
};

$(function(){
    app_plugins.loaded();
});
