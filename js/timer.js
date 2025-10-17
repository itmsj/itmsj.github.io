//$(document).ready(function () {
  /*-- 時限設定　jQuery --*/
  /*------------------------------------------------------------------------------------------------
  使用方法
  1. 日時指定をしたいタグに、class="jstimer"を指定
  2. 指定時間まで表示（指定時間が来たら『非表示』）の場合、同じタグに edate を付与
　　例；<span class="jstimer" edate="2019/3/5 15:00">（3/5 15:00 から非表示にする）</span>
　3. 指定時間までは非表示（指定時間が来たら『表示』）の場合、同じタグに sdate を付与
　　例；<span class="jstimer" sdate="2019/3/5 14:50">（3/5 14:50 から表示する）</span>
　4. 指定した期間表示する（sdate から edate までの間だけ表示）
　　例；<span class="jstimer" sdate="2019/3/5 14:45" edate="2019/3/5 14:50">
　　　　（3/5 14:45 ～ 3/5 14:50 の間だけ表示する）</span>
  *-------------------------------------------------------------------------------------------------*/
  $(".jstimer").each(function (index, target) {
    var startDate = $(this).attr("sdate");
    var endDate = $(this).attr("edate");
    var nowDate = new Date();
    if (startDate) {
      startDate = new Date(startDate);
    } else {
      startDate = nowDate;
    }
    if (endDate) {
      endDate = new Date(endDate);
    }
    if (startDate <= nowDate && (!endDate || nowDate <= endDate)) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
  /*-- ／時限設定　jQuery --*/
//});
