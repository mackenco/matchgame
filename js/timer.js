var Timer = (function() {

  var startTimer = function() {
    var timer = document.getElementById("timer");
    var duration = 60 * 2;
    Game.timerInterval = setInterval(function() {
      duration--;
      timer.textContent = _calcTimeText(duration);
      
      if (duration <= 0) {
        gameOver = true;
        clearInterval(Game.timerInterval);
        if(confirm("Sorry, time's up! Play again?")) {
          Board.reset();
        }
      }
    }, 1000);
  }

  var calcTime = function(text) {
    var vals = text.split(":");
    var seconds = (parseInt(vals[0]) * 60) + parseInt(vals[1]);
    var elapsed = (60 * 2) - seconds;

    return {
      sec: elapsed, 
      text: _calcTimeText(elapsed)
    };
  }

  var _calcTimeText = function(duration) {
    var minutes = parseInt(duration / 60, 10);
    var seconds = parseInt(duration % 60, 10);

    seconds = seconds < 10 ? "0" + seconds : seconds;
    return minutes + ":" + seconds;
  }

  return {
    startTimer: startTimer,
    calcTime: calcTime
  };

})();
