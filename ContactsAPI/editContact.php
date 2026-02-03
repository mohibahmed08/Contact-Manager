<?php
    require_once "helperFunctions.php";

    function handleEditContact($inData) {
        $id = 0;

        $conn = new mysqli("localhost", "API", "admin1234", "ContactManager"); 	
        if( $conn->connect_error )
        {
            returnWithError( $conn->connect_error );
        }
        else
        {
            if ($inData["OldPhone"]) {
                $oldPhone = $inData["OldPhone"];
            } else {
                oldPhone = $inData["Phone"];
            }

            $stmt = $conn->prepare("UPDATE Contacts INSERT ON NULL FirstName, LastName, Phone, Email VALUES ?, ?, ?, ? WHERE UserID = ? AND Phone = ?");
            $stmt->bind_param("ssssis", $inData["FirstName"], $inData["LastName"], $inData["Phone"], $inData["Email"], $inData["ID"], $oldPhone);

            $stmt->execute();
            $result = $stmt->get_result();

            sendResultInfoAsJson( '"success": "true"' );

            $stmt->close();
            $conn->close();
            return;
        }
    }	
    
?>