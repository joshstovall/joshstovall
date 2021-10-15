window.mr = window.mr || {};
mr = (function (mr, $, window, document) {
    "use strict";
    mr = mr || {};
    var components = { documentReady: [], documentReadyDeferred: [], windowLoad: [], windowLoadDeferred: [] };
    mr.status = { documentReadyRan: false, windowLoadPending: false };
    $(document).ready(documentReady);
    $(window).on("load", windowLoad);
    function documentReady(context) {
        context = typeof context === typeof undefined ? $ : context;
        components.documentReady.concat(components.documentReadyDeferred).forEach(function (component) { component(context); });
        mr.status.documentReadyRan = true;
        if (mr.status.windowLoadPending) { windowLoad(mr.setContext()); }
    }
    function windowLoad(context) {
        if (mr.status.documentReadyRan) {
            mr.status.windowLoadPending = false;
            context = typeof context === "object" ? $ : context;
            components.windowLoad.concat(components.windowLoadDeferred).forEach(function (component) { component(context); });
        } 
        else { mr.status.windowLoadPending = true; }
    }
    mr.setContext = function (contextSelector) {
        var context = $;
        if (typeof contextSelector !== typeof undefined) {
            return function (selector) {
                return $(contextSelector).find(selector);
            };
        }
        return context;
    };
    mr.components = components;
    mr.documentReady = documentReady;
    mr.windowLoad = windowLoad;
    return mr;
}(window.mr, jQuery, window, document));

//////////////// Utility Functions
mr = (function (mr, $, window, document) {
    "use strict";
    mr.util = {};
    mr.util.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    mr.util.documentReady = function ($) {
        var today = new Date();
        var year = today.getFullYear();
        $('.update-year').text(year);
    };
    mr.util.windowLoad = function ($) {
        $('[data-delay-src]').each(function () {
            var $el = $(this);
            $el.attr('src', $el.attr('data-delay-src'));
            $el.removeAttr('data-delay-src');
        });
    };
    mr.util.getURLParameter = function (name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [undefined, ""])[1].replace(/\+/g, '%20')) || null;
    };
    mr.util.capitaliseFirstLetter = function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
    mr.util.slugify = function (text, spacesOnly) {
        if (typeof spacesOnly !== typeof undefined) {
            return text.replace(/ +/g, '');
        } else {
            return text
                .toLowerCase()
                .replace(/[\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\]\[\}\{\'\"\;\\\:\?\/\>\<\.\,]+/g, '')
                .replace(/ +/g, '-');
        }
    };
    mr.util.sortChildrenByText = function (parentElement, reverse) {
        var $parentElement = $(parentElement);
        var items = $parentElement.children().get();
        var order = -1;
        var order2 = 1;
        if (typeof reverse !== typeof undefined) { order = 1; order2 = -1; }
        items.sort(function (a, b) {
            var keyA = $(a).text();
            var keyB = $(b).text();
            if (keyA < keyB) return order;
            if (keyA > keyB) return order2;
            return 0;
        });
        // Append back into place
        $parentElement.empty();
        $(items).each(function (i, itm) { $parentElement.append(itm); });
    };

    // Set data-src attribute of element from src to be restored later
    mr.util.idleSrc = function (context, selector) {
        selector = (typeof selector !== typeof undefined) ? selector : '';
        var elems = context.is(selector + '[src]') ? context : context.find(selector + '[src]');
        elems.each(function (index, elem) {
            elem = $(elem);
            var currentSrc = elem.attr('src'),
                dataSrc = elem.attr('data-src');
            // If there is no data-src, save current source to it
            if (typeof dataSrc === typeof undefined) { elem.attr('data-src', currentSrc); }
            // Clear the src attribute
            elem.attr('src', '');

        });
    };

    // Set src attribute of element from its data-src where it was temporarily stored earlier
    mr.util.activateIdleSrc = function (context, selector) {

        selector = (typeof selector !== typeof undefined) ? selector : '';
        var elems = context.is(selector + '[data-src]') ? context : context.find(selector + '[data-src]');

        elems.each(function (index, elem) {
            elem = $(elem);
            var dataSrc = elem.attr('data-src');

            // Write the 'src' attribute using the 'data-src' value
            elem.attr('src', dataSrc);
        });
    };

    mr.util.pauseVideo = function (context) {
        var elems = context.is('video') ? context : context.find('video');

        elems.each(function (index, video) {
            var playingVideo = $(video).get(0);
            playingVideo.pause();
        });
    };

    // Take a text value in either px (eg. 150px) or vh (eg. 65vh) and return a number in pixels.
    mr.util.parsePixels = function (text) {
        var windowHeight = $(window).height(), value;

        // Text text against regular expression for px value.
        if (/^[1-9]{1}[0-9]*[p][x]$/.test(text)) {
            return parseInt(text.replace('px', ''), 10);
        }
        // Otherwise it is vh value.
        else if (/^[1-9]{1}[0-9]*[v][h]$/.test(text)) {
            value = parseInt(text.replace('vh', ''), 10);
            // Return conversion to percentage of window height.
            return windowHeight * (value / 100);
        } else {
            // If it is not proper text, return -1 to indicate bad value.
            return -1;
        }
    };

    mr.util.removeHash = function () {
        // Removes hash from URL bar without reloading and without losing search query
        history.pushState("", document.title, window.location.pathname + window.location.search);
    }


    var path = document.URL//.substr(0,document.URL.lastIndexOf('/'))
    
    if (path.includes('writing') || path.includes('projects') || path.includes('code') || path.includes('music') || path.includes('resume')) {
        $("#start").load("/modules/header.html", function() {
            $('#openMenu').on('click', function () {
               $('#menu').show()
            });
            $('#closeMenu').on('click', function () {
                $('#menu').hide()
             });

    var path = document.URL//.substr(0,document.URL.lastIndexOf('/'))

    
    if ( path.includes('/resume')) { $('a[href*="/resume"]').css('font-weight','900') }
    if ( path.includes('/code')) { $('a[href*="/code"]').css('font-weight','900') }
    if ( path.includes('/writing')) { $('a[href*="/writing"]').css('font-weight','900') }
    if ( path.includes('/projects')) { $('a[href*="/projects"]').css('font-weight','900') }
    if ( path.includes('/music')) { $('a[href*="/music"]').css('font-weight','900') }

             $("body").append($('<div>').load('/modules/footer.html', function() {




// if mobile, open social links in corresponding apps
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	// facebook
	if( /Android/i.test(navigator.userAgent) ) {
		//$('.android').attr('href','fb://page/'+film.facebook)
	}
	if( /|iPhone|iPad|iPod/i.test(navigator.userAgent) ) {

        $( ".facebook" ).each(function( index ) {
            $(this).attr('href','fb://profile?id='+ $(this).attr('username'))
        });
        $( ".instagram" ).each(function( index ) {
            $(this).attr('href','instagram://user?username='+ $(this).attr('username'))
        });
        $( ".twitter" ).each(function( index ) {
            $(this).attr('href','twitter://user?screen_name='+ $(this).attr('username'))
        });
	}
} else {
	$('.facebook').attr('target','_blank')
	$('.twitter').attr('target','_blank')
	$('.instagram').attr('target','_blank')
	$('.linkedin').attr('target','_blank')
	$('.youtube').attr('target','_blank')
	$('.github').attr('target','_blank')
}
          


}))
            });
    } else {
        $("body").append($('<div>').load('/modules/footer.html', function() {


        }))
    }


 

    mr.components.documentReady.push(mr.util.documentReady);
    mr.components.windowLoad.push(mr.util.windowLoad);
    return mr;

}(mr, jQuery, window, document));

