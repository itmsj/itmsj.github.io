/* -Script custom by AYATSUKi Yuuki w/JavaScript GPT- */
/* 環境別 */
(function () {
	const AppConfig = {// 共通設定
		configVersion: '250606.001',
		useCacheBuster: false,
		env: (function () {
			const host = window.location.hostname;
			if (host === 'localhost') return 'local';
			if (host === 'testsubdomain.testserver.jp') return 'test';
			if (host === 'origdomain.com') return 'production';
			//他の環境もあれば追加
			return 'unknown';
		})()
	};
	/**
	 * 指定した要素に外部HTMLを読み込むユーティリティ関数
	 * @param {string} targetSelector - HTML要素のセレクタ
	 * @param {string} url - 読み込む外部ファイルのURL
	 */
function loadHtmlIntoElement(targetSelector, url) {
	const targetElements = document.querySelectorAll(targetSelector);
	if (!targetElements.length) return;
		fetch(url)
			.then(response => {
				if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
				return response.text();
			})
			.then(html => {
			targetElements.forEach(targetElement => {
				targetElement.innerHTML = html;
			});
			})
			.catch(error => console.error(`Error loading ${url}`, error));
	}

	const localLoadConfig = [// ページごとの読み込み設定（ローカル開発用）
		{ "selector": "#main_logo>h1", "url": "/js/incl/incl_logo.php" },
		{ "selector": ".fat-navli", "url": "/js/incl/incl_menu.php" },
		{ "selector": "#footer_container", "url": "/js/incl/incl_cpr.php" }
        // 必要なら追加
    ];

	document.addEventListener('DOMContentLoaded', () => {
		const cacheParam = AppConfig.useCacheBuster ?
			`?_=${Date.now()}` :
			`?v=${AppConfig.configVersion}`;

		if (AppConfig.env === 'local') {// 開発環境ならローカル設定で直接読み込み
			localLoadConfig.forEach(({
				selector,
				url
			}) => {
				loadHtmlIntoElement(selector, url);
			});
			return;
		}

		const configPath = '/incl/conf.json';// 本番・テスト環境のconf.jsonパス
		fetch(`${configPath}${cacheParam}`)
			.then(response => response.json())
			.then(configList => {
				const currentPath = window.location.pathname;
			const config = configList.find(cfg => {
				if (cfg.path === currentPath) return true;
				if (cfg.path === '/' && (currentPath === '/' || currentPath === '/index.html')) return true;
				return false;
			});

				if (config) {
					config.targets.forEach(({
						selector,
						url
					}) => {
						loadHtmlIntoElement(selector, url);
					});
				}
			})
			.catch(error => console.error('Config load failed', error));
	});
})();
