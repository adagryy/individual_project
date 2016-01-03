var coordinates = "";
var coordinatesxls = "";

function save_to_arr(type, xx, yy) {
    coordinates += String(type) + ";" + String(xx) + ";" + String(yy) + ";" + "\n";
}

function save_to_xls_arr(type, xx, yy) {
    coordinatesxls += "<table><tr><td>" + String(type) + "</td><td>" + String(xx) + "</td><td>" + String(yy) + "</td></tr></table>"
}

function save_to_csv() {
    var data = new FormData();
    data.append("data", coordinates);
    var xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new activeXObject("Microsoft.XMLHTTP");
    xhr.open('post', 'skrypt.php', true);
    xhr.send(data);
}

function save_to_xls() {
	var data = new FormData();
    data.append("data", coordinatesxls);
    var xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new activeXObject("Microsoft.XMLHTTP");
    xhr.open('post', 'export_excel.php', true);
    xhr.send(data);
}

$("#btnExport").click(function (e) {
    window.open('data:application/vnd.ms-excel,' + $('#dvData').html());
    e.preventDefault();
});