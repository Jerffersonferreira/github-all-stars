(function() {
    'use strict';

    // Application helpers
    var helpers = {
        countObjectProperties: function( obj ) {
            var count = 0;
            for ( var property in obj ) {
                if ( Object.prototype.hasOwnProperty.call( obj, property ) ) {
                    count++;
                }
            }
            return count;
        },
        removeDuplicateObj: function( arrArg ) {
            return arrArg.filter( function( elem, pos,arr ) {
                return arr.indexOf( elem ) == pos;
            });
        },
        filtered: function( obj, filters ) {
            // console.log(obj);
            var teste;
            var count = 0;
            var tempArray = [];
            var arrayLenght = filters.length;
            var teste = obj.forEach( function(obj) {
                for ( var i = 0; i < arrayLenght; i++ ) {
                    if ( obj.language == filters[i]) {
                        tempArray.push(obj);
                    }
                }
                count++;
            });
            return tempArray;
        },
    };

    // Cache DOM elements
    var DOMCache = {
        cards: {
            wrapper: $( '#appCardList' ),
            vcard: $( '[data-card-template]' ).html().trim(),
        },
        widgets: {
            widgetContainer: $('#limitInformer'),
            rateValue: $('<div id="rateValue" class="intval">'),
            rateText: $('<div id="rateText" class="subtitle">Limite da API</div>'),
        },
        selects: {
            orderBy: $('#filterSelect'),
            languageSelect: $('#languageSelect'),
            option: $('<option></option>'),
        }
    };

    // Cache Objects
    var cachedObj = {
        repositories: {},
        languagesObj: {},
        languagesArr: [],
    }

    // Api Handler
    var githubAPI = {
        username: 'suissa',
        targetAPI: 'starred',
        usersEndpoint: 'https://api.github.com/users/suissa/starred',
        rateLimit: 'https://api.github.com/rate_limit',
        getRateLimit: function() {
            $.get( this.rateLimit, function( data ) {
            })
            .done(function( data ) {
               render.limitInformer( data.rate );
            })
            .fail(function() {
            });
        },
        getStarredRepositories: function() {
            $.get( 'js/starred.json', function( data ) {
            })
            .done(function( data ) {
                cachedObj.repositories = data;
                render.repositoriesCards( data );
                render.languages( cachedObj.repositories );
            })
            .fail(function() {
            });
        }
    };

    // Render Components
    var render = {
        limitInformer: function( apiData ) {
            if ( apiData != null || apiData != undefinied ) {
                var apidata    = apiData;
                var remaining  = apiData.remaining;
                var limit      = apiData.limit;
                var percentage = parseFloat( remaining / limit * 100 ).toFixed(1);

                DOMCache.widgets.rateValue.text( remaining + ' / ' + limit) ;
                DOMCache.widgets.widgetContainer.html();
                DOMCache.widgets.widgetContainer.append( [ DOMCache.widgets.rateValue, DOMCache.widgets.rateText] );
                render.limitProgressBar( percentage );
            }
        },
        limitProgressBar: function( percentage ) {
            var percentage = percentage;
            var $progressContainer = $( "#limitProgressBar" );
            $progressContainer
            .css({ "width": percentage +"%" })
            .text(percentage + '%');
        },
        repositoriesCards: function( data ) {
            DOMCache.cards.wrapper.html('');
            var repositoriesData = data;
            var repositoriesCount = helpers.countObjectProperties( repositoriesData );

            if ( repositoriesCount != 0 ) {
                repositoriesData.map( function(obj) {
                    var $card = $(DOMCache.cards.vcard);
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
                    DOMCache.cards.wrapper.append($card);
                })
            }
        },
        languages: function( obj ) {
            if ( obj.language !== null ) {
                cachedObj.languagesObj = obj.forEach( function(obj) {
                    if ( obj.language !== null ) cachedObj.languagesArr.push(obj.language);
                });
                var filteredLanguages = helpers.removeDuplicateObj( cachedObj.languagesArr).sort();
                filteredLanguages.map( function( obj ) {
                    DOMCache.selects.languageSelect.append( '<option value="'+ obj +'">' + obj + '</option>' );
                    $( DOMCache.selects.languageSelect ).selectpicker( 'refresh' );
                });
            }
        },
    };

    // OrderBy - using COC
    var orderBy = {
        ascending: function( obj ) {
            obj.sort( function( a, b ) {
                return 2 * ( a.name.toLowerCase() > b.name.toLowerCase() ) - 1;
            });
            return render.repositoriesCards(obj);
        },
        openIssues: function( obj ) {
            obj.sort( function( a, b ) {
                return b.open_issues - a.open_issues;
            });
            return render.repositoriesCards(obj);
        },
        stargazers: function( obj ) {
            obj.sort( function( a, b ) {
                return b.stargazers_count - a.stargazers_count;
            });
            return render.repositoriesCards(obj);
        },
        watchers: function( obj ) {
            obj.sort( function( a, b ) {
                return b.watchers - a.watchers;
            });
            return render.repositoriesCards(obj);
        },
    };

    // Event Handling
    DOMCache.selects.orderBy.on( 'change', function() {
        var selectedValue = $(this).find("option:selected").val();
        orderBy[selectedValue](cachedObj.repositories);
    });
    DOMCache.selects.languageSelect.on( 'change', function() {
        var filteredValues = $(this).val();
        var objectFilter = helpers.filtered( cachedObj.repositories, filteredValues );
        render.repositoriesCards(objectFilter);
    });

    $(document).ready(function() {
        githubAPI.getRateLimit();
        githubAPI.getStarredRepositories();
        setTimeout( function() {
            // console.log(render.languages(cachedObj.repositories));
            // console.log(helpers.removeDuplicateObj(cachedObj.languagesObj));
        }, 1000 );
    });

})();
