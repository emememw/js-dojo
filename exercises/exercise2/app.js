function ShoppingList() {
	this.initSavedItems();
	this.addFunctionToItems(this);
	this.initButtons(this);
	if (this.storageAvailable('localStorage')) {
		console.log("localStorage... ok");
	} else {
		alert("Leider kann ihre Einkaufsliste nicht gespeichert werden.");
	}
}

ShoppingList.prototype.addToList = function() {
	var itemList = $("#items");
	itemList.append('<li class="list-group-item">' + $("#new-item").val() + '</li>');
	var storedItems = JSON.parse(localStorage.getItem("items"));
	if (storedItems === null) {
		storedItems = new Array();
	}
	var shoppingListItem = new ShoppingListItem($("#new-item").val(), false);
	storedItems.push(shoppingListItem);
	localStorage.setItem("items", JSON.stringify(storedItems));
};

ShoppingList.prototype.initSavedItems = function() {
	var storedItems = JSON.parse(localStorage.getItem("items"));
	if (storedItems) {
		var itemList = $("#items");
		for (var item of storedItems) {
			if (item.inShoppingCart) {
				itemList.append('<li class="list-group-item ok">' + item.name + '</li>');
			} else {
				itemList.append('<li class="list-group-item">' + item.name + '</li>');
			}
		}
	}

};

ShoppingList.prototype.changeState = function(element, index) {
	var storedItems = JSON.parse(localStorage.getItem("items"));
	storedItems[index].inShoppingCart = !storedItems[index].inShoppingCart;
	localStorage.setItem("items", JSON.stringify(storedItems));
	$(element).toggleClass("ok");
};


ShoppingList.prototype.clearList = function() {
	$("#items").children().remove();
	localStorage.clear();
};


ShoppingList.prototype.initButtons = function initButtons(shoppingList) {
	var deleteButton = $("#delete-button");
	deleteButton.on("click", function() {
		shoppingList.clearList();
	});

	var addButton = $("#add-button");
	addButton.on("click", function() {
		shoppingList.addToList();
	});
}

ShoppingList.prototype.addFunctionToItems = function addFunctionToItems(shoppingList) {
	$(".list-group").on("click", "li", function() {
		shoppingList.changeState(this, $("li").index(this));
	});
}

ShoppingList.prototype.storageAvailable = function storageAvailable(type) {
	try {
		var storage = window[type],
			x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	} catch (e) {
		return false;
	}
}

function ShoppingListItem(name, inShoppingCart) {
	this.inShoppingCart = inShoppingCart;
	this.name = name;
}


(function($, window, document) {
	$(function() {
		$("#items").children().remove();
		var shoppingList = new ShoppingList();
	});

}(window.jQuery, window, document));
