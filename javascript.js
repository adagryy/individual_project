var xx, yy; //COORDINATES ON THE PICTURE POINTED BY POINTER
var realWidth = 0,
    realHeight = 0; //REAL DIMENSIONS OF PICTURE IMPORTED FROM SERVER.


var lock_flag = false; //CHECKS IF THE IMAGE IS BLOCKED AFTER SETTING CORRECT DIMENSIONS

$(window).load(function() {
    $("#lock_button").hide();
    $("#reset_filters").hide();
    $(".jumbotron").height(1.5 * $(".jumbotron").width());
    //$("#image_display").width(150).height(100);
    $(".list-group").height(300);
    $(".col-sm-9").height(1.5 * $(".col-sm-9").width());
    initialize_app();
});

function initialize_app() {





    $("#lock_button").click(function() { //BLOCKS RESIZING AFTER FITTING THE CORRECT IMAGE DIMENSIONS BY HAND
        lock_flag = true;
        $("#lock_button").hide();
        $("#ddd").resizable("destroy");
        changeBrightness_Contrast();
    });







    $("#reset_filters").click(function() { //RESETS IMAGE FILTERS AFTER CLICKING "RESET FILTERS BUTTON"
        $('#slider').slider('value', 100);
        $("#amount").val($("#slider").slider("value"));
        $('#slider2').slider('value', 100);
        $("#amount2").val($("#slider2").slider("value"));
        changeBrightness_Contrast();
    });

}

function changeBrightness_Contrast() {
    if (lock_flag === true) {
        var brightness = document.getElementById('ddd'),
            brightnessval = parseInt($("#slider").slider("value"));
        var contrast = document.getElementById('ddd'),
            contrastval = parseInt($("#slider2").slider("value"));
        //console.log(val);
        // if (val > 201 || val < -50)
        //   return false;
        //console.log(val);
        //brightness.style.brightness((val + 50)/100);
        //brightness.style.backgroundColor = val > 0 ? 'white' : 'black';
        //$("#sd").css({backgroundColor: 'black'});
        //var q = "brightness(" + String(val) + "%)"
        //console.log(q);
        //console.log(brightnessval, val, "brightness(" + String(brightnessval) + "%)" + " contrast(" + String(val) + "%)");

        //contrast.style.WebkitFilter = "contrast(" + String(val) + "%)";
        brightness.style.WebkitFilter = "brightness(" + String(brightnessval) + "%)" + " contrast(" + String(contrastval) + "%)"; //changes both brightness and contrast in the same time
        //i.e: "brightness(154%) contrast(172%)" - exemplary set describing bringtness and contrast
    }
}

function load_image() {
    var filename = null;
    filename = $('input[type=file]').val().split('\\').pop();
    // getMeta();
    // sleep(100);
    return filename == '' ? null : filename;
}

