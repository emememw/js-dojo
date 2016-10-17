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
