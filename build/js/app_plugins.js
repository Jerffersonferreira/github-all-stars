"use strict";

var app_plugins = {
    bootstrap_select: function() {
        console.log($(".bs-select"));
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
                app.statusbar.open($(this).attr('href'));
                return false;
            });
        },
        open: function(id) {
            $(".app-statusbar").hide();
            if($(id).is(":hidden")) $(id).fadeIn();
        }
    },
    search: function() {
        $(".app-header-search").on("click",function(){
            $(".app-header-search > input").focus();
        });
    },
    loaded: function() {
        app_plugins.bootstrap_select();
        app_plugins.bootstrap_tooltip();
        app_plugins.statusbar.init();
        app_plugins.search();
    }
};

$(function(){
    app_plugins.loaded();
});
