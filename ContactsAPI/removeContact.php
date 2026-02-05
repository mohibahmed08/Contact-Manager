<?php
    require_once "helperFunctions.php";

    function handleRemoveContact($inData) {
        if (!isset($inData["UserID"], $inData["ID"])) {
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
            $stmt = $conn->prepare("DELETE FROM Contacts WHERE UserID = ? AND ID = ?;");
            $stmt->bind_param("ii", $inData["UserID"], $inData["ID"]);

            if (!$stmt->execute()) {
                returnWithError("Deletion failed: " . $stmt->error);
                $stmt->close();
                $conn->close();
                return;
            }

            sendResultInfoAsJson(json_encode([
                "success" => true,
                "affectedRows" => $stmt->affected_rows,
                "error" => ""
            ]));

            $stmt->close();
            $conn->close();

            return;
        }
    }	
    
?>