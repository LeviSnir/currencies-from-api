
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
            console.log(result);
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
            url: "https://api.coingecko.com/api/v3/coins/"+search, // The Address To Send The Request to
            type: "get", //the request protocol type
            data: {}, // the data we want to send to the server
            success: function (result) { // the callback function to run when we get the data back from the server
                console.log(result);
                for (i=0 ; i>result.length ; i++){
                
                if(search == symbol){
                //    getAllCoins(result[i].id);
                   arrangeCoins(result[i].id);

                } 
            } 
        }    
            
            });
        }
    } 
    
   
function arrangeCoins(result) {     //זאת לולאה שמסדרת ומכניסה נתונים לכל מטבע ומטבע //
    for (i = 0; i < 20 ; i++) {
        let id = result[i].id;
        let cube = $("<div id='" + id + "'  class='col-md-3 cube'></div>");
        $(cube).append("<div>" + result[i].symbol.toUpperCase() + "</div><div class='slider_but'><label class='switch'><input type='checkbox'><span class='slider round'></span></label></div>");
        $(cube).append("<div>" + result[i].name + "</div><br/>");

        var inside = $("<div class='collapse card card-body' id='info_" + id + "'></div>"); // זהו הדיב שמגדיר את הקולפס //
        let but = $("<button type='button' class='btn btn-success'>More Info</button>"); // זהו הדיב של כפתור מידע נוסף //

        $(but).on("click", function () {
            $("#info_" + id).html("<img class='small-gif' src='images/bity.gif' />"); //פקודה שבלחיצה על הכפתור יראה גיף קטן

            moreInfo(id);    /// קריאה לפונקציה מידע נוסף
            $(`#info_` + id).collapse('toggle');     //הגדרת האיזור לקולפס
        });
        $(cube).append(but);     //הכנסת משתנה בוטון לתוך הקובייה של המטבע 
        $(cube).append(inside);    ///  הכנסת משתנה אינסייד לתוך קוביית המטבע
        // $(cube).append("<div class='btn btn-success' onclick='moreInfo(" + id + ")'>More Info" + "</div>");
        // $(cube).append(moreInfo(id));
        $(".showallcoins").append(cube);     /////הכנסת קוביה לתוך המסך הראשי לקלאס המתאים


    }

}

function moreInfo(id) {
    console.log(id);
    $.ajax({
        url: "https://api.coingecko.com/api/v3/coins/" + id, // The Address To Send The Request to
        type: "get", //the request protocol type
        data: {}, // the data we want to send to the server
        success: function (result) { // the callback function to run when we get the data back from the server
            // console.log(result);
            $("#info_" + id).html("");  //מנקה 
            
            $("#info_" + id).append("<div class='inside'>" + "<img src=" + result.image.large + " /></div><br/>"); //מוסיף את תמונת המטבע הנבחר
            $("#info_" + id).append("<div class='dollar'>1 " + result.name + " = " + result.market_data.current_price.usd.toFixed(7) + " $</div><br/>"); //מוסיף את ערך המטבע הנבחר לעומת הדולר
            $("#info_" + id).append("<div class='euro'>1 " + result.name + " = " + result.market_data.current_price.eur.toFixed(7) + " &#8364</div><br/>");//מוסיף את ערך המטבע הנבחר לעומת האירו
            $("#info_" + id).append("<div class='shekel'>1 " + result.name + " = " + result.market_data.current_price.ils.toFixed(7) + " &#8362</div><br/>");//מוסיף את ערך המטבע הנבחר לעומת השקל

            $("#" + id).append($("#info_" + id)); //מוסיף את כל האינפורמציה שהתקבלה ב אינפו עם קו תחתון לתוך איידי של שם המטבע
            
            var cry = {
                id : result.id,
                USD : result.market_data.current_price.usd.toFixed(7),
                EUR : result.market_data.current_price.eur.toFixed(7),
                ILS :result.market_data.current_price.ils.toFixed(7)
            };

            
            let arr = localStorage.coinsarray ? JSON.parse(localStorage.coinsarray) : [];
            //if(localStorage.coinsarray) {      אם קויינסאראי קיים בלוקל אז תיקח מהלוקל נתונים ותכניס לאראיי אחרת אראיי יהיה מערך ריק 
                // arr = JSON.parse(localStorage.coinsarray) }else { arr =[]; }        }
            if (0 <= arr.findIndex(function(cry) { //אם קיים אובייקט בשם 'קריי' בתוך מערך 'אריי' והוא שווה ל'איי די' אז תדפיס ללוג אחרת תוסיף למערך 
                return cry.id == id;
            })
            ) {
                console.log(cry.id);
            } else {
                arr.push(cry);
                // localStorage.coins_storage = JSON.stringify(arr_coins);
            }
            localStorage.coinsarray = JSON.stringify(arr);

            // for (let i = 0; i<arr.length; i++){
            //     console.log("ARR = " + arr[i].Name);
            //     if (arr[i].Name != result.name){
            //         arr.push(cry);
            //         localStorage.coinsarray=JSON.stringify(arr);
            //     }
            // }
        },
        error: function (xhr) {
            console.log("Error:", xhr);
        },

    });
}
