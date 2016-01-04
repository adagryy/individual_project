<?php
if(!empty($_POST['data'])){
	$data = $_POST['data'];
	$file = "upload/sd.csv";//generates random name
	
	$current = file_get_contents($file);

	$current .= $data . "\n";
    file_put_contents($file, $data);
}
?>
