var Helpers = (function() {

  var clear = function(id) {
    var els = document.getElementById(id).children;
    
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var children = el.childNodes;

      while(el.hasChildNodes()) {
        el.removeChild(el.firstChild);
      }
    }
  }

  var imgCreate = function(src) {
    var img = document.createElement("img");
    img.src = src;
    return img;
  }

  var shuffle = function(arr) {
    for (var i = 0; i < arr.length; i++) {
      var j = Math.floor(Math.random() * i);
      var temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    }
    return arr;
  }

  //sort by num correct then time
  var leaderSort = function(board) {
    return board.sort(function(x, y) {
      var n = y.correct - x.correct;
      if (n !== 0) {
        return n;
      }

      return x.elapsed.sec - y.elapsed.sec;
    });
  }

  return {
    clear: clear,
    imgCreate: imgCreate,
    shuffle: shuffle,
    leaderSort: leaderSort
  };

})();