//////////////// Window Functions
mr = (function (mr, $, window, document) {
    "use strict";

    mr.window = {};
    mr.window.height = $(window).height();
    mr.window.width = $(window).width();

    $(window).on('resize', function () {
        mr.window.height = $(window).height();
        mr.window.width = $(window).width();
    });

    return mr;
}(mr, jQuery, window, document));


//////////////// Scroll Functions
mr = (function (mr, $, window, document) {
    "use strict";
    mr.scroll = {};
    var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    mr.scroll.listeners = [];
    mr.scroll.busy = false;
    mr.scroll.y = 0;
    mr.scroll.x = 0;

    var documentReady = function ($) {

        //////////////// Capture Scroll Event and fire scroll function
        jQuery(window).off('scroll.mr');
        jQuery(window).on('scroll.mr', function (evt) {
            if (mr.scroll.busy === false) {

                mr.scroll.busy = true;
                raf(function (evt) {
                    mr.scroll.update(evt);
                });

            }
            if (evt.stopPropagation) {
                evt.stopPropagation();
            }
        });

    };

    mr.scroll.update = function (event) {

        // Loop through all mr scroll listeners
        var parallax = typeof window.mr_parallax !== typeof undefined ? true : false;
        mr.scroll.y = (parallax ? mr_parallax.mr_getScrollPosition() : window.pageYOffset);
        mr.scroll.busy = false;
        if (parallax) {
            mr_parallax.mr_parallaxBackground();
        }


        if (mr.scroll.listeners.length > 0) {
            for (var i = 0, l = mr.scroll.listeners.length; i < l; i++) {
                mr.scroll.listeners[i](event);
            }
        }

    };

    mr.scroll.documentReady = documentReady;

    mr.components.documentReady.push(documentReady);

    return mr;

}(mr, jQuery, window, document));

