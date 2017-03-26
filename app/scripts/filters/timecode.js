(function() {
    function timecode(SongPlayer) {
        return function(seconds) {
            var output = buzz.toTimer(seconds);
            if (output === '00:00' && !SongPlayer.currentSong) {
                return '--:--'
            } else return output;
        };
    }
    
    angular
        .module('blocJams')
        .filter('timecode', ['SongPlayer', timecode]);
})();