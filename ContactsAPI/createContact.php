<?php
    require_once "helperFunctions.php";

    $inData = json_decode(file_get_contents("php://input"), true);


    if (!isset($inData["FirstName"], $inData["LastName"], $inData["Phone"], $inData["Email"], $inData["UserID"])) {
        sendResultInfoAsJson(json_encode([
            "success" => false,
            "id" => 0,
            "error" => "Missing required fields"
        ]));
        exit();
    }

    $id = 0;

    $conn = new mysqli("localhost", "API", "admin1234", "ContactManager"); 	
    if ($conn->connect_error) {
        sendResultInfoAsJson(json_encode([
            "success" => false,
            "id" => 0,
            "error" => $conn->connect_error
        ]));
        exit();
    }

    else
    {
        $stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, Phone, Email, UserID) VALUES (?, ?, ?, ?, ?);");
        $stmt->bind_param("ssssi", $inData["FirstName"], $inData["LastName"], $inData["Phone"], $inData["Email"], $inData["UserID"]);

        if (!$stmt->execute()) {
            sendResultInfoAsJson(json_encode([
                "success" => false,
                "id" => 0,
                "error" => "Insert failed: " . $stmt->error
            ]));
            $stmt->close();
            $conn->close();
            exit();
        }

        $newId = $conn->insert_id;

        sendResultInfoAsJson(json_encode([
            "success" => true,
            "id" => $newId,
            "error" => ""
        ]));

        $stmt->close();
        $conn->close();

        exit();
    }

    
?>