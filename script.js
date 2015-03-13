var placed = 0;
var answers = {};

window.onload = function() {
  setupBoard();
  document.getElementById("reset").disabled = false;
};

function reset() {
  clear("recipe-photos");
  clear("recipe-names");
  setupBoard();
}

function clear(id) {
  var els = document.getElementById(id).children;

  for (var i = 0; i < els.length; i++) {
    var el = els[i];
    var children = el.children;

//this doesnt work
    for (var j = 0; j < children.length; j++) {
      var child = children[j];
      child.nodeName === "IMG" ? el.removeChild(child) : child.innerHTML = "";
      child.className = "";
    }
  }
}

function setupBoard() {
  var menuJSON = json.two_person_plan;
  console.log(menuJSON.recipes[0]);
  populatePhotos(menuJSON.recipes);
  populateText(menuJSON.recipes);
}

function imgCreate(src) {
  var img = document.createElement("img");
  img.src = src;
  return img;
}

function populatePhotos(recipes) {
  var shuffledRecipes = shuffle(recipes);

  for (var i = 0; i < shuffledRecipes.length; i++) {
    var recipe = shuffledRecipes[i].recipe;
    var img = imgCreate("https:" + recipe.square_hi_res_image_url);
    answers[i] = recipe.id;
    img.setAttribute("data-key", i);
    document.getElementById("drop" + i).appendChild(img);
  }
}

function populateText(recipes) {
  var shuffledRecipes = shuffle(recipes);

  for (var i = 0; i < shuffledRecipes.length; i++) {
    var recipe = shuffledRecipes[i].recipe;
    var text = document.createTextNode(recipe.title);
    var li = document.getElementById("drag" + i);
    answers[i + 6] = recipe.id;
    li.setAttribute("data-key", i + 6);
    li.appendChild(text);
  }
}

function shuffle(arr) {
  for (var i = 0; i < arr.length; i++) {
    var j = Math.floor(Math.random() * i);
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

function allowDrop(ev) {
  if (isOccupied(ev)) { return false;}
  ev.preventDefault();
}

function isOccupied(ev) {
  return ev.target.nodeName === "DIV" || 
    ev.target.parentNode.lastChild.nodeName === "DIV" ;  
}

function drag(ev) {
  var data = {
    id: ev.target.id,
    key: ev.target.dataset.key
  }

  ev.dataTransfer.setData("text/plain", JSON.stringify(data));
}

function drop(ev) {
  var dragData = JSON.parse(ev.dataTransfer.getData("text/plain"));
  var el = document.getElementById(dragData.id);

  ev.preventDefault();

  el.setAttribute("class", "placed");
  ev.target.parentNode.appendChild(el);

  placed++;
  if (placed === 6) {
    evaluateBoard();
  }
}

function reset(ev) {
  var dragData = JSON.parse(ev.dataTransfer.getData("text/plain"));
  var el = document.getElementById(dragData.id);
  ev.preventDefault();
  el.className = "";
  ev.target.appendChild(el);
  placed--;
}

function evaluateBoard() {
  var ul = document.getElementById("recipe-photos");

  for (var i = 0; i < ul.children.length; i++) {
    var li = ul.children[i];
    var img = li.children[0];
    var div = li.children[1];

    if (answers[img.dataset.key] === answers[div.dataset.key]) {
      div.setAttribute("class", "right placed");
    } else {
      div.setAttribute("class", "wrong placed");
    }
  }
}
