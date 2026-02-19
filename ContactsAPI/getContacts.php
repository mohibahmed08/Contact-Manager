<?php
    require_once "helperFunctions.php";

    $inData = $_GET;

    $id = 0;
    $firstName = "";
    $lastName = "";
    $query = isset($inData["query"]) ? trim($inData["query"]) : "";

    // Make sure user ID is given
    if (!isset($inData["UserID"]) || trim((string)$inData["UserID"]) === "") {
        returnContactWithError("Missing UserID");
        exit();
    }


    $conn = new mysqli("localhost", "API", "admin1234", "ContactManager"); 	
    if( $conn->connect_error )
    {
        returnContactWithError( $conn->connect_error );
        exit();
    }
    else
    {
        $stmt = null;
        if ($query === "") {
            $stmt = $conn->prepare("SELECT * FROM Contacts WHERE UserID = ? ORDER BY LastName, FirstName");

            // Safety check that we actually built a valid SQL statement
            if (!$stmt) {
                returnContactWithError("Prepare failed: " . $conn->error);
                exit();
            }

            $userID = (int)$inData["UserID"]; // Typecast to int to make sure it's the right data type
            $stmt->bind_param("i", $userID);
        } else {
            // Split query into multiple, delimeted by space. From Google.
            $queries = preg_split('/\s+/', $query, -1, PREG_SPLIT_NO_EMPTY);

            $stmtString = "SELECT * FROM Contacts WHERE UserID = ? ";
            foreach ($queries as $q) {
                $stmtString .= "AND ( FirstName LIKE ? OR LastName LIKE ? OR Email LIKE ? OR Phone LIKE ? ) ";
            }

            $stmtString .= "ORDER BY LastName, FirstName;";
            $stmt = $conn->prepare($stmtString);

            // Safety check that we actually built a valid SQL statement
            if (!$stmt) {
                returnContactWithError("Prepare failed: " . $conn->error);
                exit();
            }

            // Set up our bind type and array, to append to later
            $bindType = "i";
            $userID = (int)$inData["UserID"]; // Typecast to int to make sure it's the right data type
            $bindArray = [$userID];

            foreach ($queries as $term) {
                $bindType .= "ssss"; // Bind four string parameters
                $search = "%" . $term . "%";
                array_push($bindArray, $search, $search, $search, $search); // Add our four new parameters/new query to the array
            }

            // Below written with assistance from Google
            $bindArguments = [];
            $bindArguments[] = $bindType; // Add the bind types to our arguments ("issss")
            // For each search term to bind, we need to bind the reference.
            foreach ($bindArray as $k => $v) {
                $bindArguments[] = &$bindArray[$k];
            }
            
            // Call the $stmt bind_param function with our arguments
            call_user_func_array([$stmt, 'bind_param'], $bindArguments);
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
