var realWidth = 0,
    realHeight = 0; //REAL DIMENSIONS OF PICTURE IMPORTED FROM SERVER.

var lock_flag = false; //CHECKS IF THE IMAGE IS BLOCKED AFTER SETTING CORRECT DIMENSIONS

var canvas, ctx;

var imag;

var canvas_width, canvas_height;

//-----------------------------
var coordinates_object; // global variable for storing JSON object during saving and reading coordinates form 'coordinates_array' array
var coordinates_array = new Array(); //main array for storing coordinates
//-----------------------------

//THIS OBJECT LETS YOU CONFIGURE AND MANAGE ALL APP PARAMETERS
var config_JSON_object = {
    "defalut_jumbotron_height_factor": 1.5,
    "list_group_default_height": 300,
    "delay": 100, //miliseconds - time to wait for real dimensions of the image
    "power": 2,
    /* !!!DANGER!!! DO NOT CHANGE THE VALUE OF POWER!!! IT WILL CAUSE PROBLEMS WITH DEFINING DISTANCE DURING REMOVING MARKERS!!! */
    "marker_width_and_height": 4, //I assume, that marker is square
    "distance": 8, //this parameter is used to remove marker from image - if you click closer, that 8 pixels, marker will be removed
    "scale_factor": 1.01, //when the image is resized by wheelmouse button, its size changes 1.01 times
    "slider_min_value": 0, //min value for contrast and brightness slider
    "slider_max_value": 400, //max value for contrast and brightness slider
    "slider_default_value": 100, //default value for contrast and brightness slider
    "default_brightness_reset_value": 100,
    "default_contrast_reset_value": 100
}

$(window).load(function() {
    $("#lock_button").hide();
    $("#reset_filters").hide();
    $(".jumbotron").height(config_JSON_object.defalut_jumbotron_height_factor * $(".jumbotron").width());
    $(".list-group").height(config_JSON_object.list_group_default_height);
    $(".col-sm-9").height(config_JSON_object.defalut_jumbotron_height_factor * $(".col-sm-9").width());
    initialize_app();
    $.getScript("data.js"); //LOAD EXTERNAL "data.js" SCRIPT
});

function initialize_app() {
    $("#lock_button").click(function() { //BLOCKS RESIZING AFTER FITTING THE CORRECT IMAGE DIMENSIONS BY HAND
        lock_flag = true;
        $("#lock_button").hide();
        changeBrightness_Contrast();
    });
    $("#reset_filters").click(function() { //RESETS IMAGE FILTERS AFTER CLICKING "RESET FILTERS BUTTON"
        $('#slider').slider('value', config_JSON_object.default_brightness_reset_value);
        $("#amount").val($("#slider").slider("value"));
        $('#slider2').slider('value', config_JSON_object.default_contrast_reset_value);
        $("#amount2").val($("#slider2").slider("value"));
        changeBrightness_Contrast();
    });

    $(function() { //CHANGE BRIGHTNESS SLIDER HANDLER
        $("#slider").slider({
            orientation: "vertical",
            range: "min",
            min: config_JSON_object.slider_min_value,
            max: config_JSON_object.slider_max_value,
            value: config_JSON_object.slider_default_value,
            slide: function(event, ui) {
                $("#amount").val(ui.value);
                changeBrightness_Contrast();
            }
        });
        $("#amount").val($("#slider").slider("value")); //inserts the beginning value of the slider
    });

    $(function() { //CHANGE CONTRAST SLIDER HANDLER
        $("#slider2").slider({
            orientation: "vertical",
            range: "min",
            min: config_JSON_object.slider_min_value,
            max: config_JSON_object.slider_max_value,
            value: config_JSON_object.slider_default_value,
            slide: function(event, ui) {
                $("#amount2").val(ui.value);
                changeBrightness_Contrast();
            }
        });
        $("#amount2").val($("#slider2").slider("value")); //inserts the beginning value of the slider
    });

}

