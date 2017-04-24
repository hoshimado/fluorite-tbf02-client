/*
    [vue_main_test.js]
	encoding=utf-8
*/


var chai = require("chai");
var assert = chai.assert;
var expect = chai.expect;
var sinon = require("sinon");
// var shouldFulfilled = require("promise-test-helper").shouldFulfilled;
// var shouldRejected  = require("promise-test-helper").shouldRejected;

var main = require("../src/vue_main.js");



describe( "vue_main.js", function(){
    describe( "::setupOnLoad()",function(){
        var setupOnLoad = main.setupOnLoad;
        var original;
        beforeEach(function(){
            original = {
                "createVue" : main.factoryImpl.createVue.getInstance(),
                "cookieData" : main.factoryImpl.cookieData.getInstance(),
                "action" : main.factoryImpl.action.getInstance()
            };
        });
        afterEach(function(){
            main.factoryImpl.createVue.setStub( original.createVue );
            main.factoryImpl.cookieData.setStub( original.cookieData );
            main.factoryImpl.action.setStub( original.action );
        });

        it("正常系",function(){
            var EX_AZURE_DOMAIN = "AzD";
            var EX_VUE1 = {}, EX_VUE2 = {"options": [] };

            var stub = {
                "createVue" : sinon.stub(),
                "cookieData" : {
                    "loadItems" : sinon.stub(),
                    "saveItems" : sinon.stub(),
                    "loadLastValue" : sinon.stub(),
                    "saveLastValue" : sinon.stub(),
                    "loadAzureDomain" : sinon.stub(),
                    "saveAzureDomain" : sinon.stub()
                },
                "action" : {
                    "addSelecterIfUnique" : sinon.stub(),
                    "showItemOnInputer" : sinon.stub(),
                    "updateLogViewer" : sinon.stub(),
                    "updateChart" : sinon.stub()
                    // var updateChart = function( RESULT_SELECTOR, azure_domain, device_key ){}
                }
            };
            main.factoryImpl.createVue.setStub( stub.createVue );
            main.factoryImpl.cookieData.setStub( stub.cookieData);
            main.factoryImpl.action.setStub(stub.action);

            stub.createVue.onCall(0).returns(EX_VUE1);
            stub.createVue.onCall(1).returns(EX_VUE2);
            stub.cookieData.loadAzureDomain.onCall(0).returns(EX_AZURE_DOMAIN);

            main.setupOnLoad();

            // 以下、検証。変数宣言位置は無視。
            assert( stub.createVue.calledTwice, "crateVueは2買い呼ばれること" );

            var app1 = stub.createVue.getCall(0).args[0]; // 【FixMe】初回である必要はない。
            expect(app1).to.have.property("el").and.equal("#app");

            expect(app1).to.have.property("data");
            var app1_data = app1.data();
            expect(app1_data).to.have.property("azure_domain_str").and.equal(EX_AZURE_DOMAIN);
            expect(app1_data).to.have.property("device_key_str").and.equal("");
            expect(app1_data).to.have.property("device_name_str").and.equal("");

            expect(app1).to.have.property("methods");

            expect(app1.methods).to.have.property("add_azure");
            expect(stub.cookieData.saveAzureDomain.neverCalledWith());
            app1.methods.add_azure();
            expect(stub.cookieData.saveAzureDomain.calledWith(EX_AZURE_DOMAIN));

            expect(app1.methods).to.have.property("add_device");
            expect(stub.action.addSelecterIfUnique.neverCalledWith());
            expect(stub.cookieData.saveItems.neverCalledWith());

            //app1.methods.add_device();
        });
    });
});


/*

var app = createVue({
    methods : {
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
            factoryImpl.action.getInstance().updateLogViewer( app ); // 後でマージする。⇒thisになる。
        }
    }
});
if( last_value ){
    factoryImpl.action.getInstance().showItemOnInputer( app2, app ); // 後でマージする。⇒this１つになる。
}
*/
