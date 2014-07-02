var globoApp = angular.module('globoApp', []);

globoApp.controller('index', function index($scope, $http, $anchorScroll){

  $scope.username = 'globocom'
  $scope.reposFound = false;
  $scope.moreCommit = false;
  var reposPage = 0
  var commitsPage = 0

  function loadRepositories(){
    reposPage += 1
    $http.get("https://api.github.com/users/" + $scope.username + "/repos?page=" + reposPage + "&per_page=100").success(function (data) {
      $scope.reposFound = data.length > 0;
      if ($scope.reposFound) {
        $scope.partalRepositories = data.concat($scope.partalRepositories);
        loadRepositories();
      }
    });
    
    $scope.repositories = $scope.partalRepositories
  }

  $scope.openProject = function(repositoryName){
    commitsPage = 1

    // Get Repositories
    $http.get("https://api.github.com/repos/" + $scope.username + "/" + repositoryName).success(function (data) {
      $scope.repository = data;
    });

    // Get page 1 of commit's repository
    $http.get("https://api.github.com/repos/" + $scope.username + "/" + repositoryName + "/commits?page=" + commitsPage + "&per_page=20").success(function (data) {
      $scope.commits = data;
      $scope.moreCommits = data.length > 0 && data.length >= 20;
      commitsPage += 1;
    });

  }

  $scope.getMoreCommits = function(){
    $scope.loadingMoreCommits = true
    $scope.moreCommits = false
    $http.get("https://api.github.com/repos/" + $scope.username + "/" + $scope.repository.name + "/commits?page=" + commitsPage + "&per_page=20").success(function (data) {
      $scope.moreCommits = data.length > 0 && data.length >= 20;
      $scope.loadingMoreCommits = false;
      var commits = $scope.commits;
      $scope.commits = commits.concat(data);
      commitsPage += 1
    });
  }

  loadRepositories();

})
