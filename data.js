var coordinates = "";
var coordinatesxls = "";


function save_to_csv() {
    if (tabX.length === 0)
        coordinates = "none";
    for (i in tabX) {
        coordinates += String(tabColor[i]) + ";" + String(Math.round((tabX[i] / canvas_resized_width) * realWidth)) + ";" + String(Math.round((tabY[i] / canvas_resized_height) * realHeight)) + ";" + "\n";
    }
    var data = new FormData();
    data.append("data", coordinates);
    var xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new activeXObject("Microsoft.XMLHTTP");
    xhr.open('post', 'skrypt.php', false);
    xhr.send(data);
    coordinates = "";
}

function save_to_xls() {
    coordinatesxls += "<table>";
    if (tabX.length === 0)
        coordinatesxls = "none";
    for (i in tabX) {
        coordinatesxls += "<tr><td>" + String(tabColor[i]) + "</td><td>" + String(Math.round((tabX[i] / canvas_resized_width) * realWidth)) + "</td><td>" + String(Math.round((tabY[i] / canvas_resized_height) * realHeight)) + "</td></tr>"
    }
    var data = new FormData();
    data.append("data", coordinatesxls);
    var xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new activeXObject("Microsoft.XMLHTTP");
    xhr.open('post', 'export_excel.php', false);
    xhr.send(data);
    coordinatesxls += "</table>";
    coordinatesxls = "";
}

function loadCSV() {
    var xhttp = new XMLHttpRequest();
    var data = "";
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            data = xhttp.responseText;
        }
    };
    xhttp.open("GET", "upload/sd.csv", false);
    xhttp.send();


    tabX = [];
    tabY = [];
    tabColor = [];
    count = 0;

    var arr = data.split("\n");
    var splitted_coordinates = [];
    arr.splice(-1, 1);
    for (i in arr) {
        count++;
        splitted_coordinates = [];
        splitted_coordinates = arr[i].split(";");
        //console.log(splitted_coordinates[0] + " " + splitted_coordinates[1] + " " + splitted_coordinates[2] + " " + String(canvas.height));
        tabColor[i] = splitted_coordinates[0];
        tabX[i] = Math.round((parseInt(splitted_coordinates[1]) / realWidth) * canvas.width);
        tabY[i] = Math.round((parseInt(splitted_coordinates[2]) / realHeight) * canvas.height);
    }
    //alert(splitted_coordinates[0] + " fds")
    redraw();
    // document.getElementById("data-list-group1").innerHTML = "";
    // document.getElementById("data-list-group2").innerHTML = "";
    // for (i in tabX) {
    //     if (tabColor[i] === "green")
    //         $("#data-list-group1").append("X: " + String((tabX[i] / canvas.width) * realWidth) + " Y: " + String((tabY[i] / canvas.height) * realHeight) + "<br>");
    //     else
    //         $("#data-list-group2").append("X: " + String((tabX[i] / canvas.width) * realWidth) + " Y: " + String((tabY[i] / canvas.height) * realHeight) + "<br>");
    // }
    draw_points();
}

function loadXLS() {
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
}

$("#btnExport").click(function(e) {
    window.open('data:application/vnd.ms-excel,' + $('#dvData').html());
    e.preventDefault();
});

// function read_data(df){
//     alert(tabX);
// }
