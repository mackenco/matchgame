window.onload = function() {
  Board.create();
};

var Game = (function() {
  var leaderBoard = localStorage["leaderBoard"] || "[]";

  return {
    placed: 0,
    answers: {},
    evalText: {
      0: "dorm room frat bro",
      1: "McDonald's burger flipper",
      2: "greasy spoon line cook",
      3: "24-hour hash slinger", 
      4: "up and coming sous chef",
      5: "highly Instagrammed Brooklyn culinary artist",
      6: "3-star Michelin chef"
    },
    gameOver: false,
    leaderBoard: JSON.parse(leaderBoard),
    timerInterval: null
  };

})();
