<?php
    function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"FirstName":"","LastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"FirstName":"' . $firstName . '","LastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}

    function returnContactWithInfo ( $rows ) 
    {
        // Convert to Json
        $retValue = '{ "results": [';
        $rowNum = 0;
        foreach ($rows as $row) {
            if ($rowNum > 0) {
                $retValue .= ",";
            }

            $rowNum++;

	    //If there is an image, convert the binary back to Base64
	    $imageBase64 = "";

	    if(!empty($row["image"]) && !empty($row["imageData"])) $imageBase64 = "data:" . $row["imageData"] . ";base64," . base64_encode($row["image"]);

            $retValue .= '{';
            $retValue .= '"id":' . $row["ID"] . ',';
            $retValue .= '"FirstName":"' . $row["FirstName"] . '",';
            $retValue .= '"LastName":"' . $row["LastName"] . '",';
            $retValue .= '"Phone":"' . $row["Phone"] . '",';
            $retValue .= '"Email":"' . $row["Email"] . '",';
            $retValue .= '"image":"' . $imageBase64 . '"';    //Send the image string back for display!
            $retValue .= '}';
        }

        $retValue .= '], "error":"" }'; 

        // Return
        sendResultInfoAsJson( $retValue );
    }

    function returnContactWithError ( $err ) 
    {
        $retValue = '{"results": [], "error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
    }
?>