function changeBrightness_Contrast() {
    if (lock_flag === true) {
        var brightness = document.getElementById('myCanvas'),
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

function show_image() {

    if (load_image() != null) {
        $("#span_button").hide();
        $("#show_image_button").hide();
        $("#reset_filters").show();
        $("#lock_button").show();

        var canvas = document.createElement('canvas');
        canvas.id = "myCanvas";
        ctx = canvas.getContext("2d");

        $(".col-sm-9").append(canvas);

        imag = document.createElement('img');
        imag.id = 'ddd';

        imag.src = "images/" + load_image();
        getMeta();

        setTimeout(function() { //DELAY (WAITING FOR IMAGE DIMENSIONS)
            var workplace_width = document.getElementById("image").offsetWidth;
            var factor = realWidth / workplace_width;

            canvas_width = realWidth / factor;
            canvas_height = realHeight / factor;

            ctx.canvas.width = canvas_width;
            ctx.canvas.height = canvas_height;
            imag.width = canvas_width;
            imag.height = canvas_height;

            ctx.drawImage(imag, 0, 0, canvas_width, canvas_height);

            $("canvas").append(imag);

            $('#myCanvas').on('contextmenu', function(evt) { //BLOCKS CONTEXTMENU APPEARING WHEM RIGHT CLICK
                evt.preventDefault();
            });

        }, config_JSON_object.delay);
        init_canvas();
    }

}

function reload_page() {
    location.reload();
}

//===================================================================================================
function redraw() {
    // Clear the entire canvas
    var p1 = ctx.transformedPoint(0, 0);
    var p2 = ctx.transformedPoint(canvas.width, canvas.height);
    ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);

    ctx.drawImage(imag, 0, 0, canvas_width, canvas_height);

}

function init_canvas() {
    canvas = document.getElementsByTagName('canvas')[0];

    ctx = canvas.getContext('2d');
    trackTransforms(ctx);

    redraw();

    var lastX = canvas.width / 2,
        lastY = canvas.height / 2;
    var dragStart, dragged;
    canvas.addEventListener('mousedown', function(evt) {
        //debugger;
        document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);

        dragStart = ctx.transformedPoint(lastX, lastY);
        dragged = false;
    }, false);
    canvas.addEventListener('mousemove', function(evt) {

        lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
        var pt = ctx.transformedPoint(lastX, lastY);

        var xCoor = Math.round((pt.x / canvas_width) * realWidth);
        var yCoor = Math.round((pt.y / canvas_height) * realHeight);

        if (xCoor >= 0 && xCoor <= realWidth && yCoor >= 0 && yCoor <= realHeight) {
            document.getElementById("x").innerHTML = xCoor;
            document.getElementById("y").innerHTML = yCoor;
        }

        dragged = true;
        if (dragStart) {
            var pt = ctx.transformedPoint(lastX, lastY);
            ctx.translate(pt.x - dragStart.x, pt.y - dragStart.y);

            redraw(); //redrawing during dragging image; (redrawing points is after mouseup event [we are releasing mouse button at dragging finish - function 'zoom'])
        }
    }, false);
    canvas.addEventListener('mouseup', function(evt) {
        if (dragged) { //<----------------------------------------------------------------------if the image has been dragged
            draw_points(); //we are redrawing points after moving (in fact, after releasing MB) image---^
        }
        dragStart = null;
        //if (!dragged) zoom(evt.shiftKey ? -1 : 1);
    }, false);

    var scaleFactor = config_JSON_object.scale_factor;
    var zoom = function(clicks) {
        var pt = ctx.transformedPoint(lastX, lastY);
        ctx.translate(pt.x, pt.y);
        var factor = Math.pow(scaleFactor, clicks);
        ctx.scale(factor, factor);
        ctx.translate(-pt.x, -pt.y);
        redraw(); //redrawing image and points during scaling image
        draw_points();
    }

    var handleScroll = function(evt) {
        var delta = evt.wheelDelta ? evt.wheelDelta / 40 : evt.detail ? -evt.detail : 0;
        if (delta) zoom(delta); //here in zoom is rerendering image and points during scaling using mousewheel
        return evt.preventDefault() && false;
    };

    canvas.addEventListener('DOMMouseScroll', handleScroll, false);

    canvas.addEventListener('mousewheel', handleScroll, false);

    canvas.addEventListener("dblclick", function(evt) {
        if (lock_flag === true) {
            var X = evt.offsetX || (evt.pageX - canvas.offsetLeft);
            var Y = evt.offsetY || (evt.pageY - canvas.offsetTop);
            var pt = ctx.transformedPoint(X, Y);
            var pt2 = ctx.transformedPoint(0, 0);

            var xCoor = Math.round((pt.x / canvas_width) * realWidth);
            var yCoor = Math.round((pt.y / canvas_height) * realHeight);

            coordinates_object = {
                "x_on_screen": Math.round(pt.x),
                "y_on_screen": Math.round(pt.y),
                "x_in_real": xCoor,
                "y_in_real": yCoor,
                "color": String(0)
            };

            coordinates_array.push(coordinates_object);

            draw_one_point();
            //draw_points();

            document.getElementById("info").innerHTML = "Współrzędna X: " + String(xCoor) + "<br> Współrzędna Y: " + String(yCoor);
        }
    });

    canvas.addEventListener("contextmenu", function(evt) {

        if (event.button == 2) {
            rmb++;
            setTimeout(cc, 600);
        }
        if (rmb > 1) {
            if (lock_flag === true) {
                var X = evt.offsetX || (evt.pageX - canvas.offsetLeft);
                var Y = evt.offsetY || (evt.pageY - canvas.offsetTop);
                var pt = ctx.transformedPoint(X, Y);

                var xCoor = Math.round((pt.x / canvas_width) * realWidth);
                var yCoor = Math.round((pt.y / canvas_height) * realHeight);

                coordinates_object = {
                    "x_on_screen": Math.round(pt.x),
                    "y_on_screen": Math.round(pt.y),
                    "x_in_real": xCoor,
                    "y_in_real": yCoor,
                    "color": String(1)
                };

                coordinates_array.push(coordinates_object);

                draw_one_point();
                //draw_points();

                document.getElementById("info").innerHTML = "Współrzędna X: " + String(xCoor) + "<br> Współrzędna Y: " + String(yCoor);
            }
        }
    });
    var rmb = 0;

    function cc() {
        rmb = 0;
    }

    canvas.addEventListener("click", function(evt) {
        if (evt.shiftKey) {
            if (lock_flag === true) {
                redraw();
                document.getElementById("info").innerHTML = "Współrzędna X: <br> Współrzędna Y: ";
                var X = evt.offsetX || (evt.pageX - canvas.offsetLeft);
                var Y = evt.offsetY || (evt.pageY - canvas.offsetTop);
                var pt = ctx.transformedPoint(X, Y);
                var distance;

                for (i in coordinates_array) {
                    distance = Math.sqrt(Math.pow(pt.x - coordinates_array[i].x_on_screen, config_JSON_object.power) + Math.pow(pt.y - coordinates_array[i].y_on_screen, config_JSON_object.power));
                    if (distance < config_JSON_object.distance) {
                        coordinates_array.splice(i, 1);
                        draw_points();
                    }
                }
            }
        }
    });

}

