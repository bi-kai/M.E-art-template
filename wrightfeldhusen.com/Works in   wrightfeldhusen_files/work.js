jQuery.fn.scrollMinimal = function(smooth) {
  var cTop = this.offset().top;
  var cHeight = this.outerHeight(true);
  var windowTop = $(window).scrollTop();
  var visibleHeight = $(window).height();

  if (cTop < windowTop) {
    if (smooth) {
      $('body').animate({'scrollTop': cTop}, 'slow', 'swing');
    } else {
      $(window).scrollTop(cTop);
    }
  } else if (cTop + cHeight > windowTop + visibleHeight) {
    if (smooth) {
      $('body').animate({'scrollTop': cTop - visibleHeight + cHeight}, 'slow', 'swing');
    } else {
      $(window).scrollTop(cTop - visibleHeight + cHeight);
    }
  }
};

var iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? true : false );


/**
 * Contains stuff relevant to the work pages
 */
(function($){
	$(function(){
			
		var slideUpWork = function($el, index, andThen) {
			$.data(window, "workDetailsAnimating", true);
			$el.find(".nivo-controlNav").fadeOut();
			$(".work-bottom-padder").slideDown('slow');
			
			// Get rid of the 'last-work-details' regardless, this might change later
			// if they resize the screen (last row changes)
			if ($el.hasClass('last-work-details')) $el.removeClass('last-work-details');
			
			$el.slideUp('slow',function(){
				$.data(window, "workDetailsAnimating", false);
				$.data(window, "workDetailsShowing", false);
				$.data(window, "workDetailsCurrentlyShowing", null);
				$.data(window, "workDetailsCurrentlyShowingIndex", null);
				// Tear down slider
				$('.slideshow-images').each(function(){
					$(this).removeData("nivoSlider");
					$(this).removeData("nivoslider");
					$(this).removeData("nivo:vars");
					$(this).unbind();
				});
				// Remove the currently active timers
				var timers = $(window).data("activeTimers");
				if (timers) {
					for (var i=0; i<timers.length; i++) {
						console.log(clearInterval(timers[i]));
					}
				}
				$(window).removeData("activeTimers");
				$(".nivo-main-image").remove();
				$(".nivo-caption").remove();
				$(".nivo-directionNav").remove();
				$(".nivo-slice").remove();
				$(".nivo-controlNav").remove();
				$el.remove();
				var numItems = $(".views-row").length;
				
				// Now slide down the awaiting details (if there are some waiting)
				// We use !== because otherwise javascript thinks 0 == null
				if (andThen !== null)
				{
					slideDownWork(andThen, numItems);
				}
			});
		};
		
		var slideDownWork = function(index, numItems) {
			
			// Switch off all other selected classes
			$(".views-row").removeClass("selected-work");
			
			var $clickedElement = $(".views-row:nth-child(" + (index + 1) + ")");
			var numPerRow = $.data(window, "widthScheme") == "skinny" ? 3 : 4;
			var targetIndex = Math.ceil((index+1) / numPerRow) * numPerRow;
			
			// Set the selected work class on the currently selected thumbnail so that it can be highlighted
			$clickedElement.addClass("selected-work");
			
			var $contentArea = $clickedElement.data("moreDetails").css("display", "none");
			
			// Deal with straglers that don't complete the last row
			if (targetIndex >= numItems) {
				targetIndex = numItems;
				$contentArea.addClass("last-work-details");
			}
			
			$(".works-sliders .views-row:nth-child(" + targetIndex + ")").after($contentArea);
			
			/**
			 * Lock animation, start slide
			 */
			$.data(window, "workDetailsAnimating", true);
			
			// We want to init the nivo slider before we start to slide down 
			var nivo = $contentArea.find('.slideshow-images');
			nivo.nivoSlider({
				effect: 'fade',
				animSpeed: 1000,
   	 			pauseTime: 6000, // How long each slide will show
    			slices: 1, // For slice animations
    			directionNav: true
			});

			// First slide the window to the correct position
			// Do some tricky maths so the time taken when scrolling is relative to the distance that needs to be travelled
			var scrollTopTarget = $clickedElement.offset().top - 60;
			var element;
			if ($("body").scrollTop()) element = $("body").scrollTop(); else element = $("html").scrollTop();
			var scrollTopCurrent = element - 60;
			var scrollTime = (scrollTopTarget - scrollTopCurrent > 0) ? (scrollTopTarget - scrollTopCurrent) : (scrollTopCurrent = scrollTopTarget);
			scrollTime = scrollTime * 3 + 100;
			$("html,body").animate({scrollTop: scrollTopTarget}, scrollTime, function(){
				$(".work-bottom-padder").slideUp('slow');
				// Then slide the box down
	        	$contentArea.slideDown('slow', function(){
					$.data(window, "workDetailsShowing", true);
					$.data(window, "workDetailsAnimating", false);
					$.data(window, "workDetailsCurrentlyShowing", $contentArea);
					$.data(window, "workDetailsCurrentlyShowingIndex", index);
				});
			});
			
			
		};
		
		/**
		 * Deal with the dropdowns for work stuff
		 */
		$(".works-sliders .views-row").click(function(){
			
			//Don't do anything if we're already animating
			if (!$.data(window, "workDetailsAnimating"))
			{
				var clickedIndex = $(this).index(".views-row");
				
				// Don't animate just yet if one is already out
				if ($.data(window, "workDetailsShowing")) {
					if ($.data(window, "workDetailsCurrentlyShowingIndex") == clickedIndex)
					{
						// We're clicking the same one that's already selected so just close it
						clickedIndex = null;
					}
					slideUpWork($.data(window, "workDetailsCurrentlyShowing"), $.data(window, "workDetailsCurrentlyIndex"), clickedIndex);
				}
				else
				{
					var numItems = $(".views-row").length;
					slideDownWork(clickedIndex, numItems);
				}
			}
		});
		
		
		$(".node-pas-details .view-works-in-progress").wrap("<div class='works-sliders' />");
		
		/**
		 * Set data for holding the width scheme, and check if work details need to be shuffled
		 */
		$(window).resize(function(){
			var widthScheme;
			if ($(window).width() > 1380)
			widthScheme = "wide";
			else widthScheme = "skinny";
			$.data(window, "widthScheme", widthScheme);
		});
		
		/**
		 * Strip annoying attrs from imgs
		 */
		$(".views-row img").removeAttr("width");
		$(".views-row img").removeAttr("height");
		
		
		/**
		 * Grab each piece of work's extra data and append it as data to the jquery representation of that element
		 */
		$(".works-sliders .views-row").each(function(){
			$(this).data("moreDetails", $(this).find(".work-content-area"));
			$(this).find(".work-content-area").remove();
		});
		
		/**
		 * Set a bunch of initial global data
		 */
		var widthScheme;
		if ($(window).width() > 1380) widthScheme = "wide";
		else widthScheme = "skinny";
		$.data(window, "widthScheme", widthScheme);
		$.data(window, "workDetailsShowing", false);
		$.data(window, "workDetailsAnimating", false);
		// Holds the jquery object of the currently showing piece of work
		$.data(window, "workDetailsCurrentlyShowing", null);
		$.data(window, "workDetailsCurrentlyIndex", null);
		
		
		$(".works-sliders").on("click", "a.close-button", function(e){
			slideUpWork($.data(window, "workDetailsCurrentlyShowing"), $.data(window, "workDetailsCurrentlyIndex"), null);
			e.preventDefault();
		});
	});
})(jQuery);
