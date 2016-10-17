(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./article":2,"./shoppingcart":3}],2:[function(require,module,exports){
const Article = class Article {
  constructor(name) {
    this.name = name;
    this.checked = false;
    this.created = new Date();
    this.modified = new Date();
  }

  get isChecked() {
    return this.checked;
  }

  set setChecked(checked) {
    this.checked = checked;
    this.modified = new Date();
  }

  get articleName() {
    return this.name;
  }
};

module.exports = Article;

},{}],3:[function(require,module,exports){
const Article = require('./article');

const ShoppingCart = class ShoppingCart {
  constructor() {
    this.created = new Date();
    this.modified = new Date();
    this.articles = [];
     ShoppingCart.storageAvailable('localStorage').then(() => {
      this.persistence = true;
      }).catch((error) => {
        this.persistence = false;
        console.log(error);
      });
  }

  get storedArticles() {
    return this.articles;
  }

  clearArticles() {
    return new Promise((resolve, reject) => {
    this.modified = new Date();
    this.articles = [];
    this.persistShoppingCart().then(() => {
      resolve();
      }).catch((error) => {
        reject(error);
      });
    });
  }

  addArticle(article) {
    return new Promise((resolve, reject) => {
      this.modified = new Date();
      this.articles.push(article);
      this.persistShoppingCart().then(() => {
        resolve();
      }).catch((error) => {
        reject(error);
      });
    });
  }

  getArticleByName(name) {
    return new Promise((resolve, reject) => {
      let result = undefined;
      for (const article of this.articles) {
        if (article.articleName === name) {
          result = article;
          resolve(result);
          break;
        }
      }
      if (result === undefined) {
        reject(result);
      }
    });
  }

  persistShoppingCart() {
    return new Promise((resolve, reject) => {
      if (this.persistence) {
        const storage = window['localStorage'];
        storage.setItem('shoppingCartArticles', JSON.stringify(this
          .articles));
        resolve();
      } else {
        reject("cannot persist shopping cart!");
      }
    });
  }

  static storageAvailable(type) {
    return new Promise((resolve, reject) => {
      try {
        const storage = window[type],
          x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  static restoreShoppingCart() {
    return new Promise((resolve, reject) => {
      const shoppingCart = new ShoppingCart();
      ShoppingCart.storageAvailable('localStorage').then(() => {
        const storage = window['localStorage'];
        if (storage.getItem('shoppingCartArticles')) {
          const savedArticles = JSON.parse(storage.getItem(
            'shoppingCartArticles'));
          for (const article of savedArticles) {
            let articleObj = new Article(article.name);
            articleObj.setChecked = article.checked;
            shoppingCart.addArticle(articleObj).then(() => {}).catch((error) => {
              reject(error);
            });
          }
        resolve(shoppingCart);
      }
      }).catch((error) => {
        reject(error);
      });
    });
  };
};

module.exports = ShoppingCart;

},{"./article":2}]},{},[1]);
