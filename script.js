function clear(id) {
  var els = document.getElementById(id).children;
  
  for (var i = 0; i < els.length; i++) {
    var el = els[i];
    var children = el.childNodes;

    while(el.hasChildNodes()) {
      el.removeChild(el.firstChild);
    }
  }
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
  var recipeLI = document.getElementById("recipe-names").children;

  for (var i = 0; i < shuffledRecipes.length; i++) {
    var recipe = shuffledRecipes[i].recipe;
    
    var div = document.createElement("div");
    var titleParts = recipe.title.split("with"); 
    var span = document.createElement("span");
    span.innerHTML = titleParts[0];

    div.innerHTML = span.outerHTML + "with" + titleParts[1];
    div.setAttribute("id", "drag" + i);
    div.setAttribute("draggable", "true");
    div.setAttribute("ondragStart", "drag(event)"); 
    
    div.setAttribute("data-key", i + 6);
    answers[i + 6] = recipe.id;

    recipeLI[i].appendChild(div);
  }
}

function populateLeaderBoard() {
  //we want to populate up to 5 times
  var n = (leaderBoard.length > 5 ? 5 : leaderBoard.length);
  var boardEl = document.getElementById("leaderboard");

  for (var i = 0; i < n; i++) {
    var div = document.createElement("div");
    var entry = leaderBoard[i];
    div.innerHTML = entry.correct + " - " + entry.elapsed.text;
    boardEl.children[i].appendChild(div);
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

function startTimer() {
  var timer = document.getElementById("timer");
  var duration = 60 * 2;
  timerInterval = setInterval(function() {
    duration--;
    timer.textContent = calcTimeText(duration);
    
    if (duration <= 0) {
      gameOver = true;
      clearInterval(timerInterval);
      if(confirm("Sorry, time's up! Play again?")) {
        reset();
      }
    }
  }, 1000);
}

function allowDrop(ev) {
  if (isOccupied(ev)) { return false;}
  if (gameOver) { return false; }
  ev.preventDefault();
}

function isOccupied(ev) {
//can't drop on another label or an image with a label in it
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

function returnHome(ev) {
  var dragData = JSON.parse(ev.dataTransfer.getData("text/plain"));
  var el = document.getElementById(dragData.id);
  ev.preventDefault();
  el.className = "";
  ev.target.appendChild(el);
  placed--;
}

function evaluateBoard() {
  var ul = document.getElementById("recipe-photos");
  var correct = 0;
  gameOver = true;
  clearInterval(timerInterval);

  for (var i = 0; i < ul.children.length; i++) {
    var li = ul.children[i];
    var img = li.children[0];
    var div = li.children[1];

    if (answers[img.dataset.key] === answers[div.dataset.key]) {
      div.setAttribute("class", "right placed");
      correct++;
    } else {
      div.setAttribute("class", "wrong placed");
    }
  }

  var timeText = document.getElementById("timer").textContent;
  var elapsed = calcTime(timeText);

  var score = {
    correct: correct,
    elapsed: elapsed 
  };

  leaderBoard.push(score);
  localStorage["leaderBoard"] = JSON.stringify(sortLeaderBoard(leaderBoard));

  var confText = "You got " + correct + " right. That puts you on par with a " +
    evalText[correct] + "! Play again?";
  
  if(confirm(confText)) {
    reset();
  }
}

function calcTime(text) {
  var vals = text.split(":");
  var seconds = (parseInt(vals[0]) * 60) + parseInt(vals[1]);
  var elapsed = (60 * 2) - seconds;

  return {
    sec: elapsed, 
    text: calcTimeText(elapsed)
  };
}

function calcTimeText(duration) {
  var minutes = parseInt(duration / 60, 10);
  var seconds = parseInt(duration % 60, 10);

  seconds = seconds < 10 ? "0" + seconds : seconds;
  return minutes + ":" + seconds;
}

//sort by num correct then time
function sortLeaderBoard(board) {
  return board.sort(function(x, y) {
    var n = y.correct - x.correct;
    if (n !== 0) {
      return n;
    }

    return x.elapsed.sec - y.elapsed.sec;
  });
}
