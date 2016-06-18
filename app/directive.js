'use strict';

angular.module('app')
    .directive("dropdown", ['$document', function($document) {
        return {
            restrict: 'E',
            templateUrl: "app/templates/dropdown.html",
            scope: {
                placeholder: "@",
                items: "=",
                property: "@",
                ngModel: "=ngModel",
                selected: "&"

            },
            require: '^ngModel',
            link: function(scope, element, attrs) {
                scope.id = attrs.name;
                scope.listVisible = false;
                scope.selectedText = "";
                if (scope.placeholder == undefined) {
                    scope.placeholder = "";
                }
                scope.ngModel = "";

                var clicked = false;
                var isHover = false;

                scope.isSelected = function(item) {
                    if (scope.property !== undefined) {
                        return item.value === scope.ngModel;
                    } else {
                        return item === scope.ngModel;
                    }
                };

                scope.select = function(event, item) {
                    clicked = true;
                    scope.ngModel = scope.property !== undefined ? item.value : item;;
                    scope.selectedText = scope.property !== undefined ? item.text : item;
                    scope.listVisible = false;
                    isHover = false;
                    scope.selected(event);

                };
                element.find(".dropdown-list").bind('mouseenter mouseover', function(e) {
                    isHover = true;
                });
                element.find(".dropdown-list").bind('mouseout', function(e) {
                    isHover = false;
                });
                element.find("input").bind('click', function(e) {
                    clicked = true;
                    scope.listVisible = true;
                    scope.$apply();

                });
                element.find("input").bind('focus', function(e) {
                    scope.listVisible = true;
                    scope.$apply();
                });

                element.find("input").bind('blur', function(e) {
                    if (!isHover) {
                        scope.listVisible = false;
                        scope.$apply();
                    }
                    isHover = false;
                });
                /*
                $document.bind('click', function(e) {
                    if (!clicked) {
                        scope.listVisible = false;
                        scope.$apply();
                    }
                    clicked = false;
                });
                scope.$on('$destroy', function() {

                    $document.off('click');
                });*/

            }

        }
    }]).directive("chartHeigth", function($timeout) {
        return {
            restrict: 'A',
            scope: {
                value: '=',
                max: "=",
            },
            link: function(scope, element, attrs) {
                var heigth = (Number(scope.value) / Number(scope.max)) * 100;
                heigth = heigth.toFixed(2) + "%";
                $(element).css('height', heigth);
            }

        }
    })