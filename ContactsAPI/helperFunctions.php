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

            $retValue .= '{"id":' . $row["ID"] . ',"FirstName":"' . $row["FirstName"] . '","LastName":"' . $row["LastName"] . '","Phone":"' . $row["Phone"] . '","Email":"' . $row["Email"] . '"}';
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