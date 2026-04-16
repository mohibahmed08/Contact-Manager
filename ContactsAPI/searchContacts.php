
<?php
    require_once "helperFunctions.php";

    $inData = json_decode(file_get_contents("php://input"), true);
        
    $id = 0;
    $firstName = "";
    $lastName = "";

    $connectionError = "";
    $conn = openDatabaseConnection($connectionError);
    if( $conn === null )
    {
        http_response_code(500);
        returnWithError( $connectionError );
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
?>
