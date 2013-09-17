var TodoApp = angular.module("TodoApp", ["ngResource"]).
    config(function ($routeProvider) {
        $routeProvider.
            when('/', { controller: ListCtrl, templateUrl: 'list.html' }).
            when('/new', { controller: CreateCtrl, templateUrl: 'details.html' }).
           when('/edit/:editId', { controller: EditCtrl, templateUrl: 'details.html' }).
            otherwise({ redirectTo: '/' });

    });

TodoApp.directive('ngfieldheader', function () {
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        template: '<span><a ng-click="$parent.sort(value)" ng-transclude></a> '
            + ' <span ng-show="$parent.sort_order==value && $parent.desc==false"><i class="glyphicon glyphicon-arrow-down"></i></span>'
        + ' <span ng-show="$parent.sort_order==value && $parent.desc==true"><i class="glyphicon glyphicon-arrow-up"></i></span></span>',
        scope: {
            value: "@myfield",
        }
       
    }
});
-

TodoApp.factory('Todo', function ($resource) {
    return $resource('/api/Todo/:id', { id: '@id' }, { update: { method: 'PUT' } });
});


var ListCtrl = function ($scope, $location, Todo) {
    $scope.search = function () {
        Todo.query({ q:$scope.query, sort: $scope.sort_order, desc: $scope.desc, offset: $scope.offset, limit: $scope.limit }, function (data) {

            $scope.items = $scope.items.concat(data);
            $scope.more = (data.length == $scope.limit);

        });
    };

    $scope.sort = function (col) {
        if ($scope.sort_order == col) {
            $scope.desc = !$scope.desc;
        }
        else $scope.desc = false;

        $scope.sort_order = col;
        $scope.reset();

    };

    $scope.show_more = function () {
        $scope.offset += $scope.limit;


        $scope.search();
    };

    $scope.reset = function () {

        $scope.limit = 10;
        $scope.offset = 0;
        $scope.items = [];
        $scope.more = true;

        $scope.search();
    };

    $scope.delete = function () {

        var id = this.item.ID;
        
        Todo.delete({ ID: id },
            function ()
            {
                $('#todo_'+id).fadeOut();
            }
            );
        
    };

    $scope.go = function () {
        var id = this.item.ID;
        $location.path('/edit/'+id);
    }

    $scope.sort_order = 'Priority';
    $scope.desc = false;
    $scope.reset();

};


var CreateCtrl = function ($scope, $location, Todo) {
    $scope.action = "Add";
    $scope.save = function () {
        Todo.save($scope.item, function () {
                $location.path('/');
            });

    };
};

var EditCtrl = function ($scope, $location, $routeParams, Todo) {

    var id = $routeParams.editId;
    $scope.item = Todo.get({ ID: id });
    $scope.action = "Update";
    $scope.save = function () {
        Todo.update({ ID: id },$scope.item, function () {
            $location.path('/');
        });

    };
};

