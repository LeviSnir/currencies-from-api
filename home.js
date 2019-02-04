
$(document).ready(function () {

     $("#home").on("click", function () {
        getAllCoins();
    });
    $("#searchcoin").on("click", function () {
        serachCoins();
    });

    
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
    let search = $("#search_box").val();
    console.log("SEARCH= " + search);
    if (search == "") {
        getAllCoins();
    }
    else {
        
        $.ajax({
            url: "https://api.coingecko.com/api/v3/coins/list", // The Address To Send The Request to
            type: "get", //the request protocol type
            data: {}, // the data we want to send to the server
            success: function (result) { // the callback function to run when we get the data back from the server
                console.log(result);
                for(a=0 ; a<result.length ; a++){
                if(search === result[a].symbol){
                $(".showallcoins").html("<img class='large-gif' src='images/bity.gif' />")
                let id = result[a].id;
                let cube = $("<div id='" + id + "'  class='onecube'></div>"); //מגדיר את הריבוע למטבע המתאים
                $(cube).append("<div>" + result[a].symbol.toUpperCase() + "</div>");//מכניס סמל המטבע
                let togbut = $("<div class='slider_but'><label class='switch'><input id='toggle-event"+i+"' type='checkbox' data-toggle='toggle'><span class='slider round'></span></label></div>");//מכניס טוגל סוויץ
                $(cube).append(togbut);
                $("#toggle-event"+i).change(function(){console.log("finaly!!")});
                
                $(cube).append("<div>" + result[a].name + "</div><br/>");//מכניס את השם של המטבע

                var inside = $("<div class='collapse card card-body' id='info_" + id + "'></div>"); // זהו הדיב שמגדיר את הקולפס //
                let but = $("<button type='button' class='btn btn-success'>More Info</button>"); // זהו הדיב של כפתור מידע נוסף //

                $(but).on("click", function () {
                $("#info_" + id).html("<img class='small-gif' src='images/bity.gif' />"); //פקודה שבלחיצה על הכפתור יראה גיף קטן

                moreInfo(id);    /// קריאה לפונקציה מידע נוסף
                $(`#info_` + id).collapse('toggle');     //הגדרת האיזור לקולפס
                      });
                $(cube).append(but);     //הכנסת משתנה בוטון לתוך הקובייה של המטבע 
                $(cube).append(inside);    ///  הכנסת משתנה אינסייד לתוך קוביית המטבע
                $(".showallcoins").html("");
                $(".showallcoins").append(cube);     /////הכנסת קוביה לתוך המסך הראשי לקלאס המתאים
                    }
                }
            }
                })
            }

        }
    



function arrangeCoins(result) {     //זאת לולאה שמסדרת ומכניסה נתונים לכל מטבע ומטבע //
    for (let i = 0; i < 50; i++) {
        let id = result[i].id;
        let cube = $("<div id='" + i + "'  class='col-md-3 cube'></div>");
        $(cube).append("<div>" + result[i].symbol.toUpperCase() + "</div>");//מכניס סמל המטבע
        $(cube).append("<div class='slider_but'><label class='switch'><input id='"+id+"' type='checkbox' data-toggle='toggle'><span class='slider round'></span></label></div>");//מכניס טוגל סוויץ
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
            funci(result[i].id, result[i].symbol);
        });
    
    }

}


function funci(param_name,param_code){
    if ($("input:checkbox[type='checkbox']").attr(':checked'));{
    let togobj = localStorage.togbutarray ? JSON.parse(localStorage.togbutarray) : [{}];
    togobj = {
        name : param_name,
        symbol : param_code,
    };
    localStorage.togbutarray = localStorage.togbutarray + togobj;
    localStorage.togbutarray = JSON.stringify(togobj);
    

    let row = $("<tr><td>"+param_name+"</td><td>"+param_code+"</td><td><div class='modalslider_but'><label class='switch'><input type='checkbox' checked data-toggle='toggle'><span class='slider round'></span></label></div></td>")
    $("#targettogbut").append(row);
}
}


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
    });
    
    //when clicking on x close the modal//
    $('.close').on("click", function(){
        $('#mymodal').css("display","none");
    });

    