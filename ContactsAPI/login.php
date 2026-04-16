
<?php
    require_once "helperFunctions.php";
    
    $inData = json_decode(file_get_contents("php://input"), true);
        
    $id = 0;
    $firstName = "";
    $lastName = "";

    if (!is_array($inData) || !isset($inData["Login"], $inData["Password"])) {
        http_response_code(400);
        returnWithError("Missing Login or Password");
        exit();
    }

    $connectionError = "";
    $conn = openDatabaseConnection($connectionError);
    if( $conn === null )
    {
        http_response_code(500);
        returnWithError( $connectionError );
        exit();
    }
    else
    {
        $stmt = $conn->prepare("SELECT ID, FirstName, LastName, Password FROM Users WHERE Login=?");
        $stmt->bind_param("s", $inData["Login"]);
        $stmt->execute();
        $result = $stmt->get_result();

        if( $row = $result->fetch_assoc()  )
        {
            if (password_verify($inData["Password"], $row['Password'])) {
                http_response_code(200);
                returnWithInfo( $row['FirstName'], $row['LastName'], $row['ID'] );
            } else {
                http_response_code(401);
                returnWithError("Invalid Login");
            }
        }
        else
        {
            http_response_code(401);
            returnWithError("Invalid Login");
        }

        $stmt->close();
        $conn->close();
        exit;
    }
?>
