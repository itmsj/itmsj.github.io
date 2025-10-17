//function reloadcss() {
	var timestmp = Date.now();// 現在のミリ秒単位のタイムスタンプを取得
	var linkTags = document.querySelectorAll('link[rel="stylesheet"]');// <link>タグのうち、rel属性がstylesheetのものをすべて取得

	linkTags.forEach(function (link) {
		var ogHref = link.getAttribute('href');// 各<link>タグのhrefを取得
		var newPara = addPara(ogHref, timestmp);// クエリパラメータとしてタイムスタンプを追加
		link.setAttribute('href', newPara);// hrefを更新
		// console.log('Updated CSS URL:', newHref);
	});
//}
function addPara(href, timestmp) { // hrefにタイムスタンプを追加
	var nurl = new URL(href, window.location.origin);
	nurl.searchParams.set('demojs', timestmp);
	return nurl.href;
}
//window.addEventListener('DOMContentLoaded', reloadcss);