//////////////// Scroll Class Modifier
mr = (function (mr, $, window, document) {
    "use strict";

    mr.scroll.classModifiers = {};
    // Globally accessible list of elements/rules
    mr.scroll.classModifiers.rules = [];

    mr.scroll.classModifiers.parseScrollRules = function (element) {
        var text = element.attr('data-scroll-class'),
            rules = text.split(";");

        rules.forEach(function (rule) {
            var ruleComponents, scrollPoint, ruleObject = {};
            ruleComponents = rule.replace(/\s/g, "").split(':');
            if (ruleComponents.length === 2) {
                scrollPoint = mr.util.parsePixels(ruleComponents[0]);
                if (scrollPoint > -1) {
                    ruleObject.scrollPoint = scrollPoint;
                    if (ruleComponents[1].length) {
                        var toggleClass = ruleComponents[1];
                        ruleObject.toggleClass = toggleClass;
                        // Set variable in object to indicate that element already has class applied
                        ruleObject.hasClass = element.hasClass(toggleClass);
                        ruleObject.element = element.get(0);
                        mr.scroll.classModifiers.rules.push(ruleObject);
                    } else {
                        // Error: toggleClass component does not exist.
                        //console.log('Error - toggle class not found.');
                        return false;
                    }
                } else {
                    // Error: scrollpoint component was malformed
                    //console.log('Error - Scrollpoint not found.');
                    return false;
                }
            }
        });

        if (mr.scroll.classModifiers.rules.length) { return true; } 
        else { return false; }
    };
    mr.scroll.classModifiers.update = function (event) {
        var currentScroll = mr.scroll.y,
            scrollRules = mr.scroll.classModifiers.rules,
            l = scrollRules.length,
            currentRule;
        // Given the current scrollPoint, check for necessary changes 
        while (l--) {
            currentRule = scrollRules[l];
            if (currentScroll > currentRule.scrollPoint && !currentRule.hasClass) {
                // Set local copy and glogal copy at the same time;
                currentRule.element.classList.add(currentRule.toggleClass);
                currentRule.hasClass = mr.scroll.classModifiers.rules[l].hasClass = true;
            }
            if (currentScroll < currentRule.scrollPoint && currentRule.hasClass) {
                // Set local copy and glogal copy at the same time;
                currentRule.element.classList.remove(currentRule.toggleClass);
                currentRule.hasClass = mr.scroll.classModifiers.rules[l].hasClass = false;
            }
        }
    };

    var fixedElementSizes = function () {
        $('.main-container [data-scroll-class*="pos-fixed"]').each(function () {
            var element = $(this);
            element.css('max-width', element.parent().outerWidth());
            element.parent().css('min-height', element.outerHeight());
        });
    };

    var documentReady = function ($) {
        // Collect info on all elements that require class modification at load time
        // Each element has data-scroll-class with a formatted value to represent class to add/remove at a particular scroll point.
        $('[data-scroll-class]').each(function () {
            var element = $(this);
            // Test the rules to be added to an array of rules.
            if (!mr.scroll.classModifiers.parseScrollRules(element)) {
                console.log('Error parsing scroll rules on: ' + element);
            }
        });
        // For 'position fixed' elements, give them a max-width for correct fixing behaviour
        fixedElementSizes();
        $(window).on('resize', fixedElementSizes);
        // If there are valid scroll rules add classModifiers update function to the scroll event processing queue.
        if (mr.scroll.classModifiers.rules.length) {
            mr.scroll.listeners.push(mr.scroll.classModifiers.update);
        }
    };
    mr.components.documentReady.push(documentReady);
    mr.scroll.classModifiers.documentReady = documentReady;
    return mr;
}(mr, jQuery, window, document));


