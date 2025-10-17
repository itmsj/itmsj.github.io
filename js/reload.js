//(function () {
  var now = new Date();
  var earliestTime = null;
  var earliestKey = null;

  $('.jstimer').each(function () {
    ['sdate', 'edate'].forEach(attr => {
      var dateStr = $(this).attr(attr);
      if (dateStr) {
        var targetTime = new Date(dateStr);
        var key = 'reload_' + targetTime.getTime();

        // まだ実行してないリロード候補を探す
        if (!localStorage.getItem(key)) {
          if (!earliestTime || targetTime < earliestTime) {
            earliestTime = targetTime;
            earliestKey = key;
          }
        }
      }
    });
  });

  if (earliestTime) {
    var refreshTime = earliestTime.getTime() - (new Date()).getTime() + 1000;

    if (refreshTime <= 0) {
      runReload();
    } else {
      setTimeout(runReload, refreshTime);
    }

    function runReload() {
      // リロード済みフラグを記録
      localStorage.setItem(earliestKey, '1');
      location.reload(true);
    }
  }
//})();
