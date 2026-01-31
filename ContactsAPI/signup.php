
<?php
    require_once "helperFunctions.php";
    
    function handleSignup($inData) {
        
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
            // Insert new account into database
            $stmtInsert = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)");
            $hashedPassword = password_hash($inData["Password"], PASSWORD_DEFAULT); // Hashes password for better security incase database is hacked
            $stmtInsert->bind_param("ssss", $inData["FirstName"], $inData["LastName"], $inData["Login"], $hashedPassword);

            if (!$stmtInsert->execute()) {
                if ($conn->errno == 1062) 
                    returnWithError("Account already exists");
                else 
                    returnWithError("Failed to create account: " . $conn->error);
                
                $stmtInsert->close();
                $conn->close();
                return;
            }

            returnWithInfo( $inData['FirstName'], $inData['LastName'], $conn->insert_id );

            $stmtInsert->close();
            $conn->close();

            return;
        }
    }

?>
