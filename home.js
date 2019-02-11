var togArray = [];
var tempTogArray = [];
var liveReportsInterval ;


$(document).ready(function () {
    getAllCoins();
     $("#home").on("click", function () {
        $("#chartContainer").hide();
        $(".showallcoins").show();
        clearInterval(liveReportsInterval);
        
    });

    $("#searchcoin").on("click", function () {
        serachCoins();
    });

    $("#live_reports").on("click", function(){
        livereports();
        $(".abtheader").hide();
        
    })

    $("#about").on("click", function(){
        
        $("#chartContainer").hide();
        $(".showallcoins").hide();
        $(".abtheader").show();
    })
});

function getAllCoins() {
    
    
    $(".showallcoins").html("<img class='large-gif' src='images/bity.gif' />")
    $.ajax({
        url: "https://api.coingecko.com/api/v3/coins/list", // The Address To Send The Request to
        type: "get", //the request protocol type
        data: {}, // the data we want to send to the server
        success: function (result) { // the callback function to run when we get the data back from the server
            // console.log(result);
            $(".showallcoins").html("");
            arrangeCoins(result);

        },
        error: function (xhr) {
            console.log("Error:", xhr);
        }
    });

}

function serachCoins() {
    let search = $("#search_box").val();     ///    תן למשתנה סרץ את הערך של מה שמופיע במלבן
    
    search = search.toUpperCase();            ///     משנה את הערך שבתוך המלבן לאותיות גדולות
    $('.cube').each(function () {             ///      עבור על כל קוביית מטבע ובצע את הפעולות הבאות
        // console.log($(this));
        if (!search)                           ///    כל עוד המלבן ריק - תראה את כל הקוביות
            $(this).show();
        else if ($(this).find(".coinsymbol").html() != search) {                ///   תחביא את כל המטבעות שלא מתאימים לסמל שמופיע בתוך המלבן
            $(this).hide();
        } else if ($(this).find(".coinsymbol").html() == search) {           //// תציג את המטבע שבו הסמל מתאים 
            $(this).show();
        }
    });
}
    



function arrangeCoins(result) {     //זאת לולאה שמסדרת ומכניסה נתונים לכל מטבע ומטבע //
    for (let i = 0; i < 100 ; i++) {
        let id = result[i].id;
        let cube = $("<div id='" + i + "'  class='col-md-3 cube'></div>");
        $(cube).append("<div class='coinsymbol'>" + result[i].symbol.toUpperCase() + "</div>");//מכניס סמל המטבע
        $(cube).append("<div class='slider_but'><label class='switch'><input class='coins-coin-switch' id='coins_coin_switch_"+id+"' type='checkbox' data-toggle='toggle'><span class='slider round'></span></label></div>");//מכניס טוגל סוויץ
        $(cube).append("<div>" + result[i].name + "</div><br/>"); // מכניס את שם המטבע
        var inside = $("<div class='collapse card card-body' id='info_" + id + "'></div>"); // זהו הדיב שמגדיר את הקולפס //
        let but = $("<button type='button' class='btn btn-success'>More Info</button>"); // זהו הדיב של כפתור מידע נוסף //

        $(but).on("click", function () {
            $("#info_" + id).html("<img class='small-gif' src='images/bity.gif' />"); //פקודה שבלחיצה על הכפתור יראה גיף קטן

            moreInfo(id, i);    /// קריאה לפונקציה מידע נוסף
            $(`#info_` + id).collapse('toggle');     //הגדרת האיזור לקולפס
        });
        $(cube).append(but);     //הכנסת משתנה בוטון לתוך הקובייה של המטבע 
        $(cube).append(inside);    ///  הכנסת משתנה אינסייד לתוך קוביית המטבע
        // $(cube).append("<div class='btn btn-success' onclick='moreInfo(" + id + ")'>More Info" + "</div>");
        // $(cube).append(moreInfo(id));
        $(".showallcoins").append(cube);     /////הכנסת קוביה לתוך המסך הראשי לקלאס המתאים

        $("input:checkbox[type='checkbox']", cube).change(function(){  /// קריאה לפונקציה כאשר משתנה הטוגל בוטון
            funci(result[i].id, result[i].symbol, $("#coins_coin_switch_"+id));//מעביר לפונקציה של שינויי טוגל את השם והסימול והאיידי הייחודי לכל מטבע
        });
        $("label", cube).click(function(){  /// קריאה לפונקציה כאשר יש 5 טוגולים מסומנים והשאר לא ניתנים לשינוי
            if ($("#coins_coin_switch_"+id).prop("disabled") == true) {
                tempTogArray[0] = result[i].id;
                tempTogArray[1] = result[i].symbol;
                tempTogArray[2] = $("#coins_coin_switch_"+id);
                funci(result[i].id, result[i].symbol, $("#coins_coin_switch_"+id));//מעביר לפונקציה של שינויי טוגל את השם והסימול והאיידי הייחודי לכל מטבע
            }
        });
    
    }

}


