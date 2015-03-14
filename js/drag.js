var Drag = (function() {

  var allowDrop = function(ev) {
    if (_isOccupied(ev)) { return false; }
    if (Game.over) { return false; }

    ev.preventDefault();
  }

  var _isOccupied = function(ev) {
  //can't drop on another label or an image with a label in it
    return ev.target.nodeName === "DIV" || 
      ev.target.nodeName === "SPAN" ||
      ev.target.parentNode.lastChild.nodeName === "DIV" ;  
  }

  var drag = function(ev) {
    var data = {
      id: ev.target.id,
      fromIMG: ev.target.parentNode.firstChild.nodeName === "IMG"
    }

    ev.dataTransfer.setData("text/plain", JSON.stringify(data));
  }

  var drop = function(ev) {
    var dragData = JSON.parse(ev.dataTransfer.getData("text/plain"));
    var el = document.getElementById(dragData.id);

    ev.preventDefault();

    el.setAttribute("class", "placed");
    ev.target.parentNode.appendChild(el);

    if (!dragData.fromIMG) { Game.placed++; }

    if (Game.placed === 6) { Board.evaluate(); }
  }

  var returnHome = function(ev) {
    var dragData = JSON.parse(ev.dataTransfer.getData("text/plain"));
    var el = document.getElementById(dragData.id);
    ev.preventDefault();
    el.className = "";
    ev.target.appendChild(el);
    Game.placed--;
  }

   return {
    drag: drag,
    drop: drop,
    allowDrop: allowDrop,
    returnHome: returnHome
  };

})();
