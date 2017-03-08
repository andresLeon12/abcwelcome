var myapp = angular.module('abcwelcome', [])
//var url_server = 'http://192.168.0.109:8080/';
var url_server = 'http://192.81.214.19:8080/';

/* Controlador para el login */
myapp.controller('loginCtrl', ['$scope', '$http', function($scope, $http){
	var usuario = localStorage.getItem('usuario');
	if (usuario != null) {
		window.location.href = 'views/home.html'
	}

	/* Funcion de login */
	$scope.login = function(){
		$(".error").empty();
		$http.post(url_server+"home/loginabc", $scope.datalogin).then(function(response) {
            if(response.data.status){
            	// Alamcenamos la información del usuario
            	localStorage.setItem("usuario", JSON.stringify(response.data.user));
				window.location.href = 'views/home.html';
            }else{
                $(".error").empty();
                $(".error").append('<div class="alert alert-danger" style="font-size:9pt;"><i class="fa fa-thumbs-up"></i> Error de Autenticación, verifique bien sus datos.</div>');
            }
        });
	}
}]);

//Contrlador principal
myapp.controller('homeCtrl', ['$scope', '$http', function($scope, $http){
	var usuario = localStorage.getItem("usuario")///----------------------------------nuevo|
	if (usuario == null) {
		window.location.href = '../index.html'
	}
    $scope.usuario = JSON.parse(usuario);// toda la informacion acerca del usuario
    //alert("User "+$scope.usuario._id);
    //traspaso
    $scope.traspasoSaldo = function(){

    	if( isNaN($scope.traspaso.USUCEL2) ) {
  			$(".message").html('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>Solo números para el campo de saldo.</div>');
            $(".message").css("display","block");
            return;
		}

        $scope.traspaso.USUCEL1 = $scope.usuario.USUCEL;
        $scope.traspaso.USUTIP = $scope.usuario.USUTIP;
        var data2 = {
        	USUCEL1: $scope.traspaso.USUCEL2
        }
        //$http.post(url_server+"home/loginabc", $scope.datalogin).then(function(response) {
		$http.post(url_server+"home/traspaso/",$scope.traspaso).then(function(response) {
        	if(response.data.status){
	            
	            localStorage.setItem("usuario", JSON.stringify(response.data.user));
	            $scope.usuario = response.data.user;

	            $(".message").html('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+response.data.message+'.</div>');
	            $(".message").css("display","block");
	            $scope.traspaso = {};
	            /*$http.get(url_server+"user/get/"+$scope.traspaso.USUCEL2).success(function(response){
					if(response.status){
						var mensaje = {
							iduser: response.user._id,
							title: "¡Abono de saldo!",
							message: "Has recargado $"+$scope.traspaso.USUSAL+" de saldo."
	                	}
						$http.post(url_server+"push/", mensaje);
					}
				});*/
          	}else{
            	$(".message").html('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'+response.data.message+'.</div>');
            	$(".message").css("display","block");
          	}
        });
    }
    verSaldo();
    function verSaldo(){
    	$http.get(url_server+"saldos_extern/"+$scope.usuario.USUCEL).then(function(response){
			if(response.data.status){
	    		$scope.saldo = response.data.saldo;
	      	}else{
	        	$scope.saldo = null;
      		}
	    });
	}

	$scope.saldoschange = function() {
		$scope.message = "";
		if( isNaN($scope.data.anio)) {
  			$scope.message = "Ingrese un año válido.";
  			return;
		}
	    $scope.data.USUCEL = $scope.usuario.USUCEL;
	    $http.post(url_server+"saldos_extern", $scope.data).then(function(response){
	      if(response.data.status){
	        $scope.saldo = response.data.saldo;
	      }else{
	        $scope.saldo = null;
	        if (response.data.message) {
	          $scope.message = response.data.message;
	        }
	      }
	    });
	  }

  $scope.veractual = function() {
  	$scope.message = "";
    verSaldo();
  }
	vermovimientos();

	// Ver saldos y movimientos
	function vermovimientos() {
	    $http.get(url_server+"movimientos_extern/"+$scope.usuario.USUCEL).then(function(response){
			if(response.data.status){
				//$scope.movimientos = response.data.movimientos;
				for (var i = 0 ; i < response.data.movimientos.length ; i++) {
					newFecha = response.data.movimientos[i].MOVFEC.split("T");
					response.data.movimientos[i].MOVFEC = newFecha[0];
	        	}
	        	$scope.movimientos = response.data.movimientos;
			}else{
				$scope.movimientos = null;
				if (response.data.message) {
					$scope.message = response.data.message;
				}
			}
		});
	}

  $scope.movimientoschange = function() {
  	$scope.message = "";
  	//alert("mes "+$scope.data.mes);
  	//return;
  	if( isNaN($scope.data.anio)) {
  		//$(".message").html('<b stle="color:red;">Ingrese un año válido.</b>');
        //$(".message").css("display","block");
        $scope.message = "Ingrese un año válido.";
        return;
	}
    $scope.data.USUCEL = $scope.usuario.USUCEL;
    $http.get(url_server+"movimientos_extern/"+$scope.data.mes+"/"+$scope.data.anio+"/"+$scope.data.USUCEL).then(function(response){
      if(response.data.status){
      	for (var i = 0 ; i < response.data.movimientos.length ; i++) {
			newFecha = response.data.movimientos[i].MOVFEC.split("T");
			response.data.movimientos[i].MOVFEC = newFecha[0];
	    }
        $scope.movimientos = response.data.movimientos;
      }else{
        $scope.movimientos = null;
        if (response.data.message) {
          $scope.message = response.data.message;
        }
      }
    });
  }

  $scope.veractualm = function() {
  	$scope.message = "";
    vermovimientos();
  }

  $scope.logout = function(){
  	localStorage.removeItem("usuario")
    window.location.href = '../../index.html'
  }

}]);
