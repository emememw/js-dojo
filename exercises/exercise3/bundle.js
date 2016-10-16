(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./article":2,"./shoppingcart":3}],2:[function(require,module,exports){
var Article = class Article {
  constructor(name) {
    this.name = name;
    this.checked = false;
    this.created = new Date();
    this.modified = new Date();
  }

  get isChecked(){
    return this.checked;
  }

  set setChecked(checked){
    this.checked = checked;
    this.modified = new Date();
  }

  get articleName(){
    return this.name;
  }
};

module.exports = Article;

},{}],3:[function(require,module,exports){
const Article = require('./article');

var ShoppingCart = class ShoppingCart {
  constructor() {
    this.created = new Date();
    this.modified = new Date();
    this.canPersist = ShoppingCart.storageAvailable('localStorage');
    this.articles = [];
  }

  get storedArticles(){
    return this.articles;
  }

  clearArticles(){
    this.modified = new Date();
    this.articles = [];
    this.persistShoppingCart();
  }

  addArticle(article){
    this.modified = new Date();
    this.articles.push(article);
    this.persistShoppingCart();
  }

  getArticleByName(name){
    var result = undefined;
    this.articles.forEach((article) => {
      if(article.articleName === name){
        result = article;
        return false;
      }
    });
    return result;
  }

  persistShoppingCart(){
    if(this.canPersist){
      var storage = window['localStorage'];
      storage.setItem('shoppingCartArticles', JSON.stringify(this.articles));
    } else {
      console.log('cannot persist shopping cart!');
    }
  }

  static storageAvailable(type){
    try {
      var storage = window[type],
      x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    }
    catch(e) {
      return false;
    }
  }

  static restoreShoppingCart(){
    var shoppingCart = undefined;
    if(ShoppingCart.storageAvailable('localStorage')){
      var storage = window['localStorage'];
      if(storage.getItem('shoppingCartArticles')){
        shoppingCart = new ShoppingCart();
        var savedArticles = JSON.parse(storage.getItem('shoppingCartArticles'));
        savedArticles.forEach((article) => {
          // little bit of hackery as JSON doesn't save getters/setters -_- meh
          var articleObj = new Article(article.name);
          articleObj.setChecked = article.checked;
          shoppingCart.addArticle(articleObj);
        });
      } else {
        shoppingCart = new ShoppingCart();
      }
    } else {
      shoppingCart = new ShoppingCart();
    }
    return shoppingCart;
  }
};

module.exports = ShoppingCart;

},{"./article":2}]},{},[1]);
