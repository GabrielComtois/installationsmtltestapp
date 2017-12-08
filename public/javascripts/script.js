function fetch() {
  var id = document.getElementById('champ-arrondissement').value;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/installations/?arrondissement=" + id, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        var objectArray = JSON.parse(xhr.responseText);
        if(objectArray.length==0){
          document.getElementById("left-list").innerHTML="Aucun Resultat";
        }else{
          document.getElementById("left-list").innerHTML="";
          for(object in objectArray){
            var node = document.createElement("p");
            var textnode = document.createTextNode(objectArray[object].nom);
            node.appendChild(textnode); 
            document.getElementById("left-list").appendChild(node);
          }
        }
      } else {
        alert('Erreur');
      }
    }
  };
  xhr.send();
}
function list(){
   var id = document.getElementById('choix-installation').value;
      id =id.replace(/\s/g, '+');
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "/installations/?nom=" + id, true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            var objectArray = JSON.parse(xhr.responseText);
            if(objectArray.length==0){
              document.getElementById("right-list").innerHTML="Aucun Resultat";
            }else{
              document.getElementById("right-list").innerHTML="";
              for(object in objectArray){
                var node = document.createElement("p");
                var textnode = document.createTextNode(JSON.stringify(objectArray[object]));
                node.appendChild(textnode); 
                document.getElementById("right-list").appendChild(node);
              }
            }
          } else {
            alert('Erreur');
          }
        }
       };
      xhr.send();
}