function draw_one_point() {
    var index = coordinates_array.length - 1;

    if (coordinates_array[index].color === "0")
        $("#data-list-group1").append("X: " + String(coordinates_array[index].x_in_real) + " Y: " + String(coordinates_array[index].y_in_real) + "<br>");
    else
        $("#data-list-group2").append("X: " + String(coordinates_array[index].x_in_real) + " Y: " + String(coordinates_array[index].y_in_real) + "<br>");

    ctx.beginPath();
    ctx.fillStyle = coordinates_array[index].color === "0" ? "green" : "red";
    ctx.fillRect(coordinates_array[index].x_on_screen - config_JSON_object.marker_width_and_height / 2, coordinates_array[index].y_on_screen - config_JSON_object.marker_width_and_height / 2, config_JSON_object.marker_width_and_height, config_JSON_object.marker_width_and_height);
    console.log("One point has been drawn!");
}

function draw_points() {
    document.getElementById("data-list-group1").innerHTML = "";
    document.getElementById("data-list-group2").innerHTML = "";
    for (i in coordinates_array) {
        {
            if (coordinates_array[i].color === "0")
                $("#data-list-group1").append("X: " + String(coordinates_array[i].x_in_real) + " Y: " + String(coordinates_array[i].y_in_real) + "<br>");
            else
                $("#data-list-group2").append("X: " + String(coordinates_array[i].x_in_real) + " Y: " + String(coordinates_array[i].y_in_real) + "<br>");

            ctx.beginPath();
            ctx.fillStyle = coordinates_array[i].color === "0" ? "green" : "red";
            ctx.fillRect(coordinates_array[i].x_on_screen - config_JSON_object.marker_width_and_height / 2, coordinates_array[i].y_on_screen - config_JSON_object.marker_width_and_height / 2, config_JSON_object.marker_width_and_height, config_JSON_object.marker_width_and_height);
        }
    }
    console.log("All points redrawn!!!");
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
