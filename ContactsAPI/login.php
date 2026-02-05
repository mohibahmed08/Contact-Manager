
<?php
    require_once "helperFunctions.php";
    
    $inData = json_decode(file_get_contents("php://input"), true);
        
    $id = 0;
    $firstName = "";
    $lastName = "";

    $conn = new mysqli("localhost", "API", "admin1234", "ContactManager"); 	
    if( $conn->connect_error )
    {
        returnWithError( $conn->connect_error );
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
                returnWithInfo( $row['FirstName'], $row['LastName'], $row['ID'] );
            } else {
                returnWithError("Invalid Login");
            }
        }
        else
        {
            returnWithError("Invalid Login");
        }

        $stmt->close();
        $conn->close();
        return;
    }
?>
