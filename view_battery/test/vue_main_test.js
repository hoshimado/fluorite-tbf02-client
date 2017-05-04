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
        var original, stubs;
        beforeEach(function(){
            original = {
                "createVue" : main.factoryImpl.createVue.getInstance(),
                "cookieData" : main.factoryImpl.cookieData.getInstance(),
                "action" : main.factoryImpl.action.getInstance()
            };

            stubs = {
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
            main.factoryImpl.createVue.setStub( stubs.createVue );
            main.factoryImpl.cookieData.setStub( stubs.cookieData);
            main.factoryImpl.action.setStub(stubs.action);
        });
        afterEach(function(){
            main.factoryImpl.createVue.setStub( original.createVue );
            main.factoryImpl.cookieData.setStub( original.cookieData );
            main.factoryImpl.action.setStub( original.action );
        });

        it("正常系 - lastValueあり",function(){
            var EX_AZURE_DOMAIN = "AzD";
            var EX_VUE1 = {}, EX_VUE2 = {"options": [] };
            var EX_ITEMS = [{"text":"1つめテキスト", "value":"1つ目の値"}];
            var EX_LAST_VALUE = "last_value___";

            stubs.createVue.onCall(0).returns(EX_VUE1);
            stubs.createVue.onCall(1).returns(EX_VUE2);
            stubs.cookieData.loadAzureDomain.onCall(0).returns(EX_AZURE_DOMAIN);
            stubs.cookieData.loadItems.onCall(0).returns(EX_ITEMS);
            stubs.cookieData.loadLastValue.onCall(0).returns(EX_LAST_VALUE);

            main.setupOnLoad();

            // 以下、検証。変数宣言位置は無視。
            assert( stubs.createVue.calledTwice, "crateVueは2回呼ばれること" );

            var app1 = stubs.createVue.getCall(0).args[0]; // 【FixMe】初回である必要はない。
            expect(app1).to.have.property("el").and.equal("#app");

            expect(app1).to.have.property("data");
            var app1_data = app1.data();
            expect(app1_data).to.have.property("app_version_str");
            expect(app1_data).to.have.property("azure_domain_str").and.equal(EX_AZURE_DOMAIN);
            expect(app1_data).to.have.property("device_key_str").and.equal("");
            expect(app1_data).to.have.property("device_name_str").and.equal("");

            expect(app1).to.have.property("methods");

            expect(app1.methods).to.have.property("add_azure");
            expect(!stubs.cookieData.saveAzureDomain.called);
            app1.methods.add_azure.apply(app1_data,[]);
            assert(stubs.cookieData.saveAzureDomain.calledWith(EX_AZURE_DOMAIN));

            expect(app1.methods).to.have.property("add_device");
            expect(!stubs.action.addSelecterIfUnique.called);
            expect(stubs.cookieData.saveItems.neverCalledWith());
            app1.methods.add_device.apply(app1);
            assert(stubs.action.addSelecterIfUnique.calledWith(app1, EX_VUE2));


            var app2 = stubs.createVue.getCall(1).args[0]; // 【FixMe】2回目である必要はない。
            expect(app2).to.have.property("el").and.equal("#app_selector");

            expect(app2).to.have.property("data");
            var app2_data = app2.data();
            expect(app2_data).to.have.property("selected").and.equal(EX_LAST_VALUE);
            expect(app2_data).to.have.property("options").and.equal(EX_ITEMS);

            assert(stubs.action.showItemOnInputer.calledWith(EX_VUE2, EX_VUE1));

            expect(app2).to.have.property("methods");
            expect(app2.methods).to.have.property("update_inputer");
            expect(stubs.action.showItemOnInputer.neverCalledWith(app2_data, EX_VUE1)); // 別の引数組み合わせで１ど呼ばれるので注意。
            app2.methods.update_inputer.apply(app2_data,[]);
            assert(stubs.action.showItemOnInputer.calledWith(app2_data, EX_VUE1));

            expect(app2.methods).to.have.property("update_chart");
            expect(!stubs.action.updateLogViewer.called);
            app2.methods.update_chart(app2); // 内部でthisを参照する必要はないので、そのまま呼ぶ。
            assert(stubs.action.updateLogViewer.calledWith(EX_VUE1));
        });

        it("正常系 - lastValue無し",function(){
            var EX_AZURE_DOMAIN = "AzD";
            var EX_VUE1 = {}, EX_VUE2 = {"options": [] };
            var EX_ITEMS = [{"text":"1つめテキスト", "value":"1つ目の値"}];

            stubs.createVue.onCall(0).returns(EX_VUE1);
            stubs.createVue.onCall(1).returns(EX_VUE2);
            stubs.cookieData.loadAzureDomain.onCall(0).returns(EX_AZURE_DOMAIN);
            stubs.cookieData.loadItems.onCall(0).returns(EX_ITEMS);
            stubs.cookieData.loadLastValue.onCall(0).returns(null);

            main.setupOnLoad();

            // 以下、検証。変数宣言位置は無視。
            assert( stubs.createVue.calledTwice, "crateVueは2回呼ばれること" );

            var app2 = stubs.createVue.getCall(1).args[0]; // 【FixMe】2回目である必要はない。
            expect(app2).to.have.property("el").and.equal("#app_selector");
            // 他のテストは重複なので省略。
            var app2_data = app2.data();
            expect(app2_data).to.have.property("selected").and.equal(""); // 【ToDo】無い場合のテストも必要。
            expect(app2_data).to.have.property("options").and.equal(EX_ITEMS);

            assert(!stubs.action.showItemOnInputer.called); // このケースでは「呼ばれ無い」。
        });
    });

    describe( "::_updateLogViewer()",function(){
        var updateLogViewer = main.factoryImpl.action.getInstance().updateLogViewer;
        var original;
        beforeEach(function(){
            original = {
                "cookieData" : main.factoryImpl.cookieData.getInstance(),
                "action" : main.factoryImpl.action.getInstance()
            };
        });
        afterEach(function(){
            main.factoryImpl.cookieData.setStub( original.cookieData );
            main.factoryImpl.action.setStub( original.action );
        });

        it("正常系",function(){
            var EX_AZURE_DOMAIN = "AzD";
            var EX_DEVICE_KEY = "device_key___";

            var stub = {
                "cookieData" : {
                    "saveLastValue" : sinon.stub(),
                    "extendExpiresOfAllCookie" : sinon.stub()
                },
                "action" : {
                    "updateChart" : sinon.stub()
                    // var updateChart = function( RESULT_SELECTOR, azure_domain, device_key ){}
                }
            };
            main.factoryImpl.cookieData.setStub(stub.cookieData);
            main.factoryImpl.action.setStub(stub.action);

            updateLogViewer({//src
                "azure_domain_str" : EX_AZURE_DOMAIN,
                "device_key_str" : EX_DEVICE_KEY
            });

            // 以下、検証。変数宣言位置は無視。
            assert(stub.action.updateChart.calledOnce);
            expect(stub.action.updateChart.getCall(0).args[0]).to.equal("#id_result");
            expect(stub.action.updateChart.getCall(0).args[1]).to.equal(EX_AZURE_DOMAIN);
            expect(stub.action.updateChart.getCall(0).args[2]).to.equal(EX_DEVICE_KEY);

            assert(stub.cookieData.saveLastValue.calledOnce);
            expect(stub.cookieData.saveLastValue.getCall(0).args[0]).to.equal(EX_DEVICE_KEY);

            assert(stub.cookieData.extendExpiresOfAllCookie.calledOnce);
        });
    });
});

