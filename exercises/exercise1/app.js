// code goes in here
(function(app) {
  'use strict';
  app(window.jQuery, window, document);
}(function($, window, document) {
  $(function() {
    console.log("The DOM is ready");
    var itemList = $("#items");
    var newItem = $("#new-item");
    var addButton = $("#add-button");
    var deleteButton = $("#delete-button");
    itemList.on("click", "li", function() {
      $(this).toggleClass("ok");
    });
    addButton.on("click", function() {
      var newElement = $('<li class="list-group-item">' + newItem.val() +
        '</li>');
      itemList.append(newElement);
      newItem.val("");
    });
    deleteButton.on("click", function() {
      itemList.empty();
    });
  });
}));
