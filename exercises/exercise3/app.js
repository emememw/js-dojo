// we are allowed to use ES6 - so let's use it!
// and remember kids: don't pollute the global namespace...
// this time with browserify!
(function(app) {
  'use strict';
  var Article = require('./article');
  var ShoppingCart = require('./shoppingcart');
  app(window.jQuery, window, document, ShoppingCart, Article);
}(function($, window, document, ShoppingCart, Article) {

  function renderList(list, shoppingCart) {
    list.empty();
    shoppingCart.storedArticles.forEach((article) => {
      var newElement = $('<li>' + article.articleName + '</li>');
      newElement.addClass('list-group-item');
      if(article.isChecked){
        newElement.addClass('ok');
      }
      list.append(newElement);
    });
  }

  function addEventListeners(list, addButton, deleteButton, newItem, shoppingCart) {
    list.on('click', 'li', function(){
      try {
        var article = shoppingCart.getArticleByName($(this).text());
        article.setChecked = !article.isChecked;
        shoppingCart.persistShoppingCart();
      } catch (err) {
        console.log('oops: ' + err);
      }
      renderList(list, shoppingCart);
    });
    addButton.on('click', function(){
      var newArticle = new Article(newItem.val());
      newItem.val('');
      shoppingCart.addArticle(newArticle);
      renderList(list, shoppingCart);
    });
    deleteButton.on('click', function(){
      shoppingCart.clearArticles();
      renderList(list, shoppingCart);
    });
  }

  $(function(){
    console.log("jQuery ready!");
    var list = $('#items');
    var newItem = $('#new-item');
    var addButton = $('#add-button');
    var deleteButton = $('#delete-button');
    var localShoppingCart = ShoppingCart.restoreShoppingCart(); // TODO save/restore with local storage
    addEventListeners(list, addButton, deleteButton, newItem, localShoppingCart);
    renderList(list, localShoppingCart);
  });
}));
