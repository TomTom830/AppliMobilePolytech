var Listeafaire = angular.module('Laconnexion', []);

document.addEventListener( "DOMContentLoaded", debut);

function debut(){
    console.log("doc chargé");
}

function mainController($scope, $http) {
    
    $scope.InfoUser={}

    supprime_les_cookies();

    $scope.connexion = function(req, res){
        
        $http.post('/Connect',$scope.InfoUser)
        .success(function(data){
            faire_cookie($scope.InfoUser.id);
            document.getElementsByClassName("message_erreur")[0].style.visibility="hidden";
            $scope.InfoUser = {};
            window.location.replace(data.url);
        })
        .error(function(data){
            console.log("error : " + data.errorCode);
            document.getElementsByClassName("message_erreur")[0].style.visibility="visible";
        });
    }

    $scope.inscrire = function(){
        $http.get('/goSinscrire')
        .success(function(red) {
            console.log("ok");
            window.location.replace(red);
        })
        .error(function(red) {
            console.log("error");
        });
    }

    $scope.page_connexion = function(){
        window.location.replace("connect.html");
    }

    $scope.ajout_utilisateur= function(){
        document.getElementsByClassName("message_dejapris")[0].style.visibility="hidden";
        document.getElementsByClassName("message_paspris")[0].style.visibility="hidden";
        document.getElementsByClassName("message_param")[0].style.visibility="hidden";
        $http.post('/addUser',$scope.InfoUser)
        .success(function(data){
            $scope.InfoUser={};
            console.log("ok");
            document.getElementsByClassName("message_paspris")[0].style.visibility="visible";
        })
        .error(function(data){
            
            console.log("error : "+ data.errorCode);
            if(data.errorCode.localeCompare("USER_ALREADY_REGISTRED") == 0){
                document.getElementsByClassName("message_dejapris")[0].style.visibility="visible";
            }
            else if(data.errorCode.localeCompare("MISSING PARAM") == 0){
                document.getElementsByClassName("message_param")[0].style.visibility="visible";
            }
        });
    }

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
}