function funci(param_name,param_code,toggleDIV){        //פונקציית שינויים בטוגל
    
    if ($(toggleDIV).is(":checked")){                   //אם האיידי הייחודי לכל מטבע הוא מסומן
        var tempArr = new Array();                      ///מגדיר מערך זמני חדש
        tempArr.push(param_name, param_code);           //מכניס למערך הזמני את השם של המטבע ואת הסימול של המטבע

        togArray[togArray.length] = tempArr;             // מכניס את כל המערך הזמני לתוך טוגאראי שזה יהיה כאורך המערך הזמני

        if (togArray.length == 5) {                      /// אם אורך המערך טוגאראי שווה ל 5 אז
            $(".coins-coin-switch").each(function () {   /// לולאה עבור כל טוגל שנמצא בכל מטבע
                if (($(this).is(":not(:checked)"))) {    /// כל מה שלא מסומן כרגע - שגם לא יוכל להיות מסומן
                    $(this).prop("disabled", true);      /// לולאה זו מונעת שלא יהיו מעבר ל 5 מטבעות מסומנים בטוגל 
                }
            });
           
        }
        
    }
    else if ($(toggleDIV).is(":not(:checked)") && $(toggleDIV).prop("disabled") == false) {
        for (var i = 0; i < togArray.length; i++) {      /// זאת היא לולאה שעוברת על כל מערך הטוגלים ומזהה אם כבר קיים
            if (togArray[i][1] == param_code) {          /// המטבע במערך אז תוציא אותו מהמערך
                togArray.splice(i, 1);                   /// פקודת ההוצאה מהמערך
                break;                                   /// עצור את הלולאה
            }
        }

        if (togArray.length < 5) {
            $(".coins-coin-switch").each(function () {   /// כל עוד המערך של טוגאראי קטן מ 5 
                if (($(this).is(":not(:checked)"))) {    ///  כל מה שלא מסומן שיתאפשר לו להיות מסומן
                    $(this).prop("disabled", false);     ///  פותחים את הסוויץ לאפשרויות סימון נוספות
                }
            });
        }
    }
    else if (togArray.length == 5 && $(toggleDIV).prop("disabled") == true) {
        printCoinsToModal();
        $('#mymodal').css("display","block");
    }
    console.log(togArray.length);
}



function printCoinsToModal() {   ///פונקצייה המכניסה את המטבעות לתוך המודל
    $("#targettogbut").html("");   ///מנקה את המודל
    let html = "";    ///     מאפס את אייץ טי אמ אל
    for (var i = 0; i < togArray.length; i++) {       //// בונה לולאה להכנסת המטבע לתוך שורה במודל (היות וזאת טבלה 
            html += "<tr>";
            html += "<td>" + togArray[i][0] + "</td>";
            html += "<td>" + togArray[i][1] + "</td>";
            html += "<td><div class='modalslider_but'><label class='switch'><input class='modal-coin-switch' id='modal_coin_switch_"+togArray[i][1]+"' type='checkbox' data-toggle='toggle' checked><span class='slider round'></span></label></div></td>";
            html += "</tr>";
    }
    $("#targettogbut").html(html);    ////מכניס את אייץ טי אם אל לתוך המיקום בדך הראשי
}

$(".sveit").click(function(){
    $('#targettogbut .modal-coin-switch').each(function () {
        if ($(this).is(":not(:checked)")) {
            var symbol = $(this).parent().parent().parent().prev().html();
            var name = $(this).parent().parent().parent().prev().prev().html();
            for (var i = 0; i < togArray.length; i++) {      /// זאת היא לולאה שעוברת על כל מערך הטוגלים ומזהה אם כבר קיים
                if (togArray[i][1] == symbol) {          /// המטבע במערך אז תוציא אותו מהמערך
                    togArray.splice(i, 1);                   /// פקודת ההוצאה מהמערך
                    break;                                   /// עצור את הלולאה
                }
            }
            $("#coins_coin_switch_"+name).prop("checked", false);
        }
    });

    if (togArray.length < 5) {
        $('.coins-coin-switch').each(function () {
            if ($(this).prop("disabled") == true) {
                $(this).prop("disabled", false);
            }

        });

        $(tempTogArray[2]).prop("checked", true);
        funci(tempTogArray[0], tempTogArray[1], tempTogArray[2]);
    }

    $("#mymodal").hide();
});

