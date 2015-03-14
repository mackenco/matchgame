var Board = (function() {

  var create = function() {
    var menuJSON = json.two_person_plan;
    _populatePhotos(menuJSON.recipes);
    _populateText(menuJSON.recipes);
    _populateLeaderBoard();
    gameOver = false;
    document.getElementById("timer").textContent = "2:00";
    Timer.startTimer();
  }

  var reset = function() {
    Game.answers = {};
    Game.placed = 0;
    Helpers.clear("recipe-photos");
    Helpers.clear("recipe-names");
    Helpers.clear("leaderboard");
    setUpBoard();
  }

  var _populatePhotos = function(recipes) {
    var shuffledRecipes = Helpers.shuffle(recipes);

    for (var i = 0; i < shuffledRecipes.length; i++) {
      var recipe = shuffledRecipes[i].recipe;
      var img = Helpers.imgCreate("https:" + recipe.square_hi_res_image_url);
      Game.answers[i] = recipe.id;
      img.setAttribute("data-key", i);
      document.getElementById("drop" + i).appendChild(img);
    }
  }

  var _populateText = function(recipes) {
    var shuffledRecipes = Helpers.shuffle(recipes);
    var recipeLI = document.getElementById("recipe-names").children;

    for (var i = 0; i < shuffledRecipes.length; i++) {
      var recipe = shuffledRecipes[i].recipe;
      var div = _buildDiv(recipe, i);
      Game.answers[i + 6] = recipe.id;

      recipeLI[i].appendChild(div);
    }
  }

  var _buildDiv = function(recipe, i) {
    var div = document.createElement("div");
    var titleParts = recipe.title.split("with"); 
    var span = document.createElement("span");
    span.innerHTML = titleParts[0];

    div.innerHTML = span.outerHTML + "with" + titleParts[1];
    div.setAttribute("id", "drag" + i);
    div.setAttribute("draggable", "true");
    div.setAttribute("ondragStart", "Drag.drag(event)"); 
          
    div.setAttribute("data-key", i + 6);
    return div;
  }

  var _populateLeaderBoard = function() {
    //we want to populate up to 5 times
    var n = (Game.leaderBoard.length > 5 ? 5 : Game.leaderBoard.length);
    var boardEl = document.getElementById("leaderboard");

    for (var i = 0; i < n; i++) {
      var div = document.createElement("div");
      var entry = Game.leaderBoard[i];
      div.innerHTML = entry.correct + " - " + entry.elapsed.text;
      boardEl.children[i].appendChild(div);
    }
  }

  var evaluate = function() {
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
    localStorage["leaderBoard"] = JSON.stringify(Helpers.leaderSort(leaderBoard));

    var confText = "You got " + correct + " right. That puts you on par with a " +
      evalText[correct] + "! Play again?";
    
    if(confirm(confText)) {
      reset();
    }
  }

  return {
    create: create,
    reset: reset,
    evaluate: evaluate
  };

})();
