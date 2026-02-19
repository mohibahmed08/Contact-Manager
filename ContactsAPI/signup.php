
<?php    
    require_once "helperFunctions.php";
    
    $inData = json_decode(file_get_contents("php://input"), true);
        
    $id = 0;
    $firstName = "";
    $lastName = "";

    if (!is_array($inData) || !isset($inData["FirstName"], $inData["LastName"], $inData["Login"], $inData["Password"])) {
        http_response_code(400);
        returnWithError("Missing required fields");
        exit();
    }

    $inData["Login"] = trim($inData["Login"]);
    if ($inData["Login"] === "" || $inData["Password"] === "") {
        http_response_code(400);
        returnWithError("Missing required fields. Login and Password cannot be blank.");
        exit();
    }

    $conn = new mysqli("localhost", "API", "admin1234", "ContactManager"); 	
    if( $conn->connect_error )
    {
        http_response_code(500);
        returnWithError( $conn->connect_error );
        exit();
    }
    else
    {
        // Insert new account into database
        $stmtInsert = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)");
        $hashedPassword = password_hash($inData["Password"], PASSWORD_DEFAULT); // Hashes password for better security incase database is hacked
        $stmtInsert->bind_param("ssss", $inData["FirstName"], $inData["LastName"], $inData["Login"], $hashedPassword);

        if (!$stmtInsert->execute()) {
            if ($conn->errno == 1062) {
                http_response_code(409);
                returnWithError("Account already exists");
            }
            else {
                http_response_code(500);
                returnWithError("Failed to create account: " . $conn->error);
            }
            
            $stmtInsert->close();
            $conn->close();
            exit();
        }

        http_response_code(201);
        returnWithInfo( $inData['FirstName'], $inData['LastName'], $conn->insert_id );

        $stmtInsert->close();
        $conn->close();

        exit();
    }

?>
