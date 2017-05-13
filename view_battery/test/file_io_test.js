/*
    [file_io_test.js]
	encoding=utf-8
*/


var chai = require("chai");
var assert = chai.assert;
var expect = chai.expect;
var sinon = require("sinon");
var shouldFulfilled = require("promise-test-helper").shouldFulfilled;
var shouldRejected  = require("promise-test-helper").shouldRejected;

var file = require("../src/file_io.js");


describe( "file_io.js", function(){
    describe( "::loadConfigFile()",function(){
        var loadConfigFile = file.loadConfigFile;
        var original, stubs;
        beforeEach(function(){
            original = {
                "io" : file.factoryImpl.io.getInstance(),
                "parts" : file.factoryImpl.parts.getInstance()
            };

            stubs = {
                "io" : {
                    "loadTextFile" : sinon.stub()
                },
                "parts" : {
                    "parseBatteryLogAzureParam6Text" : sinon.stub(),
                    "setAndInsert2Vue" : sinon.stub()
                }
            };
            file.factoryImpl.io.setStub(stubs.io);
            file.factoryImpl.parts.setStub(stubs.parts);
        });
        afterEach(function(){
            file.factoryImpl.io.setStub(original.io);
            file.factoryImpl.parts.setStub(original.parts);
        });

        it("ファイル読み込み、解析、Vueへ設定",function(){
            assert(loadConfigFile);
        });
    });


    describe( "::parseBatteryLogAzureParam6Text()",function(){
        var parseBatteryLogAzureParam6Text = file.factoryImpl.parts.getInstance().parseBatteryLogAzureParam6Text;
        var original, stubs;
        beforeEach(function(){
        });
        afterEach(function(){
        });

        it("解析",function(){
            assert(parseBatteryLogAzureParam6Text);
        });
    });


    describe( "::setAndInsert2Vue()",function(){
        var setAndInsert2Vue = file.factoryImpl.parts.getInstance().setAndInsert2Vue;
        var original, stubs;
        beforeEach(function(){
        });
        afterEach(function(){
        });

        it("Vueへの設定",function(){
            var vue_fake = {
                        "azure_domain_str" : "",
                        "device_key_str"   : "",
                        "device_name_str"  : ""
            };

            assert(setAndInsert2Vue);
        });
    });
});

