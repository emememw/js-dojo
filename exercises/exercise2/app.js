function Item(name){
  this.name = name;
  this.creationDate = new Date();
}

Item.prototype.select = function() {
  this.state = "selected";
  this.modificationDate = new Date();
};

Item.prototype.unselect = function() {
  this.state = "unselected";
  this.modificationDate = new Date();
};

$("#add-button").click(function addItem() {
  var newItemName = $("#new-item").val();

  if (newItemName) {
    $(".list-group").append($("<li class='list-group-item'>").text(newItemName));

    var item = new Item(newItemName);
    localStorage.setItem(newItemName, item);
  }
});

$("#delete-button").click(function deleteList() {
    $(".list-group").empty();

    localStorage.clear();
  });

$("#items").on("click", "li", function selectItem() {
  var item = localStorage.getItem($(this).text());

  if (!item) {
    if (item.state === "selected") {
      $(this).removeClass("ok");

      item.unselect();
      localStorage.setItem($(this).text(), item);
    } else {
      $(this).addClass("ok");

      item.select();
      localStorage.setItem($(this).text(), item);
    }
  }
});
