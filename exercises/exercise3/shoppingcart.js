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
