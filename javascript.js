var xx, yy;
var imag;

var lock_flag = false;//CHECKS IF THE IMAGE IS BLOCKED AFTER SETTING CORRECT DIMENSIONS

$(window).load(function() {
    $("#lock_button").hide();
    $(".jumbotron").height(1.5 * $(".jumbotron").width());
    $("#image_display").width(150).height(100);
    $(".list-group").height(300);
    $(".col-sm-9").height(1.5* $(".col-sm-9").width());
    initialize_app();
});

function initialize_app() {
    $("#image_display").dblclick(function() {
      if(lock_flag === true)
        $("#data-list-group1").append("X: " + String(xx) + " Y: " + String(yy) + "<br>");
    });

    $("#lock_button").click(function(){//BLOCKS RESIZING AFTER FITTING THE CORRECT IMAGE DIMENSIONS BY HAND
      lock_flag = true;
      $("#lock_button").hide();
      $("#image_display").resizable("destroy");
    });

    $('#image_display').on('contextmenu', function (evt) {
      evt.preventDefault();//BLOCKS CONTEXTMENU APPEARING WHEM RIGHT CLICK
    });

    $("#image_display").mouseup(function(evt){
      if(evt.which === 3){//CHECKING IF RIGHT MOUSE BUTTON WAS PRESSED
        if (evt.originalEvent.detail === 2){
          if(lock_flag === true){
            $("#data-list-group2").append("X: " + String(xx) + " Y: " + String(yy) + "<br>");
            document.getElementById("info").innerHTML = "Współrzędna X: " + String(xx) + "<br> Współrzędna Y: " + String(yy);
          }
        }
      }
    });


}
function changeBrightness(){
  var brightness = document.getElementById('ddd'),
      val        = parseInt($( "#slider" ).slider( "value" ));
      console.log(val);
      if (val > 100 || val < -50)
        return false;
        console.log(val);
        //brightness.style.brightness((val + 50)/100);
        //brightness.style.backgroundColor = val > 0 ? 'white' : 'black';
        //$("#sd").css({backgroundColor: 'black'});
        var q = "brightness(" + String(val) + "%)"
        console.log(q);
        brightness.style.WebkitFilter = q;
}
function load_image() {
    var filename = null;
    filename = $('input[type=file]').val().split('\\').pop();
    return filename == '' ? null : filename;
}

function show_image() {

    if (load_image() != null) {
        $("#span_button").hide();
        $("#show_image_button").hide();
        $("#lock_button").show();
        imag = document.createElement('img');
        imag.id = 'ddd';
        imag.src = "images/" + load_image();
        //
        // photograf = new Image();
        // photograf.src = "images/" + load_image();
        // var widthd = photograf.width;
        // var heightd = photograf.height;
        //
        // $("#image_display").width(widthd).height(heightd);
        // alert(String(widthd));
        imag.width = 150;
        imag.height = 100;




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
        });
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

function GetCoordinates(e) {
  if(lock_flag === true){
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
      document.getElementById("x").innerHTML = PosX;
      document.getElementById("y").innerHTML = PosY;

      xx = PosX;
      yy = PosY;
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
