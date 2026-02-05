<?php
    require_once "helperFunctions.php";

    $inData = $_GET;

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
        $stmt = null;
        if ($inData["query"] === "" or $inData["query"] === null or !$inData["query"]) {
            $stmt = $conn->prepare("SELECT ID, UserID, FirstName, LastName, Phone, Email FROM Contacts WHERE UserID = ? ORDER BY LastName, FirstName");
            $stmt->bind_param("i", $inData["UserID"]);
        } else {
            $stmt = $conn->prepare("SELECT * FROM Contacts WHERE UserID = ? AND ( FirstName LIKE ? OR LastName LIKE ? OR Email LIKE ? OR Phone LIKE ? );");
            $search = "%" . $inData["query"] . "%";
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