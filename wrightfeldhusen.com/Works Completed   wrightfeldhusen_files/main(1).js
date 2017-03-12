(function($){
	$(function(){
		/**
		 * Deal with the sticky header
		 */
		$("#main-menu").waypoint(function(event, direction){
			if (direction == "down")
			{
				$("#main-menu").addClass("scrolling");				
			}
		});
		$("#menu-waypoint").waypoint(function(event, direction){
			if (direction == "up")
			{
				$("#main-menu").removeClass("scrolling");
			}
		});

		// Hints
		$(".hints").each(function(){
			$(this).val($(this).attr("title"));
		});
		$(".hints").focus(function(){
			if ($(this).val() == $(this).attr('title'))
			{
				$(this).val("");
			}
		});
		$(".hints").blur(function(){
			if ($(this).val() == "")
			{
				$(this).val($(this).attr("title"));
			}
		});
		
		/* Google maps on the contact page */
		if ($(".node-contact-page").length > 0) {
			// Yes we're on the contact page
			var MY_MAPTYPE_ID = 'wright';
	      	var map;
	      	var wright = new google.maps.LatLng(-31.99966696199254, 115.76139986515045);
	
			var mapOptions = {
				zoom: 15,
				center: wright,
				mapTypeControlOptions: {
					mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
				},
				disableDefaultUI: true,
				mapTypeId: MY_MAPTYPE_ID
			};
			
			var stylez = [
				{
					featureType: 'all',
					elementType: 'all',
					stylers: [
						{ hue: '#808080' },
						{ saturation: 0 }, 
						{ lightness: 40 }
					]
				}
			];
	
			var image = '/sites/all/themes/wrightfeldhusen/img/map-logo.png';
	
			map = new google.maps.Map(document.getElementById('google-maps'), mapOptions);
	
			map.setOptions({styles: stylez});
	
			var lab55MapType = new google.maps.StyledMapType(stylez);
	
			map.mapTypes.set(MY_MAPTYPE_ID, lab55MapType);
	
			var labMarker = new google.maps.Marker({
		        position: wright,
		        map: map,
		        icon: image
		    });
		}

	});
})(jQuery);
