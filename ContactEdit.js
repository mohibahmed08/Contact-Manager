//LOADED DOM ON PAGE STARTUP
document.addEventListener("DOMContentLoaded", () => {
    
    //ACCESS LOCAL STORAGE THAT MAY OR MAY NOT HAVE BEEN INITALIZED ON PRIOR PAGE
    const savedContactInfo = localStorage.getItem("contactInfo"); // <-- CHANGE WITH PROPER NAME!!!!
    //I'M ASSUMING LOCAL STORAGE IS AN ARRAY OF THE FIELDS

    //IF SAVED FIELD INFO IS NULL (I.E. WE DIDN'T HAVE LOCAL STORAGE)
    //THEN WE ARE CREATING A NEW CONTACT SINCE THERE'S NOTHING TO EDIT
    //OTHERWISE WE ARE EDITING A CONTACT AND WE SET UP THE FIELDS ACCORDINGLY

    //WE HAVE STORED INFORMATION FROM OUR LOCAL STORAGE (AND ITS THE PROPER SIZE)
    if(savedContactInfo){ 
        //CHECK IF PROPER SIZE AND IN PROPER ORDER
        if(savedContactInfo.length == 4){
            //SET THE TITLE TO EDIT CONTACT
            document.getElementById('title-label').textContent = "Edit Contact";
            //INITALIZE THE FIELDS ACCORDINGLY (ASSUMING IN PROPER ORDER)
            document.getElementById('first-name-field').value = savedContactInfo[0];
            document.getElementById('last-name-field').value = savedContactInfo[1];
            document.getElementById('phone-number-field').value = savedContactInfo[2];
            document.getElementById('email-address-field').value = savedContactInfo[3];
        }
        //IF NOT PROPER SIZE, EXPLAIN WHAT SHOULD BE GIVEN
        else{
            //STATE THE ERROR AND WHAT SHOULD BE DONE TO FIX IT
            console.error("INVALID \"fieldInfo\" LOCAL STORAGE!!");
            console.error("PROPER FORMAT: ARRAY OF LENGTH 4 WITH THE FOLLOWING ORDER:\n");
            console.error("0) First Name\n1) Last Name\n2) Phone Number\n3) Email Address");
            //DEFAULT TO CREATE CONTACT PAGE FOR NOW BY TAGGING NULL
            savedContactInfo = null;
        }
    }
    //OTHERWISE, WE DON'T HAVE ANY PASSED IN INFORMATION, THEREFORE WE CREATE A NEW CONTACT
    if(!savedContactInfo){
        //SET THE TITLE TO CREATE CONTACT
        document.getElementById('title-label').textContent = "Create Contact";
        //INITALIZE THE FIELDS ACCORDINGLY
        document.getElementById('first-name-field').value = "";
        document.getElementById('last-name-field').value = "";
        document.getElementById('phone-number-field').value = "";
        document.getElementById('email-address-field').value = "";
    }

    //STATE SUCCESSFUL LOADING WITH PROPER TITLE
    console.log((savedContactInfo) ? "Edit" : "Create" + " Contact page loaded");

});

// //CHECKS IF A FIELD IS UNIQUE FROM WHATS IN THE DB
// function isTaken(fields){
//     //HOLDS IF THE FIELD HAS BEEN TAKEN OR NOT
//     let isTaken = false;
//     //ITERATE THROUGH BACKEND FIELDS AND SEARCH FOR FIELD VALUE
//     fields.array.forEach(element => {
//         //SEARCH IN BACKEND FOR ELEMENT
//         fetch('backend.php', { // <-- CHANGE THIS OUT WITH THE ACTUAL BACKEND CODE NAME !!!!!!!!!!!!!
//             //GET FROM THE BACKEND PHP
//             method: 'GET',
//             //STATE WE ARE RECIEVING JSON FILE TYPE
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });
//     });
//     //RETURN IF IS TAKEN, TO DISPLAY ON DOM
//     return isTaken;
// } 

//TASKS FOR WHEN WHEN THE ACTION BUTTON IS CLICKED
document.getElementById("action-button").addEventListener("click", function () {
    
    //TAKE FIELD INFORMATION FROM THE CREATE CONTACT FIELDS
    let firstName = document.getElementById("first-name-field").value;
    let lastName = document.getElementById("last-name-field").value;
    let phoneNumber = document.getElementById("phone-number-field").value;
    let emailAddress = document.getElementById("email-address-field").value;

    //CREATE AN ARRAY OF FIELDS TO BE SENT TO IS TAKEN
    let fields = {firstName, lastName, phoneNumber, emailAddress};

    //CHECK IF THE FIELD DATA HAS BEEN TAKEN ALREADY IN BACKEND
    if(isTaken(fields)) return; //PASS IN CURRENT FIELD INFO (NEED METHOD TO BE COMPLETED !!!!!!!!)

    //SEND TO BACKEND VIA API ENDPOINT
    fetch('backend.php', { // <-- CHANGE THIS OUT WITH THE ACTUAL BACKEND CODE NAME !!!!!!!!!!!!!
        //POST TO THE BACKEND PHP
        method: 'POST',
        //STATE WE ARE SENDING JSON FILE TYPE
        headers: {
            'Content-Type': 'application/json',
        },
        //STRINGIFY FIELD INFO TO JSON DELIVERABLE
        body: JSON.stringify({ 
            //ASSIGN THE FIRSTNAME FIELD WITH FIRSTNAME IN DOM
            firstName: firstName, 
            //ASSIGN THE LASTNAME FIELD WITH LASTNAME IN DOM
            lastName: lastName, 
            //ASSIGN THE PHONENUMBER FIELD WITH PHONENUMBER IN DOM
            phoneNumber: phoneNumber, 
            //ASSIGN THE EMAILADDRESS FIELD WITH EMAILADDRESS IN DOM
            emailAddress: emailAddress 
        })
    })
        //THEN SEND THE RESPONSE AS THE JSON
        .then(response => response.json())
        //LOG WHAT DATA HAS BEEN SENT
        .then(data => {
            console.log(data);
        })
        //CATCH ANY EXTRANIOUS ERRORS
        .catch(error => console.error('Fetch error:', error));
});