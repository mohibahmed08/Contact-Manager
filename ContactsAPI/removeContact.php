<?php
    require_once "helperFunctions.php";

    $inData = json_decode(file_get_contents("php://input"), true);

    if (!isset($inData["UserID"], $inData["ID"])) {
        http_response_code(400);
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
        http_response_code(500);
        sendResultInfoAsJson(json_encode([
            "success" => false,
            "affectedRows" => 0,
            "error" => "Deletion failed: " . $conn->connect_error
        ]));

        exit();
    }
    else
    {
        $stmt = $conn->prepare("DELETE FROM Contacts WHERE UserID = ? AND ID = ?;");
        $stmt->bind_param("ii", $inData["UserID"], $inData["ID"]);

        if (!$stmt->execute()) {
            http_response_code(500);
            sendResultInfoAsJson(json_encode([
                "success" => false,
                "affectedRows" => 0,
                "error" => "Deletion failed: " . $stmt->error
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

    exit();
?>