function moreInfo(id, index) {
    console.log(id);

    getCoinInfoAsync(id, function (result) { //html פונקציה זו מקבלת איידי ומחזירה רזולט עי שקוראת לפונקציה אנונימית שאיתו בונים את 
        $("#info_" + id).html("");  //מנקה 

        $("#info_" + id).append("<div class='inside'>" + "<img src=" + result.image.large + " /></div><br/>"); //מוסיף את תמונת המטבע הנבחר
        $("#info_" + id).append("<div class='dollar'>1 " + result.name + " = " + result.market_data.current_price.usd.toFixed(7) + " $</div><br/>"); //מוסיף את ערך המטבע הנבחר לעומת הדולר
        $("#info_" + id).append("<div class='euro'>1 " + result.name + " = " + result.market_data.current_price.eur.toFixed(7) + " &#8364</div><br/>");//מוסיף את ערך המטבע הנבחר לעומת האירו
        $("#info_" + id).append("<div class='shekel'>1 " + result.name + " = " + result.market_data.current_price.ils.toFixed(7) + " &#8362</div><br/>");//מוסיף את ערך המטבע הנבחר לעומת השקל

        $("#" + index).append($("#info_" + id)); //מוסיף את כל האינפורמציה שהתקבלה ב אינפו עם קו תחתון לתוך איידי של שם המטבע
    });

}

/**
 * Put the info in the cache
 * @param {string} id 
 * @param {*} info 
 */
function cacheCoinInfo(id, info) {
    let coins = localStorage.coinsarray ? JSON.parse(localStorage.coinsarray) : {};
    coins[id] = {
        time: Date.now(),
        info: info,
    };
    localStorage.coinsarray = JSON.stringify(coins);
}

/**
 * Get info about the coin either from the cache or from an Ajax call
 * @param {string} id 
 * @param {function} callback 
 */
function getCoinInfoAsync(id, callback) {
    let coins = localStorage.coinsarray ? JSON.parse(localStorage.coinsarray) : {};
    if (coins[id] && Date.now() < coins[id].time + 120000) {
        callback(coins[id].info);
    } else {
        $.ajax({
            url: "https://api.coingecko.com/api/v3/coins/" + id, // The Address To Send The Request to
            type: "get", //the request protocol type
            data: {}, // the data we want to send to the server
            success: function (result) { // the callback function to run when we get the data back from the server
                cacheCoinInfo(id, result);
                callback(result);
            },
            error: function (xhr) {
                console.log("Error:", xhr);
            },

        });
    }


}

// building the modal //
    
    //activating the modal//
    $('#opnmodal').on("click", function(){
       $('#mymodal').css("display","block");
       printCoinsToModal();
    });
    
    //when clicking on x close the modal//
    $('.cls').on("click", function(){
        $('#mymodal').css("display","none");
    });

    

    function livereports(){
    //     $(".showallcoins").html("");
    $(".showallcoins").hide();
    $("#chartContainer").show();
         console.log(togArray);
         var dataPoints = [];
         var data=[];
         var chartTitles = "";
         for(i=0 ; i<togArray.length ; i++){
            dataPoints[i] = [];
            data.push({
                type: "line",
                xValueType: "dateTime",
                yValueFormatString: "$####.00",
                xValueFormatString: "hh:mm:ss TT",
                showInLegend: true,
                name: togArray[i][1],
                dataPoints: dataPoints[i]
            });
            chartTitles += togArray[i][1].toUpperCase();
            if (i != togArray.length - 1){
            chartTitles += ",";
            }

         }
         
         var chart = new CanvasJS.Chart("chartContainer", {
             zoomEnabled: true,
             title: {
                 text: "Live reports"
             },
             axisX: {
                 title: "chart updates every 2 secs",
                 labelFormatter:function(e){
                 return CanvasJS.formatDate(e.value,"mm:ss");
                 }
             },
             axisY:{
                 prefix: "$",
                 includeZero: false
             }, 
             toolTip: {
                 shared: true
             },
             legend: {
                 cursor:"pointer",
                 verticalAlign: "top",
                 fontSize: 22,
                 fontColor: "dimGrey",
                 itemclick : toggleDataSeries
             },
             data: data
         });
         
         function toggleDataSeries(e) {
             if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                 e.dataSeries.visible = false;
             }
             else {
                 e.dataSeries.visible = true;
             }
             chart.render();
         }
         
         var updateInterval = 3000;
         
         
         var time = new Date;
         // starting at 9.30 am
         time.setHours(0);
         time.setMinutes(0);
         time.setSeconds(00);
         time.setMilliseconds(00);

function getData(){
    $.getJSON("https://min-api.cryptocompare.com/data/pricemulti?fsyms="+chartTitles+"&tsyms=USD&api_key=cb7c350a2c94f1abfb7042120b7254740d32f96a529bdda151c27dafc978963a", updateChart);
}
         
         function updateChart(data) {
            console.log(data);
            time.setTime(time.getTime()+updateInterval);
         
             // pushing the new values
             for (i=0 ; i < togArray.length ; i++){
             
                           
             dataPoints[i].push({
                 x: time.getTime(),
                 y: data[togArray[i][1].toUpperCase()]["USD"]
             });
             }
             chart.render();
          }
         // generates first set of dataPoints 	
         liveReportsInterval = setInterval(function(){getData()}, updateInterval);
         
         }


function About(){
    $("#about").append("<div class='header'><h1>Snir Levi</h1></div>");
}         