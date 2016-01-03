var xx, yy, axx, ayy; //COORDINATES ON THE PICTURE POINTED BY POINTER

var realWidth = 0,
    realHeight = 0; //REAL DIMENSIONS OF PICTURE IMPORTED FROM SERVER.

var lock_flag = false; //CHECKS IF THE IMAGE IS BLOCKED AFTER SETTING CORRECT DIMENSIONS

var canvas, ctx;

var imag;

$(window).load(function() {
    $("#lock_button").hide();
    $("#reset_filters").hide();
    $(".jumbotron").height(1.5 * $(".jumbotron").width());
    $(".list-group").height(300);
    $(".col-sm-9").height(1.5 * $(".col-sm-9").width());
    initialize_app();
});

function initialize_app() {
    $("#lock_button").click(function() { //BLOCKS RESIZING AFTER FITTING THE CORRECT IMAGE DIMENSIONS BY HAND
        lock_flag = true;
        $("#lock_button").hide();
        $("#ddd").resizable("destroy");

        // wheelzoom(document.querySelectorAll('#myCanvas')); //ZOOMING BY SCROOL

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
        //FIREFOX:
        // brightness.style.filter = "brightness(" + String(brightnessval) + "%)" + " contrast(" + String(contrastval) + "%)"
        //CHROME, SAFARI, OPERA
        brightness.style.WebkitFilter = "brightness(" + String(brightnessval) + "%)" + " contrast(" + String(contrastval) + "%)"; //changes both brightness and contrast in the same time
        //i.e: "brightness(154%) contrast(172%)" - exemplary set describing bringtness and contrast
    }
}

function calculateZoomCoordinates() {

    var position = $("#ddd").css('backgroundPosition').split(" ");

    var backgroundPosX = Math.abs(parseInt(position[0].replace("px", "")));
    var backgroundPosY = Math.abs(parseInt(position[1].replace("px", "")));
    // var backgroundPosX = Math.abs(parseInt($("#ddd").css('backgroundPosition-x').replace("px", "")));
    // var backgroundPosY = Math.abs(parseInt($("#ddd").css('backgroundPosition-y').replace("px", "")));

    var backgroundSize = $("#ddd").css('backgroundSize').split(" ");

    //console.log(backgroundSize);

    var backgroundSizeX = parseInt(backgroundSize[0].replace("px", ""));
    var backgroundSizeY = 10000; //parseInt(backgroundSize[1].replace("px", ""));

    xx = Math.round((backgroundPosX + axx) / backgroundSizeX * realWidth);
    yy = Math.round((backgroundPosY + ayy) / backgroundSizeY * realHeight);

    //console.log(backgroundPosX + " " + backgroundPosY);

    document.getElementById("x").innerHTML = xx;
    document.getElementById("y").innerHTML = yy;
}

function load_image() {
    var filename = null;
    filename = $('input[type=file]').val().split('\\').pop();
    return filename == '' ? null : filename;
}

function getMeta() { //FETCHES NATURAL DIMENSIONS OF AN IMAGE FROM SERVER, 
    var url = "images/" + load_image();
    var img = new Image();
    img.onload = function() { //THIS ONLOAD METHOD IS THE REASON OF USING SETIMEOUT() METHOD TO DELAY PROGRAM IN ORDER TO WAITING IMAGE RESOLUTION.
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

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function show_image() {

    if (load_image() != null) {
        $("#span_button").hide();
        $("#show_image_button").hide();
        $("#reset_filters").show();
        $("#lock_button").show();

        var canvas = document.createElement('canvas');
        canvas.id = "myCanvas";
        var ctx = canvas.getContext("2d");

        $(".col-sm-9").append(canvas);


        imag = document.createElement('img');
        imag.id = 'ddd';
        imag.src = "images/" + load_image();
        getMeta();

        setTimeout(function() { //DELAY (WAITING FOR IMAGE DIMENSIONS)
            if (realWidth > 1000) {
                ctx.canvas.width = realWidth / 3;
                ctx.canvas.height = realHeight / 3;
                //ctx.drawImage(imag, 0, 0, realWidth / 3, realHeight / 3);
                //imag.onload = function(){
                ctx.drawImage(imag, 0, 0, realWidth / 3, realHeight / 3);
                //}
                // imag.width = Math.round(realWidth / 3);
                // imag.height = Math.round(realHeight / 3);

            } else {
                ctx.canvas.width = realWidth;
                ctx.canvas.height = realHeight;
                //imag.onload = function(){
                ctx.drawImage(imag, 0, 0, realWidth, realHeight);
                //}
                // imag.width = realWidth;
                // imag.height = realHeight;
            }

            // $(".col-sm-9").append(imag);
            $("canvas").append(imag);
            //ctx.drawImage(imag, 0, 0, realWidth, realHeight);

            $(function() {
                $("#ddd").resizable({
                    containment: ".col-sm-9",
                    aspectRatio: true
                });
            });

            $('#ddd').on("mousemove", function(event) {
                var myImg = document.getElementById('ddd');
                console.log("move detected");
                GetCoordinates(myImg);
            });

            $('#ddd').on("mousewheel", function(event) {
                console.log(getMousePos(canvas, event));
            });

            $('#ddd').on("mousemove", function(event) {
                var myImg = document.getElementById('ddd');
                GetCoordinates(myImg);
            });

            $('ddd').on('contextmenu', function(evt) { //BLOCKS CONTEXTMENU APPEARING WHEM RIGHT CLICK
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
            // var galaxy = new CanvasZoom( document.getElementById('myCanvas'), "images/",  1500,  1000 );
            changeBrightness_Contrast();
            init_canvas();
        }, 100);

    }

}

function rerender() {
    var canvas = document.getElementById('myCanvas');

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

        axx = PosX;
        ayy = PosY;

        xx = Math.round(PosX / img_width * realWidth); //SCALING TO DIMENSIONS OF ORIGINAL IMAGE
        yy = Math.round(PosY / img_height * realHeight);

        calculateZoomCoordinates();
    }
}


//===================================================================================================
function redraw() {
    // Clear the entire canvas
    var p1 = ctx.transformedPoint(0, 0);
    var p2 = ctx.transformedPoint(canvas.width, canvas.height);
    ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);

    ctx.drawImage(imag, 0, 0, realWidth / 3, realHeight / 3);

    // Alternatively:
    // ctx.save();
    // ctx.setTransform(1,0,0,1,0,0);
    // ctx.clearRect(0,0,canvas.width,canvas.height);
    // ctx.restore();

    // ctx.drawImage(gkhead,200,50);

    // ctx.beginPath();
    // ctx.lineWidth = 20;
    // ctx.moveTo(399, 250);
    // ctx.lineTo(474, 256);
    ctx.stroke();

    ctx.save();
    ctx.translate(4, 2);
    // ctx.beginPath();
    // ctx.lineWidth = 10;
    // ctx.moveTo(436, 253);
    // ctx.lineTo(437.5, 233);
    ctx.stroke();

    ctx.save();
    ctx.translate(438.5, 223);
    ctx.strokeStyle = '#06c';
    // ctx.beginPath();
    // ctx.lineWidth = 0.05;
    // for (var i = 0; i < 60; ++i) {
    //     ctx.rotate(6 * i * Math.PI / 180);
    //     ctx.moveTo(9, 0);
    //     ctx.lineTo(10, 0);
    //     ctx.rotate(-6 * i * Math.PI / 180);
    // }
    ctx.stroke();
    ctx.restore();

    // ctx.beginPath();
    // ctx.lineWidth = 0.2;
    // ctx.arc(438.5, 223, 10, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // ctx.drawImage(ball,379,233,40,40);
    // ctx.drawImage(ball,454,239,40,40);
    // ctx.drawImage(ball,310,295,20,20);
    // ctx.drawImage(ball,314.5,296.5,5,5);
    // ctx.drawImage(ball,319,297.2,5,5);
}

function init_canvas() {
    canvas = document.getElementsByTagName('canvas')[0];
    canvas.width = 800;
    canvas.height = 600;
    ctx = canvas.getContext('2d');
    trackTransforms(ctx);

    redraw();

    var lastX = canvas.width / 2,
        lastY = canvas.height / 2;
    var dragStart, dragged;
    canvas.addEventListener('mousedown', function(evt) {
        document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
        // console.log(lastX + ", " + lastY);
        dragStart = ctx.transformedPoint(lastX, lastY);
        dragged = false;
    }, false);
    canvas.addEventListener('mousemove', function(evt) {
        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
        dragged = true;
        if (dragStart) {
            var pt = ctx.transformedPoint(lastX, lastY);
            ctx.translate(pt.x - dragStart.x, pt.y - dragStart.y);
            redraw();
        }
    }, false);
    canvas.addEventListener('mouseup', function(evt) {
        dragStart = null;
        if (!dragged) zoom(evt.shiftKey ? -1 : 1);
    }, false);

    var scaleFactor = 1.1;
    var zoom = function(clicks) {
        var pt = ctx.transformedPoint(lastX, lastY);
        ctx.translate(pt.x, pt.y);
        var factor = Math.pow(scaleFactor, clicks);
        ctx.scale(factor, factor);
        ctx.translate(-pt.x, -pt.y);
        redraw();
    }

    var handleScroll = function(evt) {
        console.log("handled");
        var delta = evt.wheelDelta ? evt.wheelDelta / 40 : evt.detail ? -evt.detail : 0;
        if (delta) zoom(delta);
        return evt.preventDefault() && false;
    };

    canvas.addEventListener('DOMMouseScroll', handleScroll, false);
    canvas.addEventListener('mousewheel', handleScroll, false);
    canvas.addEventListener("click", function() {
        ctx.beginPath();
        ctx.fillRect(10,15,3,3);
        // ctx.moveTo(20, 20);
        // ctx.lineTo(20, 100);
        // ctx.lineTo(70, 100);
        ctx.fillStyle = "white";
        ctx.stroke();

        console.log("sdf");
    });
}

function trackTransforms(ctx) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
    var xform = svg.createSVGMatrix();
    ctx.getTransform = function() {
        return xform;
    };

    var savedTransforms = [];
    var save = ctx.save;
    ctx.save = function() {
        savedTransforms.push(xform.translate(0, 0));
        return save.call(ctx);
    };
    var restore = ctx.restore;
    ctx.restore = function() {
        xform = savedTransforms.pop();
        return restore.call(ctx);
    };

    var scale = ctx.scale;
    ctx.scale = function(sx, sy) {
        xform = xform.scaleNonUniform(sx, sy);
        return scale.call(ctx, sx, sy);
    };
    var rotate = ctx.rotate;
    ctx.rotate = function(radians) {
        xform = xform.rotate(radians * 180 / Math.PI);
        return rotate.call(ctx, radians);
    };
    var translate = ctx.translate;
    ctx.translate = function(dx, dy) {
        xform = xform.translate(dx, dy);
        return translate.call(ctx, dx, dy);
    };
    var transform = ctx.transform;
    ctx.transform = function(a, b, c, d, e, f) {
        var m2 = svg.createSVGMatrix();
        m2.a = a;
        m2.b = b;
        m2.c = c;
        m2.d = d;
        m2.e = e;
        m2.f = f;
        xform = xform.multiply(m2);
        return transform.call(ctx, a, b, c, d, e, f);
    };
    var setTransform = ctx.setTransform;
    ctx.setTransform = function(a, b, c, d, e, f) {
        xform.a = a;
        xform.b = b;
        xform.c = c;
        xform.d = d;
        xform.e = e;
        xform.f = f;
        return setTransform.call(ctx, a, b, c, d, e, f);
    };
    var pt = svg.createSVGPoint();
    ctx.transformedPoint = function(x, y) {
        pt.x = x;
        pt.y = y;
        return pt.matrixTransform(xform.inverse());
    }
}
