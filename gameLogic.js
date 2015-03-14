var placed = 0;
var answers = {};
var evalText = {
  0: "dorm room frat bro",
  1: "McDonald's burger flipper",
  2: "greasy spoon line cook",
  3: "24-hour hash slinger", 
  4: "up and coming sous chef",
  5: "highly Instagrammed Brooklyn culinary artist",
  6: "3-star Michelin chef"
}
var gameOver = false;
var leaderBoard = localStorage["leaderBoard"] || "[]";
var timerInterval;
leaderBoard = JSON.parse(leaderBoard);

window.onload = function() {
  setUpBoard();
};

function setUpBoard() {
  var menuJSON = json.two_person_plan;
  populatePhotos(menuJSON.recipes);
  populateText(menuJSON.recipes);
  populateLeaderBoard();
  gameOver = false;
  document.getElementById("timer").textContent = "2:00";
  startTimer();
}

function reset() {
  answers = {};
  placed = 0;
  clear("recipe-photos");
  clear("recipe-names");
  clear("leaderboard");
  setUpBoard();
}
