$("#add-button").click(function addItem() {
  var newItemName = $("#new-item").val();

  if (newItemName) {
    $(".list-group").append($("<li class='list-group-item'>").text(newItemName));
  }
});

$("#delete-button").click(function deleteList() {
    $(".list-group").empty();
  });

$("#items").on("click", "li", function selectItem() {
  if ($(this).hasClass("ok")) {
    $(this).removeClass("ok");
  } else {
    $(this).addClass("ok");
  }
});
