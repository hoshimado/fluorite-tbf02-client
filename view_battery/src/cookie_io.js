/*
    [cookie_io.js]
    encoding=UTF-8
*/




/*
  function Cookie(key, value, opts) {
    if (value === void 0) {
      return Cookie.get(key);
    } else if (value === null) {
      Cookie.remove(key);
    } else {
      Cookie.set(key, value, opts);
    }
  }
*/
/**
 * Cookieを利用したデータ保存。
 *
 */
var MAX_LISTS = 7;
var COOKIE_NAME  = "AzBatteryLog_Text";
var COOKIE_VALUE = "AzBatteryLog_Value";
var COOKIE_LAST_VALUE = "AzBatteryLog_LastValue";
var COOKIE_OPTIONS = {expires: 7};
var _loadItems = function(){
	var cookie = factoryImpl.tinyCookie.getInstance();
	var list = [];
	var name, value, n = MAX_LISTS;
	while( 0 < n-- ){
		name = cookie( COOKIE_NAME + n );
		value = cookie( COOKIE_VALUE + n );
		if( name && value ){
			list.push({
				"text" : name,
				"value" : value
			});
		}
	}
	return list;
};
var _saveItems = function( list ){
	var cookie = factoryImpl.tinyCookie.getInstance();
	var name, value, n = MAX_LISTS;
	while( 0 < n-- ){
		if( list[n] && list[n].text && list[n].value ){
			name = cookie( COOKIE_NAME + n, list[n].text, COOKIE_OPTIONS );
			value = cookie( COOKIE_VALUE + n, list[n].value, COOKIE_OPTIONS );
		}
	}
};
var _loadLastValue = function(){
	var cookie = factoryImpl.tinyCookie.getInstance();
	return cookie(COOKIE_LAST_VALUE);
};
var _saveLastValue = function( value ){
	var cookie = factoryImpl.tinyCookie.getInstance();
	cookie(COOKIE_LAST_VALUE, value, COOKIE_OPTIONS);
};
var _loadAzureDomain = function(){
	var cookie = factoryImpl.tinyCookie.getInstance();
	return cookie("AzBatteryLog_Domain");
}
var _saveAzureDomain = function( azureStr ){
	var cookie = factoryImpl.tinyCookie.getInstance();
	cookie("AzBatteryLog_Domain", azureStr, COOKIE_OPTIONS );
};



// Node.js環境のとき、以下を外部公開する。
// ブラウザ環境では、利用先のvue_main.jsでコンパチさせる。
if( !this.window ){
    exports.loadItems = _loadItems;
    exports.saveItems = _saveItems;
    exports.loadLastValue = _loadLastValue;
    exports.saveLastValue = _saveLastValue;
    exports.loadAzureDomain = _loadAzureDomain;
    exports.saveAzureDomain = _saveAzureDomain;
}

