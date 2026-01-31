
<?php
    require_once "helperFunctions.php";
    
    function handleLogin($inData) {
        
        $id = 0;
        $firstName = "";
        $lastName = "";

        $conn = new mysqli("localhost", "PLACEHOLDER_USERNAME", "PLACEHOLDER_PASSWORD", "ContactManager"); 	
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
    }	
?>
