<?php
    require_once "helperFunctions.php";

    function handleEditContact($inData) {
        if (!isset($inData["FirstName"], $inData["LastName"], $inData["Phone"], $inData["Email"], $inData["UserID"], $inData["ID"])) {
            returnWithError("Missing required fields");
            return;
        }
        $id = 0;

        $conn = new mysqli("localhost", "API", "admin1234", "ContactManager"); 	
        if( $conn->connect_error )
        {
            returnWithError( $conn->connect_error );
        }
        else
        {
            $stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, Phone = ?, Email = ? WHERE UserID = ? AND ID = ?;");
            $stmt->bind_param("ssssii", $inData["FirstName"], $inData["LastName"], $inData["Phone"], $inData["Email"], $inData["UserID"], $inData["ID"]);

            $stmt->execute();
            $result = $stmt->get_result();

            sendResultInfoAsJson( '"success": "true"' );

            $stmt->close();
            $conn->close();
            return;
        }
    }	
    
?>