function getMeta() {
    var url = "images/" + load_image()
    var img = new Image();
    img.onload = function() {
        realWidth = this.width;
        realHeight = this.height;
    };
    img.src = url;
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

function show_image() {

    if (load_image() != null) {


        //setTimeout(function(){
        $("#span_button").hide();
        $("#show_image_button").hide();
        $("#reset_filters").show();
        $("#lock_button").show();
        var imag;
        imag = document.createElement('img');
        imag.id = 'ddd';
        imag.src = "images/" + load_image();
        getMeta();
        setTimeout(function() {
            //var h = document.querySelector('#ddd').naturalHeight;

            //alert(realWidth);

            //
            // photograf = new Image();
            // photograf.src = "images/" + load_image();
            // var widthd = photograf.width;
            // var heightd = photograf.height;
            //
            // $("#image_display").width(widthd).height(heightd);
            // alert(String(widthd));
            //alert(realWidth + " x " + realHeight);
            // alert(realWidth + 'x' + realHeight);
            if (realWidth > 1000) {
                imag.width = Math.round(realWidth / 3);
                imag.height = Math.round(realHeight / 3);

            } else {
                imag.width = realWidth;
                imag.height = realHeight;
            }
            // imag.width = realWidth;
            // imag.height = realHeight;
            //$('#image_display').draggable({ containment: ".jumbotron" });
            // $("#image_display").empty();
            $(".col-sm-9").append(imag);

            $(function() {
                $("#ddd").resizable({
                    containment: ".col-sm-9",
                    aspectRatio: true
                });
            });
            // $('#image_display').resize(function() {
            //     $(this).find("#ddd").css("width", "100%");
            //     $(this).find("#ddd").css("height", "100%");
            // });
            $("#ddd").on("mousemove", function(event) {
                // console.log(xx + " " + event.pageY);
                var myImg = document.getElementById('ddd');
                GetCoordinates(myImg);
                // document.getElementById("x").innerHTML = event.pageX;
                // document.getElementById("y").innerHTML = event.pageY;
            });
            $('#ddd').on('contextmenu', function(evt) { //BLOCKS CONTEXTMENU APPEARING WHEM RIGHT CLICK
                evt.preventDefault();
            });
            $("#ddd").mouseup(function(evt) { //DOUBLE CLICK RMB HANDLNG MACHINERY
                if (evt.which === 3) { //CHECKING IF RIGHT MOUSE BUTTON WAS PRESSED
                    if (evt.originalEvent.detail === 2) {
                        if (lock_flag === true) {
                            $("#data-list-group2").append("X: " + String(xx) + " Y: " + String(yy) + "<br>");
                            document.getElementById("info").innerHTML = "Współrzędna X: " + String(xx) + "<br> Współrzędna Y: " + String(yy);
                        }
                    }
                }
            });

            $("#ddd").dblclick(function() { //IT TYPES COORDINATES TO THE TABLE
                if (lock_flag === true)
                    $("#data-list-group1").append("X: " + String(xx) + " Y: " + String(yy) + "<br>");
                document.getElementById("info").innerHTML = "Współrzędna X: " + String(xx) + "<br> Współrzędna Y: " + String(yy);
            });
        }, 100);
    }

}

function reload_page() {
    location.reload();
}

function FindPosition(oElement) {
    if (typeof(oElement.offsetParent) != "undefined") {
        for (var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent) {
            posX += oElement.offsetLeft;
            posY += oElement.offsetTop;
        }
        return [posX - 1, posY];
    } else {
        return [oElement.x, oElement.y];
    }
}

function GetCoordinates(myImg) {

    if (lock_flag === true) {
        var PosX = 0;
        var PosY = 0;
        var ImgPos;
        ImgPos = FindPosition(myImg);
        if (!e) var e = window.event;
        if (e.pageX || e.pageY) {
            PosX = e.pageX;
            PosY = e.pageY;
        } else if (e.clientX || e.clientY) {
            PosX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            PosY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        PosX = PosX - ImgPos[0];
        PosY = PosY - ImgPos[1];
        var img_width = document.getElementById("ddd").width;
        var img_height = document.getElementById("ddd").height;
        xx = Math.round(PosX / img_width * realWidth);//SCALING TO DIMENSIONS OF ORIGINAL IMAGE
        yy = Math.round(PosY / img_height * realHeight);
        console.log(img_width);
        document.getElementById("x").innerHTML = xx;
        document.getElementById("y").innerHTML = yy;
        //console.log(xx + " " + event.pageY);
        
    }
}


/*
function load(){
  var xhttp;
  if(window.XMLHttpRequest){
    xhttp = new XMLHttpRequest();
  }else{
    xhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xhttp.onreadystatechange = function(){
    if(xhttp.readyState == 4 && xhttp.status == 200){
      document.getElementById("content").innerHTML = xhttp.responseText;
    }
  }
  xhttp.open("GET", "dlaajaxa.txt", true);
  xhttp.send();
}
*/




/*
if (load_image() != null) {
    $("#span_button").hide();
    $("#show_image_button").hide();
    $("#reset_filters").show();
    $("#lock_button").show();
    var imag;
    imag = document.createElement('img');
    imag.id = 'ddd';
    imag.src = "images/" + load_image();
    getMeta(imag.src);
    //sleep(1000);
    //setTimeout(function(){
      //alert(realWidth);

      //
      // photograf = new Image();
      // photograf.src = "images/" + load_image();
      // var widthd = photograf.width;
      // var heightd = photograf.height;
      //
      // $("#image_display").width(widthd).height(heightd);
      // alert(String(widthd));
      alert(realWidth + " x " + realHeight);
      if(realWidth > 1000 ){
        imag.width = realWidth / 10;
        imag.height = realHeight / 10;

      }
      else{
        imag.width = realWidth;
        imag.height = realHeight;
      }



      //$('#image_display').draggable({ containment: ".jumbotron" });
      $("#image_display").empty();
      $("#image_display").append(imag);

      $(function() {
          $("#image_display").resizable({
              containment: ".col-sm-9",
              aspectRatio: true
          });
      });
      $('#image_display').resize(function() {
          $(this).find("#ddd").css("width", "100%");
          $(this).find("#ddd").css("height", "100%");
    })

  //},100);


}
*/
