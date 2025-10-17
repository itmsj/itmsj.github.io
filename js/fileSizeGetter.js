// --------------------------------------------------------------------
// Author  : mashimonator
// Create  : 2009/11/17
// Update  : 2009/11/17
//         : 2009/12/28 IE6で発生していたエラーを修正
//         : 2011/02/11 小数点以下1桁で四捨五入（豆腐さん用カスタム）
//         : 2011/05/16 ファイルサイズの取得を特定IDを持つ要素に限定できるように修正
//         : 2012/05/28 ファイルサイズの取得を特定のクラス名を持つリンクに限定できるように修正
// Description : リンクに指定されたファイルのサイズを自動で取得して表示する
// --------------------------------------------------------------------


var fileSizeGetter = {
	//-----------------------------------------
	// 設定値
	//-----------------------------------------
	config : {
		// ファイルサイズを取得する対象の拡張子
		extension : [ '.png', '.gif', '.jpg', '.jpeg', '.pdf', '.xlsx', '.xls', '.docx', '.doc', '.pptx', '.ppt', '.zip', '.lzh', '.cab', '.txt', '.exe' ],
		// ファイルサイズの取得を限定する場合（※両方指定されている場合はID指定の方が優先されます）
		extract : {
			// 指定IDを持つ要素内のリンクのみに限定する場合にIDを指定
			id : '',
			// 指定クラスを持つa要素のみに適用する場合にクラス名を指定
			cls : 'test'
		},
		// ファイルサイズを小数点以下1桁で四捨五入する場合はtrue、デフォルトはfalse
		round : true
	},
	//-----------------------------------------
	// 初期処理
	//-----------------------------------------
	initialize : function() {
		var elements = null;
		if ( fileSizeGetter.config.extract.id ) {
			var targetElm = document.getElementById(fileSizeGetter.config.extract.id);
			if ( !targetElm ) {
				return;
			} else {
				elements = targetElm.getElementsByTagName('A');
			}
		} else {
			if ( fileSizeGetter.config.extract.cls ) {
				elements = fileSizeGetter.getElementsByClassName(fileSizeGetter.config.extract.cls);
				if ( !elements ) {
					return;
				}
				/*
				var tmp = new Array();
				for (var i = 0, len = elements.length; i < len; i++) {
					var links = elements[i].getElementsByTagName('A');
					[].push.apply(tmp, links);
				}
				elements = tmp;
				*/
			} else {
				elements = document.getElementsByTagName('A');
			}
		}
		for (var i = 0, len = elements.length; i < len; i++) {
			for (var x = 0, len2 = fileSizeGetter.config.extension.length; x < len2; x++) {
				var href = elements[i].getAttribute('href');
				var reg = new RegExp( fileSizeGetter.config.extension[x] + '$', 'i' );
				if ( href && href.match(reg) ) {
					// サイズ取得
					var size = fileSizeGetter.getFileSize(href);
					// サイズを挿入
					if ( size ) {
						elements[i].innerHTML += '［約 ' + fileSizeGetter.convUnit(size) + '］';
					}
					break;
				}
			}
		}
	},
	// -----------------------------------
	// ファイルサイズを取得する
	// -----------------------------------
	getFileSize : function( href ) {
		// HTTP通信用オブジェクト生成
		var httpObj = fileSizeGetter.createXMLHttpRequest();
		if ( !httpObj ) {
			return false;
		}
		// 同期通信
		httpObj.open('HEAD', href, false);
		try {
			httpObj.send(null);
		} catch(e) {
			// 404 Not Found
			return false;
		}
		// 結果を取得
		if ( !httpObj.getResponseHeader('Content-Length') ) {
			// No Content-Length
			return false;
		} else {
			// Return Content-Length
			if ( httpObj.readyState == 4 && httpObj.status == 200 ) {
				return httpObj.getResponseHeader('Content-Length');
			} else {
				return false;
			}
		}
	},
	// -----------------------------------
	// 単位を変換する
	// -----------------------------------
	convUnit : function( num ) {
		if ( num > 1073741824 ) {
			// GByte
			num = num / (1024*1024*1024);
			return fileSizeGetter.roundDecimal(num) + 'GB';
		} else if ( num > 1048576 ) {
			// MByte
			num = num / (1024*1024);
			return fileSizeGetter.roundDecimal(num) + 'MB';
		} else if ( num > 1024 ) {
			// KByte
			num = num / 1024;
			return fileSizeGetter.roundDecimal(num) + 'KB';
		} else {
			// byte
			return fileSizeGetter.roundDecimal(num) + 'B';
		}
	},
	// -----------------------------------
	// 小数点以下1桁で四捨五入する
	// -----------------------------------
	roundDecimal : function(num) {
		if ( fileSizeGetter.config.round ) {
			num = num * 10;
			num = Math.round(num);
			num = String(num / 10);
			if ( !num.match(/\./) ) {
				num = num + '.0';
			}
		} else {
			num = Math.ceil(num);
		}
		return num;
	},
	// -----------------------------------
	// HTTP通信用オブジェクト生成
	// -----------------------------------
	createXMLHttpRequest : function() {
		var XMLhttpObject = null;
		try {
			XMLhttpObject = new XMLHttpRequest();
		} catch(e) {
			var progids = new Array('MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP');
			for (var i = 0, len = progids.length; i < len; i++) {
				try {
					XMLhttpObject = new ActiveXObject(progids[i]);
				} catch (e) {
					XMLhttpObject = null;
				}
			}
		}
		return XMLhttpObject;
	},
	//-----------------------------------------
	// getElementsByClassNameをエミュレートする
	//-----------------------------------------
	getElementsByClassName : function( cls ) {
		var elements = new Array();
		if ( document.evaluate ) {
			var xpathExpression = '/descendant::*[contains(@class,"'+ cls + '")]';
			var iterator = document.evaluate(xpathExpression, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
			for (var i = 0, len = iterator.snapshotLength; i < len; i++) {
				var elm = iterator.snapshotItem(i);
				elements[elements.length] = elm;
			}
		} else if ( document.querySelectorAll ) {
			elements = document.querySelectorAll('.'+cls);
		} else {
			var nodes = document.all ? document.all : document.getElementsByTagName('*');
			for (var i = 0, len = nodes.length; i < len; i++) {
				var elm = nodes.item(i);
				if ( elm.className.match(cls) ) {
					elements[elements.length] = elm;
				}
			}
		}
		return elements;
	},
	//-----------------------------------------
	// イベントに関数を付加する
	//-----------------------------------------
	addEvent : function( target, event, func ) {
		try {
			target.addEventListener(event, func, false);
		} catch (e) {
			target.attachEvent('on' + event, (function(el){return function(){func.call(el);};})(target));
		}
	}
}
// 実行
fileSizeGetter.addEvent( window, 'load', fileSizeGetter.initialize );