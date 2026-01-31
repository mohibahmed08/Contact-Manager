
<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = "";
	$lastName = "";

	$conn = new mysqli("localhost", "PLACEHOLDER_USERNAME", "PLACEHOLDER_PASSWORD", "ContactManager"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
        // Insert new account into database
        $stmtInsert = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)");
        $hashedPassword = password_hash($inData["password"], PASSWORD_DEFAULT); // Hashes password for better security incase database is hacked
		$stmtInsert->bind_param("ssss", $inData["FirstName"], $inData["LastName"], $inData["login"], $hashedPassword);

        if (!$stmtInsert->execute()) {
            if ($conn->errno == 1062) 
                returnWithError("Account already exists");
            else 
                returnWithError("Failed to create account: " . $conn->error);
            
            $stmtInsert->close();
            $conn->close();
            exit();
        }

        returnWithInfo( $inData['FirstName'], $inData['LastName'], $conn->insert_id );

		$stmtInsert->close();
		$conn->close();

        exit();
	}
	
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
	
?>
