var placed = 0;

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
    var child = el.firstChild;

    child.nodeName === "IMG" ? el.removeChild(child) : child.innerHTML = "";
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
    img.setAttribute("data-baid", recipe.id);
    document.getElementById("drop" + i).appendChild(img);
  }
}

function populateText(recipes) {
  var shuffledRecipes = shuffle(recipes);

  for (var i = 0; i < shuffledRecipes.length; i++) {
    var recipe = shuffledRecipes[i].recipe;
    var text = document.createTextNode(recipe.title);
    var li = document.getElementById("drag" + i);
    li.setAttribute("data-baid", recipe.id);
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
  ev.preventDefault();
}

function drag(ev) {
  var data = {
    id: ev.target.id,
    baid: ev.target.dataset.baid
  }

  ev.dataTransfer.setData("text/plain", JSON.stringify(data));
}

function drop(ev) {
  var dragData = JSON.parse(ev.dataTransfer.getData("text/plain"));
  var dragBaid = dragData.baid;
  var dropBaid = ev.target.dataset.baid;
  if (dragBaid === dropBaid) {
    console.log("its a match"); 
  } else {
    return false;
  }
  ev.preventDefault();

  //return false to indicate this is the wrong one
  var el = document.getElementById(dragData.id);
  el.style.position = "absolute";
  el.setAttribute("class", "placed");
  console.log(el);
  ev.target.parentNode.appendChild(document.getElementById(dragData.id));
}
