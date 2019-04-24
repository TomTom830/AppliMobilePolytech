angular.module('todo', ['ionic'])

.controller('TodoCtrl', function($scope, $http, $ionicModal, $ionicSideMenuDelegate) {
  $scope.tasks = {};
  $scope.new = {};
  $scope.liste_de_liste = {};
  $scope.task = {};
  $scope.InfoUser = {};
  var name_liste = "";

  var auteur_cookie = document.cookie.split(';');
  auteur_cookie = auteur_cookie[0].substring(0,auteur_cookie[0].indexOf('='));


  $http.get('/getListSet')
  .success(function(data) {
    console.log(data);
      $scope.liste_de_liste = data;
  })
  .error(function(data){
      console.log('Error : ' + data);
  });

  // Create and load the Modal
  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });


  // Create and load the Modal
  $ionicModal.fromTemplateUrl('new-list.html', function(modal) {
    $scope.taskModal_liste = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $ionicModal.fromTemplateUrl('connect.html', function(modal) {
    $scope.taskModal_connect = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.selectListe = function(liste, index) {
    
    $http.get('/getTaskSet/'+liste.nom_liste)
    .success(function(data) {
        name_liste = liste.nom_liste;
        $scope.laliste = data;
        console.log(data);
    })
    .error(function(data) {
        console.log('Error : ' + data);
    });
    $ionicSideMenuDelegate.toggleLeft(false);

  };


  $scope.toggleProjects = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  // Called when the form is submitted
  $scope.createTask = function() {
  
    data_sent = { 
      text: $scope.task.name, 
      creat: auteur_cookie,
      nom_liste : name_liste
    };

    $http.post('/addTask', data_sent)
      .success(function(data) {
          $scope.taskModal.hide();
          $scope.task = {};
          $scope.laliste = data;
          document.getElementsByClassName("erreur_liste")[0].style.display="none";
      })
      .error(function(data) {
          console.log('Error : ' + data.errorCode);
          document.getElementsByClassName("erreur_liste")[0].style.display="inline";
          document.getElementsByClassName("erreur_liste")[0].innerHTML=data.errorCode;
      });
  };


  $scope.createList = function(){
    $http.post('/creerListe',$scope.task)
        .success(function(data){
            $scope.task = {};
            $scope.liste_de_liste = data;
            console.log(data);
            $scope.taskModal_liste.hide();
        })
        .error(function(data){
            console.log('Error : ' + data.errorCode);
        });
  }



  $scope.deleteTask = function(id) {
    $http.delete('/delTask/' +name_liste+'/'+ id)
    .success(function(data) {
        $scope.laliste = data;
    })
    .error(function(data) {
        console.log('Error : ' + data);
    });
  };

$scope.connexion = function(req, res){
        
  $http.post('/Connect',$scope.InfoUser)
  .success(function(data){
      faire_cookie($scope.InfoUser.id);
      document.getElementsByClassName("erreur_co")[0].style.display="none";
      document.getElementsByClassName("jesuisco")[0].style.display="inline";
      document.getElementsByClassName("pasco")[0].style.display="none";
      document.getElementsByClassName("erreur_ins")[0].style.display="none";
      auteur_cookie=$scope.InfoUser.id;
      $scope.InfoUser = {};
      $scope.taskModal_connect.hide();
      //window.location.replace(data.url);
  })
  .error(function(data){
      console.log("error : " + data.errorCode);
      document.getElementsByClassName("erreur_co")[0].style.display="inline";
      document.getElementsByClassName("erreur_ins")[0].style.display="none";
      document.getElementsByClassName("erreur_co")[0].innerHTML=data.errorCode;
  });
}



$scope.ajout_utilisateur= function(){
  //document.getElementsByClassName("message_dejapris")[0].style.visibility="hidden";
  //document.getElementsByClassName("message_paspris")[0].style.visibility="hidden";
  //document.getElementsByClassName("message_param")[0].style.visibility="hidden";
  $http.post('/addUser',$scope.InfoUser)
  .success(function(data){
      $scope.InfoUser={};
      console.log("ok");
      document.getElementsByClassName("erreur_ins")[0].style.display="none";
      document.getElementsByClassName("erreur_co")[0].style.display="none";
      //document.getElementsByClassName("message_paspris")[0].style.visibility="visible";
  })
  .error(function(data){
      
      console.log("error : "+ data.errorCode);
      document.getElementsByClassName("erreur_ins")[0].style.display="inline";
      document.getElementsByClassName("erreur_co")[0].style.display="none";
      document.getElementsByClassName("erreur_ins")[0].innerHTML=data.errorCode;
  });
}





$scope.deconnexion = function(){
  supprime_les_cookies();
  auteur_cookie="";
  document.getElementsByClassName("jesuisco")[0].style.display="none";
  document.getElementsByClassName("pasco")[0].style.display="inline";
}

  // Open our new task modal
  $scope.newTask = function() {
    $scope.taskModal.show();
  };

  // Close the new task modal
  $scope.closeNewTask = function() {
    $scope.taskModal.hide();
  };

  $scope.newList = function() {
    $scope.taskModal_liste.show();
  };

  $scope.closeNewList = function() {
    $scope.taskModal_liste.hide();
  };

  $scope.PageConnect = function() {
    $scope.taskModal_connect.show();
    if(auteur_cookie!=""){
      document.getElementsByClassName("jesuisco")[0].style.display="inline";
      document.getElementsByClassName("pasco")[0].style.display="none";
    }
    else{
      document.getElementsByClassName("jesuisco")[0].style.display="none";
      document.getElementsByClassName("pasco")[0].style.display="inline";
    }
    
  }

  $scope.closeConnect = function() {
    $scope.taskModal_connect.hide();
  }

})













function creerCookie(nom,valeur,jour){
  //Si les jours ont bien été définis
  if (jour){
      //On crée un objet date stockant la date actuelle
      var date = new Date();
      /*On définit la date d'expiration du cookie -
       *Pour cela, on calcule dans combien de millisecondes
       *le cookie va expirer et on utilise setTime()*/
      date.setTime(date.getTime()+(jour*24*60*60*1000));
      //On met la date au "bon" format pour un cookie
      var exp = '; expires='+date.toGMTString();
  }
  //Si les jours n'ont pas été définis, pas besoin de calcul
  else var exp = '';
  document.cookie = nom+'='+valeur+exp+'; path=/';
}

function lireCookie(nom){
  //On récupère le nom du cookie et le signe "="
  var nomEtEgal = nom + '=';
  //Récupère tous les cookies dans un tableau
  var cTableau = document.cookie.split(';');
  //Parcourt le tableau créé
  for(var i=0;i<cTableau.length;i++){
      //On récupère tous les noms et valeurs des cookies
      var c = cTableau[i];
      /*On supprime les espaces potentiels contenus dans c jusqu'à
       *tomber sur le nom d'un cookie*/
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      /*Maintenant, on cherche le nom correspondant au cookie voulu.
       *Dès qu'on l'a trouvé, on n'a plus qu'à récupérer la valeur
       *correspondante qui se situe juste après le nom*/
      if (c.indexOf(nomEtEgal) == 0) return c.substring(nomEtEgal.length,c.length);
  }
  //Si nous n'avons pas trouvé le nom du cookie, c'est qu'il n'existe pas
  return null;
}


function supprimerCookie(nom){
  /*On donne le nom du cookie à supprimer, puis on utilise creerCookie()
   *pour indiquer une date d'expiration passée pour notre cookie*/
  creerCookie(nom,'',-1);
}

function supprime_les_cookies(){
  var cTableau = document.cookie.split(';');

  for(var i=0;i<cTableau.length;i++){
      supprimerCookie(cTableau[i].substring(0,cTableau[i].indexOf('=')));
  }
}

faire_cookie= function (nom){
  creerCookie(nom, "default_value", 1);  
}    