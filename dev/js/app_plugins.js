"use strict";

var app_plugins = {
    bootstrap_select: function(){
        if($(".bs-select").length > 0)
           $(".bs-select").selectpicker({iconBase: '', tickIcon: 'fa fa-check'});
    },
    bootstrap_tooltip: function(){
        $("[data-toggle='tooltip']").tooltip();
    },
    loaded: function(){
        app_plugins.bootstrap_select();
        app_plugins.bootstrap_tooltip();
    }
};

$(function(){
    app_plugins.loaded();
});

$(document).ready(function(){
    app.loaded();
});
