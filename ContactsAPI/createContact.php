<?php
    require_once "helperFunctions.php";

    $inData = json_decode(file_get_contents("php://input"), true);


    if (!isset($inData["FirstName"], $inData["LastName"], $inData["Phone"], $inData["Email"], $inData["UserID"])) {
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
        $stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES (?, ?, ?, ?, ?);");
        $stmt->bind_param("ssssi", $inData["FirstName"], $inData["LastName"], $inData["Phone"], $inData["Email"], $inData["UserID"]);

        if (!$stmt->execute()) {
            returnWithError("Insert failed: " . $stmt->error);
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

        $newId = $conn->insert_id;

        sendResultInfoAsJson(json_encode([
            "success" => true,
            "id" => $newId,
            "error" => ""
        ]));

        $stmt->close();
        $conn->close();

        return;
    }

    
?>