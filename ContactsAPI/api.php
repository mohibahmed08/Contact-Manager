<?php
/*
This file acts as our API endpoint
Other PHP files are called from this one, but we will only need one endpoint (this file). This keeps our folder cleaner and easy to use (hopefully!).
*/

$inData = json_decode(file_get_contents("php://input"), true);

// Must choose an ACTION when using this API
if (!isset($inData["action"])) {
    sendError("Missing action");
    exit();
}

// Can add as needed
switch ($inData["action"]) {
    case "register":
        require_once "signup.php";
        handleSignup($inData);
        break;

    case "login":
        require_once "login.php";
        handleLogin($inData);
        break;

    case "searchContacts":
        require_once "searchContacts.php";
        handleSearchContacts($inData);
        break;

    default:
        sendError("Unknown action");
}

function sendError($msg) {
    echo json_encode(["error" => $msg]);
}
