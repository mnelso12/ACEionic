//setup angular
var app = angular.module('scotch-todo', ['ionic', 'LocalStorageModule']);

app.config(function (localStorageServiceProvider) {
    localStorageServiceProvider
      .setPrefix('scotch-todo');
  });

app.controller('main', function ($scope, $ionicModal, $http, localStorageService) { //store the entities name in a variable 
	var taskData = 'task';


//////////////// HTTP /////////////////////////////////
	/*
	$http({
		method : "GET",
		url : "http://devace2.cloudaccess.net/index.php/endpoint?action=get&module=zoo&resource=items&app=8&id=7512"
	}).then(function mySucces(response) {
		console.log('successfully got:', response.data);
		alert("GOT DATA!!!", response);
	}, function myError(response) {
		console.log('failed, so:', response.statusText);
		alert("It didnt work but maybe next time!", response);
	});
	*/
	$http.get('http://devace2.cloudaccess.net/index.php/endpoint?action=get&module=zoo&resource=items&app=8&id=7512')
		.then(function(data) {
			//console.log('Got some data: ' +  data);
			alert("blog response status" + data.statusText);
			//alert("GOT DATA!!!" + data);
			//alert(data);
			try {
				//var json_obj = $.parseJSON(data);
				//alert(data["status"]);
				//alert(data["data"]);
				//data, status, headers, config, statusText
				//status, id, name, alias, application_id, type, created, created_by, modified, modified_by, publish_up, publish_down, priority, state, searchable, access, hits, metadata_title, metadata_description, metadata_keywords, metadata_robots, metadata_author, enable_comments, primary_category, elements   
				// identifier, type, data

				$("#blogTitle").text(data["data"]["name"]);
				var oldBlog = data["data"]["elements"]["2e3c9e69-1f9e-4647-8d13-4e88094d2790"]["data"][0]["value"] + data["data"]["elements"]["2e3c9e69-1f9e-4647-8d13-4e88094d2790"]["data"][1]["value"];
				var parsedBlog = oldBlog.replace(/<(?:.|\n)*?>/gm, ''); 
				$("#blogContent").text(parsedBlog);
			
				// set blog image
				var pathToImage = "https://ace.nd.edu/";
				pathToImage += data["data"]["elements"]["0e1e0d6b-2cd7-412e-85ab-f01cca361a22"]["data"]["file"]; 
				alert(pathToImage);

				//$("#blogImage").attr('src', pathToImage);

			}
			catch(e) {
				//alert("parsing error: " + e);
				alert('printing data["status"] didnt work');
			}

			$scope.tfblog = data["id"]; 
			alert('after stuff')
			return data;
		});

//////////////// XHR /////////////////////////////////

	// Create the XHR object.
	function createCORSRequest(method, url) {
		var xhr = new XMLHttpRequest();
		if ("withCredentials" in xhr) {
			// XHR for Chrome/Firefox/Opera/Safari.
			xhr.open(method, url, true);
		} else if (typeof XDomainRequest != "undefined") {
			// XDomainRequest for IE.
			xhr = new XDomainRequest();
			xhr.open(method, url);
		} else {
			// CORS not supported.
			xhr = null;
		}
		return xhr;
	}

	// Helper method to parse the title tag from the response.
	function getTitle(text) {
		return text.match('<title>(.*)?</title>')[1];
	}


//	makeCorsRequest();

	// Make the actual CORS request.
	function makeCorsRequest() {
		// This is a sample server that supports CORS.
		var url = 'http://devace2.cloudaccess.net/index.php/endpoint?action=get&module=zoo&resource=items&app=8&id=7512';
		//var url = 'http://html5rocks-cors.s3-website-us-east-1.amazonaws.com/index.html';

		var xhr = createCORSRequest('GET', url);
		if (!xhr) {
			alert('CORS not supported');
			return;
		}

		// Response handlers.
		xhr.onload = function() {
			var text = xhr.responseText;
			var title = getTitle(text);
			alert('WOOOO Response from CORS request to ' + url + ': ' + title);
		};

		xhr.onerror = function() {
			alert('Woops, there was an error making the request:', xhr.status);
		};

		xhr.send();
	}







//initialize the tasks scope with empty array
$scope.tasks = [];

//initialize the task scope with empty object
$scope.task = {};

//configure the ionic modal before use
$ionicModal.fromTemplateUrl('new-task-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
}).then(function (modal) {
    $scope.newTaskModal = modal;
});
//
$scope.openTaskModal = function() {
	console.log('opening modal');
    $scope.newTaskModal.show();
  };

$scope.closeTaskModal = function() {
	console.log('closing modal');
    $scope.newTaskModal.hide();
  };

$scope.getTasks = function () {

	console.log("getting tasks");
	console.log("task data:", taskData);

    //fetches task from local storage
	if (localStorageService.get(taskData)) {
              $scope.tasks = localStorageService.get(taskData);
          } else {
              $scope.tasks = [];
          }
}
$scope.createTask = function () {

	console.log('creating task');

    //creates a new task
          $scope.tasks.push($scope.task);
          localStorageService.set(taskData, $scope.tasks);
          $scope.task = {};
          //close new task modal
          $scope.newTaskModal.hide();
}

$scope.removeTask = function () {
	
	console.log('removing task');
	
	//removes a task
		$scope.tasks.splice(index, 1);
          localStorageService.set(taskData, $scope.tasks);
}

$scope.completeTask = function () {

	console.log("marking task as complete");

    //updates a task as completed
if (index !== -1) {
  $scope.tasks[index].completed = true; 
 } 

  localStorageService.set(taskData, $scope.tasks); 

}

})
