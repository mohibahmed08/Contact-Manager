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

            if (!$stmt->execute()) {
                returnWithError("Update failed: " . $stmt->error);
                $stmt->close();
                $conn->close();
                return;
            }

            // Failure/no changes
            if ($stmt->affected_rows === 0) {
                returnWithError("No rows affected.");
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