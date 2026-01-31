
<?php
    require_once "helperFunctions.php";
    
    function handleSearchContacts($inData) {
        
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
            $stmt = $conn->prepare("SELECT * FROM Contacts WHERE UserID = ? AND ( FirstName LIKE ? OR LastName LIKE ? OR Email LIKE ? OR Phone LIKE ? );");
            $search = "%" . $inData["query"] . "%";
            $stmt->bind_param("issss", $inData["ID"], $search, $search, $search, $search);

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
