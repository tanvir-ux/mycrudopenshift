function ServiceController($scope, $http)
{
	console.log("Hello from Serv Ctrl");


	
	$scope.create = function () {
		console.log($scope.serviceClient);
		$http.post("/serviceClients", $scope.serviceClient )
		.success(function (response) { 
			$scope.all(); 
		});
	}; // aah! surprising the semi-colons affect the flow of the program [:o]

	$scope.renderServiceClients = function (response) {
		$scope.serviceClients = response;
	};


   $scope.remove = function (id) {
   	//console.log(id);
   		$http.delete("/serviceClients/" + id)
   		.success(function (response) { 
			$scope.all(); 
		});
   };

   $scope.select = function (id) {
	   //	console.log(id);
	   $http.get("/serviceClients/" + id)
	   .success(function (response) 
	   {
	   	    $scope.serviceClient = response;
	   		//console.log(response);
	   });
   };

   $scope.update = function () {
   		console.log($scope.serviceClient);
   		$http.put("/serviceClients/" + $scope.serviceClient._id, $scope.serviceClient)
   		.success(function (response) {
   			$scope.all();
   		});
   };


   $scope.all = function() 
                   {
						// get all
						$http.get("/serviceClients")
						.success($scope.renderServiceClients);
					}

   $scope.all();

};