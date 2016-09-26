(function($, window, document) {

	// The $ is now locally scoped

	// Listen for the jQuery ready event on the document
	$(function() {

		// The DOM is ready!
		initItemList();
		initButtons();
	});


	function initButtons() {
		var deleteButton = $("#delete-button");
		deleteButton.on("click", function() {
			$("#items").children().remove();
		});

		var addButton = $("#add-button");
		addButton.on("click", function() {
			var itemList = $("#items");
			itemList.append('<li class="list-group-item">' + $("#new-item").val() + '</li>');
		});
	}

	function initItemList() {

		$(".list-group").on("click", "li", function() {
			$(this).toggleClass("ok");
		});
	}



}(window.jQuery, window, document));
