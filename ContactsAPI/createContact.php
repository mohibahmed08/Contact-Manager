<?php
    require_once "helperFunctions.php";

    $inData = json_decode(file_get_contents("php://input"), true);    //Receive the JSON payload

    //Check if the required text fields exist
    if (!isset($inData["FirstName"], $inData["LastName"], $inData["Phone"], $inData["Email"], $inData["UserID"])) {
        sendResultInfoAsJson(json_encode([
            "success" => false,
            "id" => 0,
            "error" => "Missing required fields"
        ]));
        exit();
    }

    //Handle the image (if the user uploaded one)
    $binaryImage = null;
    $imageType = null;

    if(isset($inData["image"]) && $inData["image"] != "")
        {
            //Split the "data:image/jpeg;base64," prefix from the actual text that is carrying our Base64 string image
            $imageParts = explode(";base64,", $inData["image"]);

            //Extract just the "image/jpeg" part
            $imageType = explode(":", $imageParts[0])[1];

            //Decode the text back into raw binary for the longblob column of our database
            $binaryImage = base64_decode($imageParts[1]);
        }

    $isFavorite = normalizeFavoriteValue($inData["IsFavorite"] ?? 0);

    $connectionError = "";
    $conn = openDatabaseConnection($connectionError);

    if($conn === null)
        {
            http_response_code(500);
            sendResultInfoAsJson(json_encode(["success" => false, "id" => 0, "error" => $connectionError]));
            exit();
        }

    //Update the SQL query to include the new image columns
    $stmt = $conn->prepare("INSERT INTO Contacts (FirstName, LastName, Phone, Email, IsFavorite, UserID, image, imageData) VALUES (?, ?, ?, ?, ?, ?, ?, ?);");

    if (!$stmt) {
        http_response_code(500);
        sendResultInfoAsJson(json_encode([
            "success" => false,
            "id" => 0,
            "error" => "Prepare failed: " . $conn->error
        ]));
        $conn->close();
        exit();
    }

    //"ssssiiss" means 4 strings, 2 integers, 2 strings (binary counts as string here in mysqli bind_param)
    $stmt->bind_param("ssssiiss",
        $inData["FirstName"],
        $inData["LastName"],
        $inData["Phone"],
        $inData["Email"],
        $isFavorite,
        $inData["UserID"],
        $binaryImage,
        $imageType
    );

    if(!$stmt->execute()) sendResultInfoAsJson(json_encode(["success" => false, "id" => 0, "error" => "Insert failed: " . $stmt->error]));
    else
        {
            $newId = $conn->insert_id;
            sendResultInfoAsJson(json_encode(["success" => true, "id" => $newId, "error" => ""]));
        }

    $stmt->close();
    $conn->close();


?>
