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
