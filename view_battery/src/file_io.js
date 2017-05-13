/*
    [file_io.js]
    encoding=UTF-8
*/


var _loadConfigFile = function( vueTaregetInstance, event){
    var promise_load_text = _factory_file_.io.getInstance().loadTextFile(event);

    promise_load_text.then(function(loadedText){
        var param = _factory_file_.parts.getInstance().parseBatteryLogAzureParam6Text( loadedText );
        var insert = _factory_file_.parts.getInstance().setAndInsert2Vue;

        // 【ToDo】成功失敗判定

        insert( vueTaregetInstance, param );        
    }).catch(function(){
        // エラー時。
    });
};
var _parseBatteryLogAzureParam6Text = function( textSrc ){
    return textSrc;
};
var _setAndInsert2Vue = function( vueTaregetInstance, param ){
    console.log(param);
};


var _loadTextFile = function(triggerEvent){
    return new Promise(function(resolve,reject){ // Chrome32, FireFox29～はサポート済み。IEはNG。
        var reader = new FileReader(); //html5:FileReader()の作成
        var file = triggerEvent.target.files;

        // テキスト形式で読み込む
        // http://www.pori2.net/html5/File/020.html
        reader.readAsText(file[0]);

        // 読込終了後の処理
        // https://developer.mozilla.org/ja/docs/Web/API/FileReader
        reader.onload = function(ev){
            resolve(reader.result);
        }
        reader.onerror = function(err){
            reject(err);
        }
    });
};


// ----------------------------------------------------------------------
var Factory; // 複数ファイルでの重複宣言、ブラウザ環境では「後から読み込んだ方で上書きされる」でOKのはず。。。
var Factory4Require;
if( !this.window ){ // Node.js環境のとき、以下を実行する。
	Factory = require("./factory4require_compatible_browser.js").Factory;
	Factory4Require = require("./factory4require_compatible_browser.js").Factory4Require;
}
var _factory_file_ = { // ブラウザ環境ではグローバルなので、vue_main.jsでの定義とは変えておく。
	"io" : new Factory(
        this.window ? { "loadTextFile" : _loadTextFile }
        : undefined 
    ), // Notブラウザ環境では敢えてundefinedが返却されるようにしておく。⇒UTでsinonで差しかえるだけなので。
    "parts" : new Factory({
        "parseBatteryLogAzureParam6Text" : _parseBatteryLogAzureParam6Text,
        "setAndInsert2Vue" : _setAndInsert2Vue
    })
};




// Node.js環境のとき、以下を外部公開する。
// ブラウザ環境では、利用先のvue_main.jsでコンパチさせる。
if( !this.window ){
    exports.loadConfigFile = _loadConfigFile;
    exports.factoryImpl = _factory_file_;
}
