(function() {
    'use strict';

    // Cache DOM elements
    var DOMCache = {
        cards: {
            wrapper: $('#appCardList'),
            vcard: $('[data-card-template]').html().trim(),
        },
        profile: {
            wrapper: $('#userProfileWrapper'),
            info: $('[data-user-template]').html().trim(),
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
        },
        loadMore: {
            loadMoreBtn: $('<button type="button" class="btn btn-large btn-info btn-rounded">Carregar Mais</button>'),
            loadMoreWrapper: $('#loadMoreWrapper'),
        },
        alerts: {
            warning: $('[data-alert-warning-template]').html(),
            danger: $('[data-alert-danger-template]').html(),
            userDanger: $('[data-user-danger-template]').html(),
            noLoadMore: $('<h5 class="text-center">Não há mais repositórios a carregar</h5>'),
        },
        searchBar: $('#searchBar'),
        repoCounter: $('#repoCounter'),
    };

    // Cache Objects
    var cachedObj = {
        repositories: {},
        languagesObj: {},
        languagesArr: [],
    };

    // Application helpers
    var helpers = {
        countObjectProperties: function( obj ) {
            var count = 0;
            for ( var property in obj ) {
                if ( Object.prototype.hasOwnProperty.call(obj, property) ) {
                    count++;
                }
            }
            return count;
        },
        removeDuplicateObj: function( arrLanguages ) {
            return arrLanguages.filter(function( elem, pos, arr ) {
                return arr.indexOf( elem ) == pos;
            });
        },
        filtered: function( obj, filters ) {
            if ( obj != null ) {
                var count = 0;
                var tempArray = [];
                var arrayLenght = filters.length;
                obj.forEach( function(obj) {
                    for ( var i = 0; i < arrayLenght; i++ ) {
                        if ( obj.language == filters[i]) {
                            tempArray.push(obj);
                        }
                    }
                    count++;
                });
                return tempArray;
            }
        },
    };

    // Api Handler
    var githubAPI = {
        username: 'suissa',
        targetAPI: 'starred',
        perPage: 30,
        currentPage: 1,
        githubUrl:'https://github.com/',
        usersEndpoint: 'https://api.github.com/users/',
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
        getStarredRepositories: function( usersEndpoint, username, currentPage ) {
            render.placeholder('render');
            $.ajax({
                url: githubAPI.usersEndpoint + githubAPI.username +'/starred?page='+ githubAPI.currentPage,
                type: 'GET',
                success: function( data ) {
                    render.placeholder('clear');
                    githubAPI.getRateLimit();
                    githubAPI.getProfileInfo();

                    if ( data.length > 0 ) {
                        cachedObj.repositories = data;

                        if ( githubAPI.currentPage > 1 ) {
                            render.repositoriesCards( data );
                        } else {
                            render.repositoriesCards( data, true );
                        }

                        render.languages( cachedObj.repositories );

                        if ( data.length <= githubAPI.perPage ) {
                            render.loadMore( true );
                        } else {
                            render.loadMore( false );
                        }
                    } else {
                        render.loadMore( false );
                    }
                },
                error: function(data) {
                    githubAPI.getRateLimit();

                    if ( data.status == 403 ) {
                        app_plugins.statusbar.open('#danger');
                    }

                    if ( data.status == 404 ) {
                        render.placeholder('clear');
                        app_plugins.statusbar.open('#userDanger');
                    }
                }
            });
        },
        getProfileInfo: function( usersEndpoint, username, currentPage ) {
            $.ajax({
                url: githubAPI.usersEndpoint + githubAPI.username,
                type: 'GET',
                success: function( data ) {
                    githubAPI.getRateLimit();
                    render.userProfile(data);
                },
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

            if ( percentage >= 50 ) $progressContainer.addClass('progress-bar-success');
            if ( percentage < 50 ) $progressContainer.removeClass('progress-bar-success').addClass('progress-bar-warning');
            if ( percentage < 25 ) {
                $progressContainer.removeClass('progress-bar-warning').addClass('progress-bar-danger');
                app_plugins.statusbar.open('#warning');
            }
            if ( percentage == 0 ) {
                app_plugins.statusbar.open('#danger');
            }
        },
        repositoriesCards: function( data, clear ) {
            if ( clear == true ) DOMCache.cards.wrapper.html('');

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
                    $card.find('[data-card-repo-link]').attr('href', githubAPI.githubUrl + obj.owner.login + '?tab=repositories');
                    $card.find('[data-card-profile-link]').attr('href', githubAPI.githubUrl + obj.owner.login);
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
                    render.repositoriesValue();
                })
            }
        },
        userProfile: function( obj ) {
            DOMCache.profile.wrapper.html('');
            var $userProfile = $(DOMCache.profile.info);
            $userProfile.find('[data-user-name]').html(obj.name);
            $userProfile.find('[data-company-name]').html(obj.company);
            $userProfile.find('[data-user-image]').attr('src', obj.avatar_url);
            $userProfile.find('[data-user-profile-link]').attr('href', githubAPI.githubUrl + obj.login);
            $userProfile.find('[data-user-repos-link]').attr('href', githubAPI.githubUrl + obj.login + '?tab=repositories');
            $userProfile.find('[data-user-followrs-link]').attr('href', githubAPI.githubUrl + obj.login + '?tab=followers');

            DOMCache.profile.wrapper.append($userProfile);
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
        loadMore: function( boolean ) {
            if ( boolean == true ) {
                DOMCache.loadMore.loadMoreBtn.show();
                DOMCache.alerts.noLoadMore.hide();
                DOMCache.loadMore.loadMoreWrapper.append( DOMCache.loadMore.loadMoreBtn );
            }
            if ( boolean == false ) {
                console.log('carregou errado');
                DOMCache.loadMore.loadMoreBtn.hide();
                DOMCache.alerts.noLoadMore.show();
                DOMCache.loadMore.loadMoreWrapper.append( DOMCache.alerts.noLoadMore );
            }
        },
        placeholder: function( value ) {
            if ( value == "render" ) {
                for ( var i = 0; i < 9; i++ ) {
                    var $loadingCard = $('<div class="col-md-4 item featured result-item"><div class="timeline-item"><div class="animated-background"><div class="background-masker content-top"></div>');
                    DOMCache.cards.wrapper.append( $loadingCard );
                }
            }
            else if ( value == "clear" ) {
                DOMCache.cards.wrapper.find('.result-item').remove();
            }
            else {
                DOMCache.cards.wrapper.find('.result-item').remove();
            }
        },
        repositoriesValue: function() {
            var DOMLenght = ($('[data-card]').length) -1;
            if ( DOMLenght == 0 ) return;
            if ( DOMLenght == 1 ) DOMCache.repoCounter.text('Exibindo ' + DOMLenght + ' repositório.');
            if ( DOMLenght > 1 ) DOMCache.repoCounter.text('Exibindo ' + DOMLenght + ' repositórios');
        }
    };

    // OrderBy - using COC
    var orderBy = {
        ascending: function( obj ) {
            obj.sort( function( a, b ) {
                return 2 * ( a.name.toLowerCase() > b.name.toLowerCase() ) - 1;
            });
            return render.repositoriesCards(obj, true);
        },
        openIssues: function( obj ) {
            obj.sort( function( a, b ) {
                return b.open_issues - a.open_issues;
            });
            return render.repositoriesCards(obj, true);
        },
        stargazers: function( obj ) {
            obj.sort( function( a, b ) {
                return b.stargazers_count - a.stargazers_count;
            });
            return render.repositoriesCards(obj, true);
        },
        watchers: function( obj ) {
            obj.sort( function( a, b ) {
                return b.watchers - a.watchers;
            });
            return render.repositoriesCards(obj, true);
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
        render.repositoriesCards(objectFilter, true);
    });
    DOMCache.loadMore.loadMoreBtn.on( 'click', function(e) {
        githubAPI.currentPage++;
        githubAPI.getStarredRepositories();
    });
    DOMCache.searchBar.bind('keypress', function(e) {
        if ( e.keyCode == 13 ) {
            var username = $(this).val();
            githubAPI.username = username;
            githubAPI.currentPage = 1;
            githubAPI.getStarredRepositories();
        }
    });
})();
