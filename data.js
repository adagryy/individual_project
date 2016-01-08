var coordinates = "";
var coordinatesxls = "";


function save_to_csv() {
    if (lock_flag === true) {
        if (coordinates_array.length === 0)
            coordinates = "none";
        for (i in coordinates_array) {
            coordinates += String(coordinates_array[i].color === "0" ? "green" : "red") + ";" + String(coordinates_array[i].x_in_real) + ";" + String(coordinates_array[i].y_in_real) + ";" + "\n";
        }
        var data = new FormData();
        data.append("data", coordinates);
        var xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new activeXObject("Microsoft.XMLHTTP");
        xhr.open('post', 'skrypt.php', false);
        xhr.send(data);
        coordinates = "";
    } else {
        alert("You have to start marking before importing points");
    }
}

function save_to_xls() {
    if (lock_flag === true) {
        coordinatesxls += "<table>";
        if (coordinates_array.length === 0)
            coordinatesxls = "none";
        for (i in coordinates_array) {
            coordinatesxls += "<tr><td>" + String(coordinates_array[i].color === "0" ? "green" : "red") + "</td><td>" + String(coordinates_array[i].x_in_real) + "</td><td>" + String(coordinates_array[i].y_in_real) + "</td></tr>"
        }
        var data = new FormData();
        data.append("data", coordinatesxls);
        var xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new activeXObject("Microsoft.XMLHTTP");
        xhr.open('post', 'export_excel.php', false);
        xhr.send(data);
        coordinatesxls += "</table>";
        coordinatesxls = "";
    } else {
        alert("You didn't start marking!");
    }
}

function loadCSV() {
    if (lock_flag === true) {
        var xhttp = new XMLHttpRequest();
        var data = "";
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                data = xhttp.responseText;
            }
        };
        xhttp.open("GET", "upload/sd.csv", false);
        xhttp.send();


        // tabX = [];
        // tabY = [];
        // tabColor = [];
        // count = 0;

        coordinates_array = [];
        var temp_coordinates_array_object;

        var arr = data.split("\n");
        var splitted_coordinates = [];
        arr.splice(-1, 1); //last row is empty, but still exists - and we are removing it 
        for (i in arr) {
            //count++;
            splitted_coordinates = [];
            splitted_coordinates = arr[i].split(";");
            //console.log(splitted_coordinates[0] + " " + splitted_coordinates[1] + " " + splitted_coordinates[2] + " " + String(canvas.height));
            temp_coordinates_array_object = {
                "x_on_screen": Math.round((parseInt(splitted_coordinates[1]) / realWidth) * canvas.width),
                "y_on_screen": Math.round((parseInt(splitted_coordinates[2]) / realHeight) * canvas.height),
                "x_in_real": parseInt(splitted_coordinates[1]),
                "y_in_real": parseInt(splitted_coordinates[2]),
                "color": splitted_coordinates[0] === "green" ? "1" : "0"
            };

            coordinates_array.push(temp_coordinates_array_object);
            // tabColor[i] = splitted_coordinates[0];
            // tabX[i] = Math.round((parseInt(splitted_coordinates[1]) / realWidth) * canvas.width);
            // tabY[i] = Math.round((parseInt(splitted_coordinates[2]) / realHeight) * canvas.height);
        }
        //alert(data)
        //redraw();
        // document.getElementById("data-list-group1").innerHTML = "";
        // document.getElementById("data-list-group2").innerHTML = "";
        // for (i in tabX) {
        //     if (tabColor[i] === "green")
        //         $("#data-list-group1").append("X: " + String((tabX[i] / canvas.width) * realWidth) + " Y: " + String((tabY[i] / canvas.height) * realHeight) + "<br>");
        //     else
        //         $("#data-list-group2").append("X: " + String((tabX[i] / canvas.width) * realWidth) + " Y: " + String((tabY[i] / canvas.height) * realHeight) + "<br>");
        // }
        draw_points();
        arr = [];
    } else {
        alert("You have to start marking before importing points");
    }
}

function loadXLS() {
    if (lock_flag === true) {
        var data = "";
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                data = xhttp.responseText;
            }
        };
        xhttp.open("GET", "upload/sd.xls", false);
        xhttp.send();
        alert(data)
    } else {
        alert("You have to start marking before importing points");
    }
}

$("#btnExport").click(function(e) {
    window.open('data:application/vnd.ms-excel,' + $('#dvData').html());
    e.preventDefault();
});

// function read_data(df){
//     alert(tabX);
// }
