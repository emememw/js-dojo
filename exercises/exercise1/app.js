// code goes in here
(function(app) {
  'use strict';
  app(window.jQuery, window, document);
}(function($, window, document) {
  $(function(){
    console.log("jQuery ready!");
    var list = $('#items');
    var newItem = $('#new-item');
    var addButton = $('#add-button');
    var deleteButton = $('#delete-button');
    list.on('click', 'li', function(){
      $(this).toggleClass('ok');
    });
    addButton.on('click', function(){
      var newElement = $('<li>' + newItem.val() + '</li>');
      newElement.addClass('list-group-item');
      list.append(newElement);
      newItem.val('');
    });
    deleteButton.on('click', function(){
      list.empty();
    });
  });
}));
