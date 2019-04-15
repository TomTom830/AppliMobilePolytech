var Listeafaire = angular.module('ListeaFaire', []);

//$http variable pour faire les requtes entre client et serveur
function mainController($scope, $http) {
    $scope.formData69 = {};
    $scope.formListe = {};
    $scope.modifData = [];
    
    var auteur_cookie = document.cookie.split(';');
    auteur_cookie = auteur_cookie[0].substring(0,auteur_cookie[0].indexOf('='));

    var name_liste = "";


    $http.get('/getListSet')
    .success(function(data) {
        $scope.liste_de_liste = data;
    })
    .error(function(data){
        console.log('Error : ' + data);
    });



    $scope.DefineList = function(nom_liste){
        name_liste=nom_liste;

        $http.get('/getTaskSet/'+name_liste)
        .success(function(data) {
            $scope.laliste = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error : ' + data);
    });
    }


    //ajout d'une liste
    $scope.createListe = function(){
        $http.post('/creerListe',$scope.formListe)
        .success(function(data){
            $scope.formListe = {};
            $scope.liste_de_liste = data;
            console.log(data);
        })
        .error(function(data){
            console.log('Error : ' + data.errorCode);
        });
    };

    //rajout d'une donnée (appel à la fonction post dans server.js)
    $scope.createTodo = function() {

        data_sent = { 
            text: $scope.formData69.text, 
            creat: auteur_cookie,
            nom_liste : name_liste
        };

        $http.post('/addTask', data_sent)
            .success(function(data) {
                //vide la zone de saisie le '{}' initialise
                $scope.formData69 = {};
                $scope.laliste = data;
            })
            .error(function(data) {
                console.log('Error : ' + data.errorCode);
            }); 
    };

    $scope.DeleteList = function(name){
  
        if (auteur_cookie != ""){
            $http.delete('/delList/'+name)
            .success(function(data){
                $scope.liste_de_liste = data;
                $scope.laliste = {};
                console.log(data);
            })
            .error(function(data){
                console.log('Error : ' + data.errorCode);
            });
        }
        else{
            console.log("Error : NOT_CONNECTED");
        }
    }

    //rajout d'une donnée (appel à la fonction delete dans server.js)
    $scope.deleteTodo = function(id) {
        if (auteur_cookie != ""){
            $http.delete('/delTask/' +name_liste+'/'+ id)
                .success(function(data) {
                    $scope.laliste = data;
                })
                .error(function(data) {
                    console.log('Error : ' + data.errorCode);
                });
        }
        else{
            console.log("Error : NOT_CONNECTED");
        } 
    };

    $scope.updateTodo = function(id) {

        if (auteur_cookie != ""){
            var data_sent={text: $scope.modifData[id]};

            $http.put('/updTask/'+name_liste+'/'+ id, data_sent)
            .success(function(data){
                $scope.modifData[id] = [];
                $scope.laliste = data;
            })
            .error(function(data){
                console.log('Error : ' + data.errorCode);
            });
        }
        else{
            console.log("Error : NOT_CONNECTED");
        }
    };

    $scope.deconnexion = function(){
        document.cookie="";
        window.location.replace("/");
    }
}