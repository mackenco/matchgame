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