//////////////// Accordions
mr = (function (mr, $, window, document) {
    "use strict";
    mr.accordions = mr.accordions || {};
    mr.accordions.documentReady = function ($) {
        $('.accordion__title').on('click', function () {
            mr.accordions.activatePanel($(this));
        });
        $('.accordion').each(function () {
            var accordion = $(this);
            var minHeight = accordion.outerHeight(true);
            accordion.css('min-height', minHeight);
        });
        if (window.location.hash !== '' && window.location.hash !== '#' && window.location.hash.match(/#\/.*/) === null) {
            if ($('.accordion > li > .accordion__title' + window.location.hash).length) {
                mr.accordions.activatePanelById(window.location.hash, true);
            }
        }
        jQuery(document).on('click', 'a[href^="#"]:not(a[href="#"])', function () {
            if ($('.accordion > li > .accordion__title' + $(this).attr('href')).length) {
                mr.accordions.activatePanelById($(this).attr('href'), true);
            }
        });
    };



    mr.accordions.activatePanel = function (panel, forceOpen) {
        var $panel = $(panel), accordion = $panel.closest('.accordion'), li = $panel.closest('li'), openEvent = document.createEvent('Event'), closeEvent = document.createEvent('Event');
        openEvent.initEvent('panelOpened.accordions.mr', true, true);
        closeEvent.initEvent('panelClosed.accordions.mr', true, true);
        if (li.hasClass('active')) {
            if (forceOpen !== true) {
                li.removeClass('active');
                $panel.trigger('panelClosed.accordions.mr').get(0).dispatchEvent(closeEvent);
            }
        } else {
            if (accordion.hasClass('accordion--oneopen')) {
                var wasActive = accordion.find('li.active');
                if (wasActive.length) {
                    wasActive.removeClass('active');
                    wasActive.trigger('panelClosed.accordions.mr').get(0).dispatchEvent(closeEvent);
                }
                li.addClass('active');
                li.trigger('panelOpened.accordions.mr').get(0).dispatchEvent(openEvent);

            } else {

                if (!li.is('.active')) {
                    li.trigger('panelOpened.accordions.mr').get(0).dispatchEvent(openEvent);
                }
                li.addClass('active');
            }
        }
    };

    mr.accordions.activatePanelById = function (id, forceOpen) {
        var panel;
        if (id !== '' && id !== '#' && id.match(/#\/.*/) === null) {
            panel = $('.accordion > li > .accordion__title#' + id.replace('#', ''));
            if (panel.length) {
                $('html, body').stop(true).animate({ scrollTop: (panel.offset().top - 50) }, 1200);
                mr.accordions.activatePanel(panel, forceOpen);
            }
        }
    };
    mr.components.documentReady.push(mr.accordions.documentReady);
    return mr;
}(mr, jQuery, window, document));

//////////////// Bars
mr = (function (mr, $, window, document) {
    "use strict";
    mr.bars = mr.bars || {};
    mr.bars.documentReady = function ($) {
        $('.nav-container .bar[data-scroll-class*="fixed"]:not(.bar--absolute)').each(function () {
            var bar = $(this),
                barHeight = bar.outerHeight(true);
            bar.closest('.nav-container').css('min-height', barHeight);
        });
    };

    mr.components.documentReady.push(mr.bars.documentReady);
    return mr;

}(mr, jQuery, window, document));

//////////////// Cookies
mr = (function (mr, $, window, document) {
    "use strict";
    mr.cookies = {
        getItem: function (sKey) {
            if (!sKey) { return null; }
            return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
        },
        setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
            if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
            var sExpires = "";
            if (vEnd) {
                switch (vEnd.constructor) {
                    case Number: sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd; break;
                    case String: sExpires = "; expires=" + vEnd; break;
                    case Date: sExpires = "; expires=" + vEnd.toUTCString(); break;
                }
            }
            document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
            return true;
        },
        removeItem: function (sKey, sPath, sDomain) {
            if (!this.hasItem(sKey)) { return false; }
            document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
            return true;
        },
        hasItem: function (sKey) {
            if (!sKey) { return false; }
            return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
        },
        keys: function () {
            var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
            for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
            return aKeys;
        }
    };

    return mr;

}(mr, jQuery, window, document));

//////////////// Dropdowns
mr = (function (mr, $, window, document) {
    "use strict";

    mr.dropdowns = mr.dropdowns || {};

    mr.dropdowns.done = false;

    mr.dropdowns.documentReady = function ($) {

        var rtl = false;

        if ($('html[dir="rtl"]').length) {
            rtl = true;
        }

        if (!mr.dropdowns.done) {
            jQuery(document).on('click', 'body:not(.dropdowns--hover) .dropdown, body.dropdowns--hover .dropdown.dropdown--click', function (event) {
                var dropdown = jQuery(this);
                if (jQuery(event.target).is('.dropdown--active > .dropdown__trigger')) {
                    dropdown.siblings().removeClass('dropdown--active').find('.dropdown').removeClass('dropdown--active');
                    dropdown.toggleClass('dropdown--active');
                } else {
                    $('.dropdown--active').removeClass('dropdown--active');
                    dropdown.addClass('dropdown--active');
                }
            });
            jQuery(document).on('click touchstart', 'body:not(.dropdowns--hover)', function (event) {
                if (!jQuery(event.target).is('[class*="dropdown"], [class*="dropdown"] *')) {
                    $('.dropdown--active').removeClass('dropdown--active');
                }
            });
            jQuery('body.dropdowns--hover .dropdown').on('click', function (event) {
                event.stopPropagation();
                var hoverDropdown = jQuery(this);
                hoverDropdown.toggleClass('dropdown--active');
            });
            // Append a container to the body for measuring purposes
            jQuery('body').append('<div class="container containerMeasure" style="opacity:0;pointer-events:none;"></div>');
            // Menu dropdown positioning
            if (rtl === false) {
                mr.dropdowns.repositionDropdowns($);
                jQuery(window).on('resize', function () { mr.dropdowns.repositionDropdowns($); });
            } else {
                mr.dropdowns.repositionDropdownsRtl($);
                jQuery(window).on('resize', function () { mr.dropdowns.repositionDropdownsRtl($); });
            }

            mr.dropdowns.done = true;
        }
    };

    mr.dropdowns.repositionDropdowns = function ($) {
        $('.dropdown__container').each(function () {
            var container, containerOffset, masterOffset, menuItem, content;

            jQuery(this).css('left', '');

            container = jQuery(this);
            containerOffset = container.offset().left;
            masterOffset = jQuery('.containerMeasure').offset().left;
            menuItem = container.closest('.dropdown').offset().left;
            content = null;

            container.css('left', ((-containerOffset) + (masterOffset)));

            if (container.find('.dropdown__content:not([class*="lg-12"])').length) {
                content = container.find('.dropdown__content');
                content.css('left', ((menuItem) - (masterOffset)));
            }

        });
        $('.dropdown__content').each(function () {
            var dropdown, offset, width, offsetRight, winWidth, leftCorrect;

            dropdown = jQuery(this);
            offset = dropdown.offset().left;
            width = dropdown.outerWidth(true);
            offsetRight = offset + width;
            winWidth = jQuery(window).outerWidth(true);
            leftCorrect = jQuery('.containerMeasure').outerWidth() - width;

            if (offsetRight > winWidth) {
                dropdown.css('left', leftCorrect);
            }

        });
    };

    mr.dropdowns.repositionDropdownsRtl = function ($) {

        var windowWidth = jQuery(window).width();

        $('.dropdown__container').each(function () {
            var container, containerOffset, masterOffset, menuItem, content;

            jQuery(this).css('left', '');

            container = jQuery(this);
            containerOffset = windowWidth - (container.offset().left + container.outerWidth(true));
            masterOffset = jQuery('.containerMeasure').offset().left;
            menuItem = windowWidth - (container.closest('.dropdown').offset().left + container.closest('.dropdown').outerWidth(true));
            content = null;

            container.css('right', ((-containerOffset) + (masterOffset)));

            if (container.find('.dropdown__content:not([class*="lg-12"])').length) {
                content = container.find('.dropdown__content');
                content.css('right', ((menuItem) - (masterOffset)));
            }
        });
        $('.dropdown__content').each(function () {
            var dropdown, offset, width, offsetRight, winWidth, rightCorrect;

            dropdown = jQuery(this);
            offset = windowWidth - (dropdown.offset().left + dropdown.outerWidth(true));
            width = dropdown.outerWidth(true);
            offsetRight = offset + width;
            winWidth = jQuery(window).outerWidth(true);
            rightCorrect = jQuery('.containerMeasure').outerWidth() - width;

            if (offsetRight > winWidth) {
                dropdown.css('right', rightCorrect);
            }

        });
    };


    mr.components.documentReady.push(mr.dropdowns.documentReady);
    return mr;

}(mr, jQuery, window, document));

//////////////// Masonry
mr = (function (mr, $, window, document) {
    "use strict";

    mr.masonry = mr.masonry || {};

    mr.masonry.documentReady = function ($) {

        mr.masonry.updateFilters();

        $(document).on('click touchstart', '.masonry__filters li:not(.js-no-action)', function () {
            var masonryFilter = $(this);
            var masonryContainer = masonryFilter.closest('.masonry').find('.masonry__container');
            var filterValue = '*';
            if (masonryFilter.attr('data-masonry-filter') !== '*') {
                filterValue = '.filter-' + masonryFilter.attr('data-masonry-filter');
            }
            masonryFilter.siblings('li').removeClass('active');
            masonryFilter.addClass('active');
            masonryContainer.removeClass('masonry--animate');
            masonryContainer.on('layoutComplete', function () {
                $(this).addClass('masonry--active');
                if (typeof mr_parallax !== typeof undefined) {
                    setTimeout(function () { mr_parallax.profileParallaxElements(); }, 100);
                }
            });
            masonryContainer.isotope({ filter: filterValue });

        });

    };

    mr.masonry.windowLoad = function () {

        $('.masonry').each(function () {
            var masonry = $(this).find('.masonry__container'),
                masonryParent = $(this),
                defaultFilter = '*',
                themeDefaults, ao = {};

            themeDefaults = {
                itemSelector: '.masonry__item',
                filter: '*',
                masonry: {
                    columnWidth: '.masonry__item'
                }
            };

            // Check for a default filter attribute
            if (masonryParent.is('[data-default-filter]')) {
                defaultFilter = masonryParent.attr('data-default-filter').toLowerCase();
                defaultFilter = '.filter-' + defaultFilter;
                masonryParent.find('li[data-masonry-filter]').removeClass('active');
                masonryParent.find('li[data-masonry-filter="' + masonryParent.attr("data-default-filter").toLowerCase() + '"]').addClass('active');
            }

            // Use data attributes to override the default settings and provide a per-masonry customisation where necessary.
            ao.filter = defaultFilter !== '*' ? defaultFilter : undefined;

            masonry.on('layoutComplete', function () {
                masonry.addClass('masonry--active');
                if (typeof mr_parallax !== typeof undefined) {
                    setTimeout(function () { mr_parallax.profileParallaxElements(); }, 100);
                }
            });


            masonry.isotope(jQuery.extend({}, themeDefaults, mr.masonry.options, ao));

        });
    };

    mr.masonry.updateFilters = function (masonry) {

        // If no argument is supplied, just apply the update to all masonry sets on the page.
        masonry = typeof masonry !== typeof undefined ? masonry : '.masonry';

        var $masonry = $(masonry);

        $masonry.each(function () {
            var $masonry = $(this),
                masonryContainer = $masonry.find('.masonry__container'),
                filters = $masonry.find('.masonry__filters'),
                // data-filter-all-text can be used to set the word for "all"
                filterAllText = typeof filters.attr('data-filter-all-text') !== typeof undefined ? filters.attr('data-filter-all-text') : "All",
                filtersList;

            // Ensure we are working with a .masonry element
            if ($masonry.is('.masonry')) {
                // If a filterable masonry item exists
                if (masonryContainer.find('.masonry__item[data-masonry-filter]').length) {

                    // Create empty ul for filters
                    filtersList = filters.find('> ul');

                    if (!filtersList.length) {
                        filtersList = filters.append('<ul></ul>').find('> ul');
                    }

                    // To avoid cases where user leave filter attribute blank
                    // only take items that have filter attribute
                    masonryContainer.find('.masonry__item[data-masonry-filter]').each(function () {
                        var masonryItem = $(this),
                            filterString = masonryItem.attr('data-masonry-filter'),
                            filtersArray = [];

                        // If not undefined or empty
                        if (typeof filterString !== typeof undefined && filterString !== "") {
                            // Split tags from string into array 
                            filtersArray = filterString.split(',');
                        }
                        $(filtersArray).each(function (index, tag) {

                            // Slugify the tag

                            var slug = mr.util.slugify(tag);

                            // Add the filter class to the masonry item

                            masonryItem.addClass('filter-' + slug);

                            // If this tag does not appear in the list already, add it
                            if (!filtersList.find('[data-masonry-filter="' + slug + '"]').length) {
                                filtersList.append('<li data-masonry-filter="' + slug + '">' + tag + '</li>');

                            }
                        });
                    });

                    // Remove any unnused filter options in list
                    filtersList.find('[data-masonry-filter]').each(function () {
                        var $this = $(this),
                            filter = $this.text();

                        if ($(this).attr('data-masonry-filter') !== "*") {
                            if (!$masonry.find('.masonry__item[data-masonry-filter*="' + filter + '"]').length) {
                                $this.remove();
                            }
                        }
                    });

                    mr.util.sortChildrenByText($(this).find('.masonry__filters ul'));
                    // Add a filter "all" option
                    if (!filtersList.find('[data-masonry-filter="*"]').length) {
                        filtersList.prepend('<li class="active" data-masonry-filter="*">' + filterAllText + '</li>');
                    }

                }
                //End of "if filterable masonry item exists"
            }
            //End of "if $masonry is .masonry"
        });

    };

    mr.masonry.updateLayout = function (masonry) {
        // If no argument is supplied, just apply the update to all masonry sets on the page.
        masonry = typeof masonry !== typeof undefined ? masonry : '.masonry';
        var $masonry = $(masonry);
        $masonry.each(function () {
            var collection = $(this),
                newItems = collection.find('.masonry__item:not([style])'),
                masonryContainer = collection.find('.masonry__container');
            if (collection.is('.masonry')) {
                if (newItems.length) {
                    masonryContainer.isotope('appended', newItems).isotope('layout');
                }
                masonryContainer.isotope('layout');
            }
        });
    };

    mr.components.documentReady.push(mr.masonry.documentReady);
    mr.components.windowLoad.push(mr.masonry.windowLoad);
    return mr;

}(mr, jQuery, window, document));


//////////////// Modals
mr = (function (mr, $, window, document) {
    "use strict";

    mr.modals = mr.modals || {};

    mr.modals.documentReady = function ($) {
        var allPageModals = "<div class=\"all-page-modals\"></div>",
            mainContainer = $('div.main-container');

        if (mainContainer.length) {
            jQuery(allPageModals).insertAfter(mainContainer);
            mr.modals.allModalsContainer = $('div.all-page-modals');
        }
        else {
            jQuery('body').append(allPageModals);
            mr.modals.allModalsContainer = jQuery('body div.all-page-modals');
        }

        $('.modal-container').each(function () {

            // Add modal close if none exists

            var modal = $(this),
                $window = $(window),
                modalContent = modal.find('.modal-content');


            if (!modal.find('.modal-close').length) {
                modal.find('.modal-content').append('<div class="modal-close modal-close-cross"></div>');
            }

            // Set modal height

            if (modalContent.attr('data-width') !== undefined) {
                var modalWidth = modalContent.attr('data-width').substr(0, modalContent.attr('data-width').indexOf('%')) * 1;
                modalContent.css('width', modalWidth + '%');
            }
            if (modalContent.attr('data-height') !== undefined) {
                var modalHeight = modalContent.attr('data-height').substr(0, modalContent.attr('data-height').indexOf('%')) * 1;
                modalContent.css('height', modalHeight + '%');
            }

            // Set iframe's src to data-src to stop autoplaying iframes
            mr.util.idleSrc(modal, 'iframe');

        });


        $('.modal-instance').each(function (index) {
            var modalInstance = $(this);
            var modal = modalInstance.find('.modal-container');
            var modalContent = modalInstance.find('.modal-content');
            var trigger = modalInstance.find('.modal-trigger');

            // Link modal with modal-id attribute

            trigger.attr('data-modal-index', index);
            modal.attr('data-modal-index', index);

            // Set unique id for multiple triggers

            if (typeof modal.attr('data-modal-id') !== typeof undefined) {
                trigger.attr('data-modal-id', modal.attr('data-modal-id'));
            }
            // Attach the modal to the body            
            modal = modal.detach();
            mr.modals.allModalsContainer.append(modal);
        });
        $('.modal-trigger').on('click', function () {
            var modalTrigger = $(this);
            var uniqueID, targetModal;
            // Determine if the modal id is set by user or is set programatically
            if (typeof modalTrigger.attr('data-modal-id') !== typeof undefined) {
                uniqueID = modalTrigger.attr('data-modal-id');
                targetModal = mr.modals.allModalsContainer.find('.modal-container[data-modal-id="' + uniqueID + '"]');
            } else {
                uniqueID = $(this).attr('data-modal-index');
                targetModal = mr.modals.allModalsContainer.find('.modal-container[data-modal-index="' + uniqueID + '"]');
            }
            mr.util.activateIdleSrc(targetModal, 'iframe');
            mr.modals.autoplayVideo(targetModal);
            mr.modals.showModal(targetModal);
            return false;
        });
        jQuery(document).on('click', '.modal-close', mr.modals.closeActiveModal);
        jQuery(document).keyup(function (e) {
            if (e.keyCode === 27) { // escape key maps to keycode `27`
                mr.modals.closeActiveModal();
            }
        });
        $('.modal-container:not(.modal--prevent-close)').on('click', function (e) {
            if (e.target !== this) return;
            mr.modals.closeActiveModal();
        });
        // Trigger autoshow modals
        $('.modal-container[data-autoshow]').each(function () {
            var modal = $(this);
            var millisecondsDelay = modal.attr('data-autoshow') * 1;
            mr.util.activateIdleSrc(modal);
            mr.modals.autoplayVideo(modal);
            // If this modal has a cookie attribute, check to see if a cookie is set, and if so, don't show it.
            if (typeof modal.attr('data-cookie') !== typeof undefined) {
                if (!mr.cookies.hasItem(modal.attr('data-cookie'))) {
                    mr.modals.showModal(modal, millisecondsDelay);
                }
            } else {
                mr.modals.showModal(modal, millisecondsDelay);
            }
        });
        // Exit modals
        $('.modal-container[data-show-on-exit]').each(function () {
            var modal = jQuery(this),
                exitSelector = modal.attr('data-show-on-exit'),
                delay = 0;

            if (modal.attr('data-delay')) {
                delay = parseInt(modal.attr('data-delay'), 10) || 0;
            }

            // If a valid selector is found, attach leave event to show modal.
            if ($(exitSelector).length) {
                modal.prepend($('<i class="ti-close close-modal">'));
                jQuery(document).on('mouseleave', exitSelector, function () {
                    if (!$('.modal-active').length) {
                        if (typeof modal.attr('data-cookie') !== typeof undefined) {
                            if (!mr.cookies.hasItem(modal.attr('data-cookie'))) {
                                mr.modals.showModal(modal, delay);
                            }
                        } else {
                            mr.modals.showModal(modal, delay);
                        }
                    }
                });
            }
        });


        // Autoshow modal by ID from location href
        if (window.location.href.split('#').length === 2) {
            var modalID = window.location.href.split('#').pop();
            if ($('[data-modal-id="' + modalID + '"]').length) {
                mr.modals.closeActiveModal();
                mr.modals.showModal($('[data-modal-id="' + modalID + '"]'));
            }
        }

        jQuery(document).on('click', 'a[href^="#"]', function () {
            var modalID = $(this).attr('href').replace('#', '');
            if ($('[data-modal-id="' + modalID + '"]').length) {
                mr.modals.closeActiveModal();
                setTimeout(mr.modals.showModal, 500, '[data-modal-id="' + modalID + '"]', 0);
            }
        });

        // Make modal scrollable
        jQuery(document).on('wheel mousewheel scroll', '.modal-content, .modal-content .scrollable', function (evt) {
            if (evt.preventDefault) { evt.preventDefault(); }
            if (evt.stopPropagation) { evt.stopPropagation(); }
            this.scrollTop += (evt.originalEvent.deltaY);
        });
    };
    ////////////////
    //////////////// End documentReady
    ////////////////

    mr.modals.showModal = function (modal, millisecondsDelay) {

        var delay = (typeof millisecondsDelay !== typeof undefined) ? (1 * millisecondsDelay) : 0, $modal = $(modal);

        if ($modal.length) {
            setTimeout(function () {
                var openEvent = document.createEvent('Event');
                openEvent.initEvent('modalOpened.modals.mr', true, true);
                $(modal).addClass('modal-active').trigger('modalOpened.modals.mr').get(0).dispatchEvent(openEvent);

            }, delay);
        }
    };

    mr.modals.closeActiveModal = function () {
        var modal = jQuery('body div.modal-active'),
            closeEvent = document.createEvent('Event');

        mr.util.idleSrc(modal, 'iframe');
        mr.util.pauseVideo(modal);

        // If this modal requires to be closed permanently using a cookie, set the cookie now.
        if (typeof modal.attr('data-cookie') !== typeof undefined) {
            mr.cookies.setItem(modal.attr('data-cookie'), "true", Infinity, '/');
        }

        if (modal.length) {
            // Remove hash from URL bar if this modal was opened via url bar ID
            if (modal.is('[data-modal-id]') && window.location.hash === '#' + modal.attr('data-modal-id')) {
                mr.util.removeHash();
            }
            closeEvent.initEvent('modalClosed.modals.mr', true, true);
            modal.removeClass('modal-active').trigger('modalClosed.modals.mr').get(0).dispatchEvent(closeEvent);
        }
    };

    mr.modals.autoplayVideo = function (modal) {
        // If modal contains HTML5 video with autoplay, play the video
        if (modal.find('video[autoplay]').length) {
            var video = modal.find('video').get(0);
            video.play();
        }
    };

    mr.components.documentReady.push(mr.modals.documentReady);
    return mr;

}(mr, jQuery, window, document));

//////////////// Smoothscroll
mr = (function (mr, $, window, document) {
    "use strict";

    mr.smoothscroll = mr.smoothscroll || {};
    mr.smoothscroll.sections = [];

    mr.smoothscroll.init = function () {
        mr.smoothscroll.sections = [];



        $('a.inner-link').each(function () {
            var sectionObject = {},
                link = $(this),
                href = link.attr('href'),
                validLink = new RegExp('^#[^\r\n\t\f\v\#\.]+$', 'gm');

            if (validLink.test(href)) {

                if ($('section' + href).length) {

                    sectionObject.id = href;
                    sectionObject.top = Math.round($(href).offset().top);
                    sectionObject.height = Math.round($(href).outerHeight());
                    sectionObject.link = link.get(0);
                    sectionObject.active = false;

                    mr.smoothscroll.sections.push(sectionObject);
                }
            }
        });

        mr.smoothscroll.highlight();
    };

    mr.smoothscroll.highlight = function () {
        mr.smoothscroll.sections.forEach(function (section) {
            if (mr.scroll.y >= section.top && mr.scroll.y < (section.top + section.height)) {
                if (section.active === false) {
                    section.link.classList.add("inner-link--active");
                    section.active = true;
                }
            } else {
                section.link.classList.remove("inner-link--active");
                section.active = false;
            }
        });
    };

    mr.scroll.listeners.push(mr.smoothscroll.highlight);

    mr.smoothscroll.documentReady = function ($) {
        // Smooth scroll to inner links
        var innerLinks = $('a.inner-link'), offset, themeDefaults, ao = {};

        themeDefaults = {
            selector: '.inner-link',
            selectorHeader: null,
            speed: 750,
            easing: 'easeInOutCubic',
            offset: 0
        };

        if (innerLinks.length) {
            innerLinks.each(function (index) {
                var link = $(this),
                    href = link.attr('href');
                if (href.charAt(0) !== "#") {
                    link.removeClass('inner-link');
                }
            });

            mr.smoothscroll.init();
            $(window).on('resize', mr.smoothscroll.init);

            offset = 0;
            if ($('body[data-smooth-scroll-offset]').length) {
                offset = $('body').attr('data-smooth-scroll-offset');
                offset = offset * 1;
            }

            ao.offset = offset !== 0 ? offset : undefined;

            smoothScroll.init(jQuery.extend({}, themeDefaults, mr.smoothscroll.options, ao));
        }
    };

    mr.components.documentReady.push(mr.smoothscroll.documentReady);
    mr.components.windowLoad.push(mr.smoothscroll.init);
    return mr;

}(mr, jQuery, window, document));
