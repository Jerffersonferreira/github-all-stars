(function() {
    'use strict';
    var cardTemplate = $('[data-card-template]').html().trim();

    function countObjectProperties( obj ) {
        var count = 0;
        for ( var property in obj ) {
            if ( Object.prototype.hasOwnProperty.call( obj, property ) ) {
                count++;
            }
        }
        return count;
    }

    var githubAPI = {
        usersEndpoint: 'https://api.github.com/users/suissa/starred',
        rateLimit: 'https://api.github.com/rate_limit',
        getRateLimit: function() {
            $.get( this.rateLimit, function( data ) {
            })
            .done(function(data) {
               render.limitInformer(data.rate);
            })
            .fail(function() {
            });
        },
        getStarredRepositories: function() {
            $.get( 'js/starred.json', function( data ) {
            })
            .done(function(data) {
                console.log(data);
                render.repositoriesCards(data);
            })
            .fail(function() {
            });
        }
    }

    var render = {
        limitInformer: function( apiData ) {
            var apidata = apiData;
            var $widgetContainer = $("#limitInformer");
            var $rateValue = $('<div id="rateValue" class="intval">');
            var $rateText = $('<div id="rateText" class="subtitle">Limite da API</div>');

            var remaining = apiData.remaining;
            var limit = apiData.limit;
            var percentage = parseFloat( remaining / limit * 100 );

            $rateValue.text( remaining + ' / ' + limit) ;

            $widgetContainer.html();
            $widgetContainer.append( [$rateValue,$rateText] );

            render.limitProgressBar( percentage );
        },

        limitProgressBar: function( percentage ) {
            var percentage = percentage.toFixed(2);
            var $progressContainer = $( "#limitProgressBar" );
            $progressContainer
            .css({ "width": percentage +"%" })
            .text(percentage + '%');
        },

        repositoriesCards: function( data ) {
            var repositoriesData = data;
            var itensCount = countObjectProperties( repositoriesData );
            var $wrapper = $( '#appCardList' );

            repositoriesData.map( function(obj) {
                var $card = $(cardTemplate);

                var created = moment(obj.created_at).format('DD\/MM\/YYYY');
                var pushed = moment(obj.pushed_at).format('DD\/MM\/YYYY');
                var publicRepo = "Público";
                var sizeMB = parseFloat( obj.size / 1024 ).toFixed(2);
                var language = obj.language;
                var languageClass;
                if ( language != null ) var languageClass = language.toLowerCase();
                if ( obj.private ) var publicRepo = "Privado";

                $card.find('[data-card-name]').html(obj.name);
                $card.find('[data-card-name]').attr('href', obj.html_url);
                $card.find('[data-card-user]').html('by ' + obj.owner.login);
                $card.find('[data-card-image]').attr('src', obj.owner.avatar_url);
                $card.find('[data-card-stars]').html(obj.stargazers_count);
                $card.find('[data-card-issues]').html(obj.open_issues);
                $card.find('[data-card-watchers]').html(obj.watchers_count);
                $card.find('[data-card-created]').html(created);
                $card.find('[data-card-pushed]').html(pushed);
                $card.find('[data-card-public]').html(publicRepo);
                $card.find('[data-card-size]').html(sizeMB + ' MB');
                $card.find('[data-card-language]').html(language);
                if ( languageClass != null ) {
                    $card.find('[data-card-language]').addClass(languageClass);
                }

                $wrapper.append($card);
            })
        }

    }

    $(document).ready(function() {
        githubAPI.getRateLimit();
        githubAPI.getStarredRepositories();
        // render.limitInformer();
    });

})();
