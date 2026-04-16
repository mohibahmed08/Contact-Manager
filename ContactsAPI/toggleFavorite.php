<?php
    require_once "helperFunctions.php";

    $inData = json_decode(file_get_contents("php://input"), true);

    if (!isset($inData["UserID"], $inData["ID"], $inData["IsFavorite"])) {
        http_response_code(400);
        sendResultInfoAsJson(json_encode([
            "success" => false,
            "affectedRows" => 0,
            "error" => "Missing required fields"
        ]));
        exit();
    }

    $isFavorite = normalizeFavoriteValue($inData["IsFavorite"]);

    $connectionError = "";
    $conn = openDatabaseConnection($connectionError);

    if ($conn === null) {
        http_response_code(500);
        sendResultInfoAsJson(json_encode([
            "success" => false,
            "affectedRows" => 0,
            "error" => "Update failed: " . $connectionError
        ]));
        exit();
    }

    $stmt = $conn->prepare("UPDATE Contacts SET IsFavorite = ? WHERE UserID = ? AND ID = ?;");

    if (!$stmt) {
        http_response_code(500);
        sendResultInfoAsJson(json_encode([
            "success" => false,
            "affectedRows" => 0,
            "error" => "Prepare failed: " . $conn->error
        ]));

        $conn->close();
        exit();
    }

    $stmt->bind_param("iii", $isFavorite, $inData["UserID"], $inData["ID"]);

    if (!$stmt->execute()) {
        http_response_code(500);
        sendResultInfoAsJson(json_encode([
            "success" => false,
            "affectedRows" => 0,
            "error" => "Update failed: " . $stmt->error
        ]));

        $stmt->close();
        $conn->close();
        exit();
    }

    sendResultInfoAsJson(json_encode([
        "success" => true,
        "affectedRows" => $stmt->affected_rows,
        "IsFavorite" => $isFavorite,
        "error" => ""
    ]));

    $stmt->close();
    $conn->close();
    exit();
?>
