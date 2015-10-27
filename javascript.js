var xx, yy;

$(window).load(function() {
    $(".jumbotron").height(1.5 * $(".jumbotron").width());
    $("#image_display").width(100).height(100);
    $(".list-group").height(300);
    $(".col-sm-9").height(1.5* $(".col-sm-9").width());
    dd();
});

function dd() {
    $("#image_display").dblclick(function() {
        $("#data-list-group").append("X: " + String(xx) + " Y: " + String(yy) + "<br>");
    });
    $("#lock_button").click(function(){
      $("#image_display").resizable("destroy");
    });

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
        var img = document.createElement("img");
        img.id = "ddd";
        img.src = "images/" + load_image();
        img.width = 100;
        img.height = 100;

        //$('#image_display').draggable({ containment: ".jumbotron" });
        $("#image_display").empty();
        $("#image_display").append(img);
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
