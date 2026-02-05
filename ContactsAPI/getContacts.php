<?php
    require_once "helperFunctions.php";

    $inData = $_GET;

    $id = 0;
    $firstName = "";
    $lastName = "";
    $query = isset($inData["query"]) ? trim($inData["query"]) : "";

    // Make sure user ID is given
    if (!isset($inData["UserID"])) {
        returnContactWithError("Missing UserID");
        exit();
    }


    $conn = new mysqli("localhost", "API", "admin1234", "ContactManager"); 	
    if( $conn->connect_error )
    {
        returnWithError( $conn->connect_error );
    }
    else
    {
        $stmt = null;
        if ($query === "") {
            $stmt = $conn->prepare("SELECT ID, UserID, FirstName, LastName, Phone, Email FROM Contacts WHERE UserID = ? ORDER BY LastName, FirstName");
            $stmt->bind_param("i", $inData["UserID"]);
        } else {
            $stmt = $conn->prepare("SELECT * FROM Contacts WHERE UserID = ? AND ( FirstName LIKE ? OR LastName LIKE ? OR Email LIKE ? OR Phone LIKE ? );");
            $search = "%" . $query . "%";
            $stmt->bind_param("issss", $inData["UserID"], $search, $search, $search, $search);
        }
        

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
?>