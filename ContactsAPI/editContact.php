<?php
    require_once "helperFunctions.php";

    $inData = json_decode(file_get_contents("php://input"), true);

    
    if (!isset($inData["FirstName"], $inData["LastName"], $inData["Phone"], $inData["Email"], $inData["UserID"], $inData["ID"])) {
        sendResultInfoAsJson(json_encode([
            "success" => false,
            "affectedRows" => 0,
            "error" => "Missing required fields"
        ]));

        exit();
    }
    $id = 0;

    $conn = new mysqli("localhost", "API", "admin1234", "ContactManager"); 	
    if( $conn->connect_error )
    {
        sendResultInfoAsJson(json_encode([
            "success" => false,
            "affectedRows" => 0,
            "error" => $conn->connect_error
        ]));

        exit();
    }
    else
    {
        $stmt = $conn->prepare("UPDATE Contacts SET FirstName = ?, LastName = ?, Phone = ?, Email = ? WHERE UserID = ? AND ID = ?;");
        $stmt->bind_param("ssssii", $inData["FirstName"], $inData["LastName"], $inData["Phone"], $inData["Email"], $inData["UserID"], $inData["ID"]);

        if (!$stmt->execute()) {
            sendResultInfoAsJson(json_encode([
                "success" => false,
                "affectedRows" => 0,
                "error" => "Update failed: " . $stmt->error
            ]));

            $stmt->close();
            $conn->close();
            exit();
        }

        // Failure/no changes
        if ($stmt->affected_rows === 0) {
            sendResultInfoAsJson(json_encode([
                "success" => false,
                "affectedRows" => $stmt->affected_rows,
                "error" => "No rows affected."
            ]));

            $stmt->close();
            $conn->close();
            exit();
        }

        sendResultInfoAsJson(json_encode([
            "success" => true,
            "affectedRows" => $stmt->affected_rows,
            "error" => ""
        ]));

        $stmt->close();
        $conn->close();

        exit();
    }

    
?>