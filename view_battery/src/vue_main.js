/*
    [vue_main.js]
    encoding=UTF-8

*/




/**
 * 画面のDOM描画が終わった後に呼び出される、各種Vue.jsベースの動作構築。
 */
var setupOnLoad = function(){
	// とりあえず動かしてみる http://tech.innovation.co.jp/2017/01/13/vue.html
	// セレクト。動的。https://jp.vuejs.org/v2/guide/forms.html#%E9%81%B8%E6%8A%9E
	// Vueのインスタンスが持つ値にアクセスする http://qiita.com/hosomichi/items/ebbfcc3565bcd27f344c
	// Cookieならこっち。後半でテスト済み。https://www.npmjs.com/package/tiny-cookie
	var createVue = factoryImpl.createVue.getInstance();
	var items = factoryImpl.cookieData.getInstance().loadItems();
	var last_value = factoryImpl.cookieData.getInstance().loadLastValue();
	var app = createVue({
		el: '#app',
		data: function(){
			return {
			"app_version_str"  : "Ver.20170506",
			"azure_domain_str" : factoryImpl.cookieData.getInstance().loadAzureDomain(),
			"device_key_str"   : "",
			"device_name_str"  : ""
			};
		},
		methods : {
			"add_azure" : function(event){
				factoryImpl.cookieData.getInstance().saveAzureDomain( this.azure_domain_str );
			},
			"add_device" : function(e){
				factoryImpl.action.getInstance().addSelecterIfUnique( this, app2 ); // 後でマージする。⇒this１つになる。
				factoryImpl.cookieData.getInstance().saveItems( app2.options ); // 後でマージする。⇒this.optionsになる。
			}
		}
	});
	var app2 = createVue({ // jQueryとの共存の都合で分ける。
		el: '#app_selector',
		data: function(){
			return {
			// 以下はセレクター関連
			"selected" : last_value ? last_value : "", // ここは初期選択したいvalueを指定する。
			"options" : items
			};
		},
		methods : {
			"update_inputer" : function(e){
				factoryImpl.action.getInstance().showItemOnInputer( this, app ); // 後でマージする。⇒this１つになる。
			},
			"update_chart" : function(e){
				// ドメインと選択肢を、この時点の値を以て保存し直する。
				factoryImpl.cookieData.getInstance().saveAzureDomain( app.azure_domain_str );
				factoryImpl.cookieData.getInstance().saveItems( this.options );

				// チャート描画を呼び出す。
				factoryImpl.action.getInstance().updateLogViewer( app ); // 後でマージする。⇒thisになる。
			}
		}
	});
	if( last_value ){
		factoryImpl.action.getInstance().showItemOnInputer( app2, app ); // 後でマージする。⇒this１つになる。
	}
};
var _addSelecterIfUnique = function( src, dest ){
	var list = dest.options, n = list.length, is_unique = true;
	while( 0<n-- ){
		if( list[n].value == src.device_key_str ){
			is_unique = false;
			break;
		}
	}
	if( is_unique ){
		dest.options.push({
			value : src.device_key_str,
			text  : src.device_name_str
		});
	}
};
var _showItemOnInputer = function( src, dest ){
	var selected_value = src.selected;
	var list = src.options, n = list.length;
	while( 0<n-- ){
		if( list[n].value == selected_value ){
			dest.device_key_str = list[n].value;
			dest.device_name_str = list[n].text;
			break;
		}
	}
};
var _updateLogViewer = function( src ){
	factoryImpl.action.getInstance().updateChart( "#id_result", src.azure_domain_str, src.device_key_str ) // 出力先がハードコーディングなので後で直す。
	factoryImpl.cookieData.getInstance().saveLastValue( src.device_key_str )
};
if( this.window ){
	window.onload = setupOnLoad;
}else{
	exports.setupOnLoad = setupOnLoad;
}









// ----------------------------------------------------------------------
var Factory; // 複数ファイルでの重複宣言、ブラウザ環境では「後から読み込んだ方で上書きされる」でOKのはず。。。
var Factory4Require;
if( !this.window ){ // Node.js環境のとき、以下を実行する。
	Factory = require("./factory4require_compatible_brower.js").Factory;
	Factory4Require = require("./factory4require_compatible_browser.js").Factory4Require;
}
var factoryImpl = { // require()を使う代わりに、new Factory() する。
	"createVue" : new Factory(function(options){
		return new Vue(options)
	}), // Vue.jsが無ければ、undefined が設定されるだけ。
	"tinyCookie" : new Factory( this.window ? window.Cookie : undefined), // Notブラウザ環境では敢えてundefinedにしておく。
	"cookieData" : this.window ? new Factory({
		"loadItems" : _loadItems,
		"saveItems" : _saveItems,
		"loadLastValue" : _loadLastValue,
		"saveLastValue" : _saveLastValue,
		"loadAzureDomain" : _loadAzureDomain,
		"saveAzureDomain" : _saveAzureDomain
	}) : new Factory4Require("./cookie_io.js"), // ブラウザ環境は外部ファイル無いの変数もグローバル。nodejs環境はrequire()経由。
	"action" : new Factory({
		"addSelecterIfUnique" : _addSelecterIfUnique,
		"showItemOnInputer" : _showItemOnInputer,
		"updateLogViewer" : _updateLogViewer,
		"updateChart" : this.window ? updateChart : undefined // ブラウザ環境では<script>で読み込み済み。それ以外ならundefinedになる。
		// var updateChart = function( RESULT_SELECTOR, azure_domain, device_key ){}
	})
};
// UTデバッグ用のHookポイント。運用では外部公開しないメソッドはこっちにまとめる。
if( !this.window ){ // Node.js環境のとき、以下を外部公開する。
	exports.factoryImpl = factoryImpl;
	exports.Factory = Factory;
}



