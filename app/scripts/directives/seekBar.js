(function () {
    function seekBar($document) {
        /**
        * @function calculatePercent
        * @desc Calculates the horizontal percent where an event occurs on the seek bar
        * @param: {Object} seekBar, {Event} event
        * @returns {Number}
        */
        var calculatePercent = function(seekBar, event) {
            var offsetX = event.pageX - seekBar.offset().left;
            var seekBarWidth = seekBar.width();
            var offsetXPercent = offsetX / seekBarWidth;
            offsetXPercent = Math.max(0, offsetXPercent);
            offsetXPercent = Math.min(1, offsetXPercent);
            return offsetXPercent;
        };
        
        return {
            templateUrl: '/templates/directives/seek_bar.html',
            replace: true,
            restrict: 'E',
            scope: {
                onChange: '&'
            },
            link: function(scope, element, attributes) {
                /**
                * @desc Value of the seek bar (song time/current volume)
                * @type {Number}
                */
                scope.value = 0;
                /**
                * @desc Maximum value of seek bars.
                * @type {Number}
                */
                scope.max = 100;
                
                /**
                * @desc Element holding the seek bar
                * @type {Object}
                */
                var seekBar = $(element);
                
                attributes.$observe('value', function(newValue) {
                    scope.value = newValue;
                });
                
                attributes.$observe('max', function(newValue) {
                    scope.max = newValue;
                });
                
                /**
                * @function percentString
                * @desc calculates a percent based on what the value and maximum value of the seekbar are
                * @return {String}
                */
                var percentString = function () {
                    var value = scope.value;
                    var max = scope.max;
                    var percent = value / max * 100;
                    return percent + "%";
                };
                
                /**
                * @method fillStyle
                * @desc Returns the width of the seek bar fill element based on the calculated percentage
                * @return {Attribute} (or {Object?})
                */
                scope.fillStyle = function() {
                    return {width: percentString()};
                };
                
                /**
                * @method thumbStyle
                * @desc Returns the left attribute of the seek bar fill element based on the calculated   percentage
                * @return {Attribute} (or {Object?})
                */
                scope.thumbStyle = function() {
                    return {left: percentString()};
                };
                
                /**
                * @method onClickSeekBar
                * @desc Updates the seek bar value based on where the user click's on the seek bar
                * @param {Event} event
                */
                scope.onClickSeekBar = function(event) {
                    var percent = calculatePercent(seekBar, event);
                    scope.value = percent * scope.max;
                    notifyOnChange(scope.value);
                };
                
                /**
                * @method trackThumb
                * @desc Applies the change in value of scope.value as the user drags the thumb
                * @param {Event} event
                */
                scope.trackThumb = function() {
                    $document.bind('mousemove.thumb', function (event) {
                        var percent = calculatePercent(seekBar, event);
                        scope.$apply(function() {
                            scope.value = percent * scope.max;
                            notifyOnChange(scope.value);
                        });
                    });
                    
                    $document.bind('mouseup.thumb', function() {
                        $document.unbind('mousemove.thumb');
                        $document.unbind('mouseup.thumb');
                    });
                };
                
                var notifyOnChange = function(newValue) {
                    if (typeof scope.onChange === 'function') {
                        scope.onChange({value: newValue});
                    }
                };
            }
        };
    }
    
    angular
        .module('blocJams')
        .directive('seekBar', ['$document', seekBar]);
})();