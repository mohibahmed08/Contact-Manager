<?php
    mysqli_report(MYSQLI_REPORT_OFF);

    function getRequestInfo()
        {
                return json_decode(file_get_contents('php://input'), true);
        }

        function sendResultInfoAsJson( $obj )
        {
                header('Content-type: application/json');
                echo $obj;
        }

        function returnWithError( $err )
        {
                $retValue = '{"id":0,"FirstName":"","LastName":"","error":"' . $err . '"}';
                sendResultInfoAsJson( $retValue );
        }

    function returnWithInfo( $firstName, $lastName, $id )
    {
            $retValue = '{"id":' . $id . ',"FirstName":"' . $firstName . '","LastName":"' . $lastName . '","error":""}';
            sendResultInfoAsJson( $retValue );
    }

    function normalizeFavoriteValue($value)
    {
        if (is_bool($value)) {
            return $value ? 1 : 0;
        }

        return ((int)$value === 1) ? 1 : 0;
    }

    function getDatabaseConfig()
    {
        return [
            "host" => getenv("CONTACT_MANAGER_DB_HOST") ?: "127.0.0.1",
            "user" => getenv("CONTACT_MANAGER_DB_USER") ?: "API",
            "password" => getenv("CONTACT_MANAGER_DB_PASSWORD") ?: "admin1234",
            "name" => getenv("CONTACT_MANAGER_DB_NAME") ?: "ContactManager"
        ];
    }

    function openDatabaseConnection(&$error = "")
    {
        $config = getDatabaseConfig();
        $conn = @new mysqli($config["host"], $config["user"], $config["password"], $config["name"]);

        if ($conn->connect_error) {
            $error = $conn->connect_error;
            return null;
        }

        return $conn;
    }

    function returnContactWithInfo ( $rows )
    {
        // Convert to Json
        $retValue = '{ "results": [';
        $rowNum = 0;
        foreach ($rows as $row) {
            if ($rowNum > 0) {
                $retValue .= ",";
            }

            $rowNum++;

            //If there is an image, convert the binary back to Base64
            $imageBase64 = "";

            if(!empty($row["image"]) && !empty($row["imageData"])) $imageBase64 = "data:" . $row["imageData"] . ";base64," . base64_encode($row["image"]);

            $retValue .= '{';
            $retValue .= '"id":' . $row["ID"] . ',';
            $retValue .= '"FirstName":"' . $row["FirstName"] . '",';
            $retValue .= '"LastName":"' . $row["LastName"] . '",';
            $retValue .= '"Phone":"' . $row["Phone"] . '",';
            $retValue .= '"Email":"' . $row["Email"] . '",';
            $retValue .= '"IsFavorite":' . normalizeFavoriteValue($row["IsFavorite"] ?? 0) . ',';
            $retValue .= '"image":"' . $imageBase64 . '"';    //Send the image string back for display!
            $retValue .= '}';
        }

        $retValue .= '], "error":"" }';

        // Return
        sendResultInfoAsJson( $retValue );
    }

    function returnContactWithError ( $err )
    {
        $retValue = '{"results": [], "error":"' . $err . '"}';
                sendResultInfoAsJson( $retValue );
    }
?>
