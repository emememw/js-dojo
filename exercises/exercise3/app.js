// code goes in here
(function(app) {
  'use strict';
  const Article = require('./article');
  const ShoppingCart = require('./shoppingcart');
  app(window.jQuery, window, document, ShoppingCart, Article);
}(function($, window, document, ShoppingCart, Article) {
  function initList(list, shoppingCart) {
    list.empty();
    const articles = shoppingCart.storedArticles;
    if (articles !== undefined) {
      for (const article of articles) {
        const newElement = $('<li class="list-group-item">' + article.articleName + '</li>');
        if (article.isChecked) {
          newElement.addClass('ok');
        }
        list.append(newElement);
      }
    }
  }

  function addListeners(list, addButton, deleteButton, newItem,
    shoppingCart) {
    list.on('click', 'li', function() {
      try {
        shoppingCart.getArticleByName($(this).text()).then((article) => {
          article.setChecked = !article.isChecked;
          shoppingCart.persistShoppingCart().then(() => {
            initList(list, shoppingCart);
          }).catch((error) => {
            reject(error);
          });
        });
      } catch (err) {
        console.log('oops: ' + err);
      }
    });
    addButton.on('click', function() {
      const newArticle = new Article(newItem.val());
      newItem.val('');
      shoppingCart.addArticle(newArticle).then(() => {
        initList(list, shoppingCart);
        }).catch((error) => {
          console.log(error);
        });
    });
    deleteButton.on('click', function() {
      shoppingCart.clearArticles().then(() => {
        initList(list, shoppingCart);
      }).catch((error) => {
        console.log(error);
      });
    });
  };

  $(function() {
    console.log("jQuery ready!");
    const list = $('#items');
    const newItem = $('#new-item');
    const addButton = $('#add-button');
    const deleteButton = $('#delete-button');
    ShoppingCart.restoreShoppingCart().then((localShoppingCart) => {
      initList(list, localShoppingCart);
      addListeners(list, addButton, deleteButton, newItem,
        localShoppingCart);
    });
  });
}));
