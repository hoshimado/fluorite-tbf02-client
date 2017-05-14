/*
    [ui_chart.js]
    encoding=UTF-8
*/



// こっちはjQueryのまま。後で修正する。
var _getChartDataOverAjax = function( azureDomain, device_key ){
    return $.ajax({
        type : "GET",
        url  : azureDomain + "/api/v1/batterylog/show",
        data : { 
            "device_key" : device_key
        },
        dataType : "jsonp",
        timeout : 3000
    });
};
var _createTextMessage = function( logArray ){
    var length = logArray.length;
    var battery, str = "";

    if( length > 0 ){
        battery = logArray[ length -1 ].battery;
        str += "バッテリー残量：" + battery + " ％ ";
        str += "<i class=\"fa fa-battery-"
        if( battery > 78 ){ // ここの決め方は私の個人的感覚に依存する。
            str += "full";
        }else if( battery > 60 ){
            str += "three-quarters";
        }else if( battery > 40 ){
            str += "half";
        }else if( battery > 30 ){ // この領域（40～30）に入ったら充電しておく目安。
            str += "quarter";
        }else{
            str += "empty";
        }
        str += "\"></i> &nbsp; ";
        str += "at ";
        str += logArray[ length -1 ].created_at.substr(0,10) + "<br>\n";
        str += "<br>\n";
    }else{
        str += "取得可能なデータは有りませんでした。";
    }


    return str;
};
var updateChart = function( RESULT_SELECTOR, azure_domain, device_key ){
    var dfd = $.Deferred(); // https://api.jquery.com/deferred.promise/
	var target = $(RESULT_SELECTOR);

    if((azure_domain.length != 0) && (device_key.length != 0)){
      target.empty();
      target.append("<i class=\"fa fa-spinner fa-spin\"></i>");

    // [デバッグ用]
    // dfd.reject({}, "timeout", {});
    // return dfd;

      _getChartDataOverAjax(
            azure_domain,
            device_key
      ).done(function(result){
            var table = (result.table.length > 0) ? result.table : [];
            var plot_source = _createChatData( table );
            var str = _createTextMessage( table );

            target.empty();

            target.append( str );
            target.append(
                "<canvas id=\"id_chart\"></canvas>"
            );

            var ctx = document.getElementById('id_chart').getContext('2d');
            var myChart = new Chart(ctx, { 
                type: 'line', 
                data: { 
                    labels: plot_source.label, // ['M', 'T', 'W', 'T', 'F', 'S', 'S'], 
                    datasets: [
                        { 
                            label: 'battery', 
                            data: plot_source.data, // [12, 19, 3, 17, 6, 3, 7], 
                            backgroundColor: "rgba(153,255,51,0.4)" 
                            // backgroundColor: "rgba(20,70,51,0.8)" 
                        }
                    ] 
                } 
            });
            dfd.resolve();
      }).fail(function( jqXHR, textStatus, errorThrown ){
            target.empty();
            target.append( textStatus );
            dfd.reject(jqXHR, textStatus, errorThrown);
      });
    }else{
        target.empty();
        target.append( "[Error] 設定が不足です" );
        dfd.reject();
    }
    return dfd;
};

var _createChatData = function( logArray ){
    var i, length = logArray.length;
    var labels_array = [], data_array = [], cut_off = length - 50;
    var scale = 0;

    for( i=0; i<length; i++ ){
        if( cut_off < i ){
            data_array.push( logArray[i].battery );

            labels_array.push( scale*5 );
            scale++;
        }
    }
    labels_array.reverse();

    return {
        label : labels_array,
        data  : data_array
    };
};





