<?php
    require_once "helperFunctions.php";

    function handleFetchContacts($inData) {
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
            $stmt = $conn->prepare("SELECT ID, UserID, FirstName, LastName, Phone, Email FROM Contacts WHERE UserID = ? ORDER BY LastName, FirstName");
            $stmt->bind_param("i", $inData["ID"]);

            $stmt->execute();
            $result = $stmt->get_result();

            $rows = [];
            while ($row = $result->fetch_assoc()) {
                $rows[] = $row;
            }

            returnContactWithInfo( $rows );

            $stmt->close();
            $conn->close();
            return;
        }
    }	
    
?>