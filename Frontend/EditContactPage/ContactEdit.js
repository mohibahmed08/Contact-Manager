//HOLDS THE DOM FIELD REFERENCE FOR ALL FIELDS
const firstNameField = document.getElementById('first-name-field');
const lastNameField = document.getElementById('last-name-field');
const phoneNumberField = document.getElementById('phone-number-field');
const emailAddressField = document.getElementById('email-address-field');

//SETS ALL FIELDS TO A CERTAIN PARAMETER
function setAllFields(newText){
    firstNameField.textContent = newText;
    lastNameField.textContent = newText;
    phoneNumberField.textContent = newText;
    emailAddressField.textContent = newText;
}

//SETS ALL FIELDS TO ERROR FOR A CERTAIN PARAMETER
function setAllFieldsErr(array){

    //ORIGINATE CONTAINS VALUE TO FALSE
    let containsVal = false;

    //IF ANY FIELD IS EMPTY, RETURN ERROR
    if(firstNameField.value.trim() === "") { 
        //ADD THE ERROR IF EMPTY FIELD
        firstNameField.classList.add('error'); 
        //STATE ERROR FOR RETURN
        containsVal = true; 
    }
    //ELSE REMOVE ERROR
    else firstNameField.classList.remove('error');

    //IF ANY FIELD IS EMPTY, RETURN ERROR
    if(lastNameField.value.trim() === "") {
        //ADD THE ERROR IF EMPTY FIELD
        lastNameField.classList.add('error');
        //STATE ERROR FOR RETURN
        containsVal = true;
    }
    //ELSE REMOVE ERROR
    else lastNameField.classList.remove('error');

    //IF ANY FIELD IS EMPTY OR IF ADDRESS FIELD DOESN'T CONTAIN '@' OR '.', RETURN ERROR
    if(emailAddressField.value.trim() === "" || !emailAddressField.value.trim().includes("@") || !emailAddressField.value.trim().includes(".")) {
        //ADD THE ERROR IF EMPTY FIELD
        emailAddressField.classList.add('error');
        //STATE ERROR FOR RETURN
        containsVal = true;
    }
    //ELSE REMOVE ERROR
    else emailAddressField.classList.remove('error');

    //IF ANY FIELD IS EMPTY OR IF PHONE NUMBER FIELD DOESN'T CONTAIN ALL DIGITS NEEDED, RETURN ERROR
    if(phoneNumberField.value.trim() === "" || phoneNumberField.value.trim().length < 14) {
        //ADD THE ERROR IF EMPTY FIELD
        phoneNumberField.classList.add('error');
        //STATE ERROR FOR RETURN
        containsVal = true;
    }
    //ELSE REMOVE ERROR
    else phoneNumberField.classList.remove('error');

    //IF ERROR EXISTS, RETURN
    if(containsVal) return containsVal;

    //IF ARRAY IS EMPTY, RETURN
    if(!array) return;

    //CHECK IF PHP RETURNED ARRAY CONTAINS ALL SAME INFO AS BEING ENTERED
    array.forEach(element => {
        
        //SPLIT THE CURRENT FIELD INTO ARRAY CONTENTS
        let field = element.split(", ");
        
        //CHECK IF THE (FIRST && LAST) || EMAIL || PHONE MATCH
        if(
            //IF THE FIRST AND LAST NAME ARE THE SAME, THEN YOU HAVE A DUPLICATE
            (field[0] === firstNameField.value.trim() && field[1] === lastNameField.value.trim()) 
        ){
            //SET ERROR TO THE FIRST AND LAST NAME FIELD
            firstNameField.classList.add('error');
            lastNameField.classList.add('error');
            //SET CONTAINS VALUE TO TRUE
            containsVal = true;
        }
        //ELSE REMOVE THE ERROR
        else {
            firstNameField.classList.remove('error');
            lastNameField.classList.add('error');
        }
      
        if(
            //NEXT CHECK FOR MATCHING EMAIL ADDRESS
            field[2] === emailAddressField.value.trim()
        ){
            //SET ERROR TO THE EMAIL ADDRESS FIELD
            emailAddressField.classList.add('error');
            //SET CONTAINS VALUE TO TRUE
            containsVal = true;
        }
        //ELSE REMOVE THE ERROR
        else emailAddressField.classList.remove('error');
      
        if(
            //FINALLY CHECK FOR MATCHING PHONE NUMBER
            field[3] === phoneNumberField.value.trim()
        ){
            //SET ERROR TO THE PHONE FIELD
            phoneNumberField.classList.add('error');
            //SET CONTAINS VALUE TO TRUE
            containsVal = true;
        }
        //ELSE REMOVE THE ERROR
        else phoneNumberField.classList.remove('error');

    });
    
    //RETURN CONTAINS VALUE AFTER EDITS
    return containsVal;

}

//LOADED DOM ON PAGE STARTUP
document.addEventListener("DOMContentLoaded", () => {
    
    //ACCESS LOCAL STORAGE THAT MAY OR MAY NOT HAVE BEEN INITALIZED ON PRIOR PAGE
    const raw = localStorage.getItem("contactInfo");
    const savedContactInfo = raw ? JSON.parse(raw) : null;
    //I'M ASSUMING LOCAL STORAGE IS AN ARRAY OF THE FIELDS

    //IF SAVED FIELD INFO IS NULL (I.E. WE DIDN'T HAVE LOCAL STORAGE)
    //THEN WE ARE CREATING A NEW CONTACT SINCE THERE'S NOTHING TO EDIT
    //OTHERWISE WE ARE EDITING A CONTACT AND WE SET UP THE FIELDS ACCORDINGLY

    //WE HAVE STORED INFORMATION FROM OUR LOCAL STORAGE (AND ITS THE PROPER SIZE)
    if(savedContactInfo){ 
        //CHECK IF PROPER SIZE AND IN PROPER ORDER
        if(savedContactInfo.length >= 4){
            //SET THE TITLE TO EDIT CONTACT
            document.getElementById('title-label').textContent = "Edit Contact";
            //SET THE WEBPAGE NAME ACCORDINGLY
            document.getElementById('webpage-name').textContent = "Edit Contact";
            //INITALIZE THE FIELDS ACCORDINGLY (ASSUMING IN PROPER ORDER)
            firstNameField.value = savedContactInfo[0];
            lastNameField.value = savedContactInfo[1];
            phoneNumberField.value = savedContactInfo[2];
            emailAddressField.value = savedContactInfo[3];
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
        //SET THE WEBPAGE NAME ACCORDINGLY
        document.getElementById('webpage-name').textContent = "Create Contact";
        //INITALIZE THE FIELDS ACCORDINGLY
        setAllFields("");
    }

    //STATE SUCCESSFUL LOADING WITH PROPER TITLE
    console.log((savedContactInfo) ? "Edit" : "Create" + " Contact page loaded");

});

//UNLOADING DOM ON PAGE END
window.addEventListener("beforeunload", (e) => {
    //CLEAR THE LOCAL STORAGE CACHE WITH PRIOR CONTACT
    localStorage.removeItem("contactInfo");
    localStorage.removeItem("ContactID");
});

//IF BACK BUTTON IS CLICKED
document.getElementById("back-button").addEventListener("click", function () {
    //SWITCH BACK TO THE CONTACT PAGE
    window.location.href = '../ContactsPage/ContactsPage.html';
});
//TIE THE WRAPPER OF THE BACK BUTTON TO DO THE SAME THING
document.getElementById("back-button-wrapper").addEventListener("click", function () {
    //ACTIVATE BACK BUTTON CLICK ABOVE
    document.getElementById("back-button").click();
});

//GETS THE COOKIE'S VALUE BY NAME
function getCookieValue(name) {
    //SPLIT THE COOKIE BY DELIMETER
    const cookies = document.cookie.split("; ");
    //ITERATE THROUGH COOKIES
    for (let c of cookies) {
        //SPLIT THE KEY FROM ITS VALUE
        const [key, value] = c.split("=");
        //RETURN THE VALUE THAT EQUATES TO KEY
        if (key === name) return value;
    }
    //IF NO VALUE FOUND WITH KEY, RETURN NULL
    return null;
}

//CHECKS IF A FIELD IS UNIQUE FROM WHATS IN THE DB
//-------------> REMOVE DEAD VARIABLES IF NOT NEEDED WHEN MERGE
function isTaken(searchQuery){ 
    
    //SEARCH THE CONTACTS VIA BACKEND TO SEE IF CONTACT HAS ALREADY BEEN ASSIGNED
    fetch("../../ContactsAPI/searchContacts.php", {
        //POST THE CONTACT INFORMATION TO SEARCH FOR
        method: "POST",
        //SPECIFY JSON CODE BETWEEN API AND FRONTEND
        headers: {
            "Content-Type": "application/json"
        },
        //TURN THE USER ID AND NAME INTO SEARCH FOR
        body: JSON.stringify({
            ID: parseInt(getCookieValue("UserID")), //FORMAT: [FIRSTNAME;LASTNAME;USERID]
            query: searchQuery //SEARCH FOR EMAIL ADDRESS TO CONFIRM NOT SAME PERSON
        })
    })
    //THEN SEND THE RESPONSE AS THE JSON
    .then(res => res.json())

    //LOG WHAT DATA HAS BEEN SENT
    .then(data => {
        //SEND API DATA TO SCREEN
        console.log(data);
        //LOG ANY API EXTRANIOUS ERRORS
        if (data.error) {
            console.error("API Error:", data.error);
            return;
        }
        //SEND THE ARRAY OF FIELDS TO BE RETURNED
        setAllFieldsErr(data.results || data);
    })
    //LOG ANY FETCH EXTRANIOUS ERRORS
    .catch(err => {
        console.error("Fetch failed:", err);
    });
} 

//TASKS FOR WHEN WHEN THE ACTION BUTTON IS CLICKED
document.getElementById("action-button").addEventListener("click", function () {
    
    //TAKE FIELD INFORMATION FROM THE CREATE CONTACT FIELDS
    let firstName = firstNameField.value;
    let lastName = lastNameField.value;
    let phoneNumber = phoneNumberField.value;
    let emailAddress = emailAddressField.value;

    //IF ANY FIELDS CONTAIN EMPTY STRING
    let isEmpty = setAllFieldsErr();
    
    //CHECK IF THE FIELD DATA HAS BEEN TAKEN ALREADY IN BACKEND
    if(isEmpty || isTaken(emailAddress)) return; //PASS IN CURRENT FIELD INFO (NEED METHOD TO BE COMPLETED !!!!!!!!)

    //CONTACT IMAGE LOGIC
    const fileInput = document.getElementById('contactImage');
    const file = fileInput.files[0];    //Get the selected file

    if(file)    //If a file is selected, convert it before sending
        {
	    const reader = new FileReader();    //We will use a built-in browser tool called FileReader to read the image file and convert it
	    reader.onloadend = function() {sendContactData(reader.result);};    //Once converted to Base64, trigger the send function
	    reader.readAsDataURL(file);
	}
    else
        {
	    const raw = localStorage.getItem("contactInfo");    //If editing but no new file is chosen, keep the old image!
	    const oldData = raw ? JSON.parse(raw) : null;

	    //If oldData[4] exists (the old image), send it. Otherwise, send an empty string
            let imageToSend = (oldData && oldData[4]) ? oldData[4] : "";
            sendContactData(imageToSend);
	}
	    
    function sendContactData(base64Image) {
        //OBTAIN CONTACT INFO IT EXISTS
        const raw = localStorage.getItem("contactInfo");
        const savedContactInfo = raw ? JSON.parse(raw) : null;

        //IF EDIT CONTACT, THERE WILL BE INFORMATION PASSED IN
        if(savedContactInfo){ 
            //IF NOT ALREADY TAKEN, THEN SEND TO BACKEND VIA API ENDPOINT
            fetch("../../ContactsAPI/editContact.php", {
                //POST TO THE BACKEND PHP
                method: "POST",
                //STATE WE ARE SENDING JSON FILE TYPE
                headers: {
                    "Content-Type": "application/json"
                },
                //STRINGIFY FIELD INFO TO JSON DELIVERABLE
                body: JSON.stringify({
                    //ASSIGN THE FIRSTNAME FIELD WITH FIRSTNAME IN DOM
                    FirstName: firstName,
                    //ASSIGN THE LASTNAME FIELD WITH FIRSTNAME IN DOM
                    LastName: lastName,
                    //ASSIGN THE PHONE NUMBER FIELD WITH FIRSTNAME IN DOM
                    Phone: phoneNumber,
                    //ASSIGN THE EMAIL ADDRESS FIELD WITH FIRSTNAME IN DOM
                    Email: emailAddress,
                    //ASSIGN THE USER ID FIELD LOGIN ID
                    UserID: getCookieValue("userId"),
                    //ASSIGN THE IMAGE STRING
                    image: base64Image,
                    //ASSIGN THE CONTACT ID WITH THE CONTACT EDITING 
                    ID: localStorage.getItem("ContactID") // <------- !!!!!!!!!!!!! PROBABLY THE ERROR IF ONE EXISTS !!!!!!!!!
                })
            })
            //THEN SEND THE RESPONSE AS THE JSON
            .then(response => response.json())
            //LOG WHAT DATA HAS BEEN SENT
            .then(data => {
                console.log("Server response:", data);
                if (data.success) {
                    console.log("Update successful!");
                    //IF UPDATE SUCCESSFUL, RETURN BACK TO CONTACT PAGE
                    window.location.href = '../ContactsPage/ContactsPage.html';
                } else {
                    console.error("Update failed:", data.error);
                }
            })
            //CATCH ANY EXTRANIOUS ERRORS
            .catch(error => {
                console.error("Fetch error:", error);
            });
        }
        //ELSE ITS CREATE CONTACT
        else{
            //IF NOT ALREADY TAKEN, THEN SEND TO BACKEND VIA API ENDPOINT
            fetch('../../ContactsAPI/createContact.php', { // <-- CHANGE THIS OUT WITH THE ACTUAL BACKEND CODE NAME !!!!!!!!!!!!!
                //POST TO THE BACKEND PHP
                method: 'POST',
                //STATE WE ARE SENDING JSON FILE TYPE
                headers: {
                    'Content-Type': 'application/json',
                },
                //STRINGIFY FIELD INFO TO JSON DELIVERABLE
                body: JSON.stringify({ 
                    //ASSIGN THE FIRSTNAME FIELD WITH FIRSTNAME IN DOM
                    FirstName: firstName, 
                    //ASSIGN THE LASTNAME FIELD WITH LASTNAME IN DOM
                    LastName: lastName, 
                    //ASSIGN THE PHONENUMBER FIELD WITH PHONENUMBER IN DOM
                    Phone: phoneNumber, 
                    //ASSIGN THE EMAILADDRESS FIELD WITH EMAILADDRESS IN DOM
                    Email: emailAddress,
                    //ASSIGN THE IMAGE STRING
                    image: base64Image,
                    //ASSIGN THE ID FIELD WITH LOCAL STORAGE IN DOM
                    UserID: getCookieValue("userId") //OR CHANGE WITH WHATEVER HOLDS THE ID
                })
            })
            //THEN SEND THE RESPONSE AS THE JSON
            .then(response => response.json())
            //LOG WHAT DATA HAS BEEN SENT
            .then(data => {
                //LOG UPDATED DATA
                console.log(data);
                //IF UPDATE SUCCESSFUL, RETURN BACK TO CONTACT PAGE
                window.location.href = '../ContactsPage/ContactsPage.html';
            })
            //CATCH ANY EXTRANIOUS ERRORS
            .catch(error => console.error('Fetch error:', error));
        }
    }
});

//FOR FORMATTING THE PHONE NUMBER FIELD PROPERLY AS USER TYPES THEIR PHONE NUMBER
document.getElementById("phone-number-field").addEventListener("input", function (e) {

    //REMOVE EVERYTHING THAT ISN'T A NUMBER AND LIMIT THE RESULT TO 10 DIGITS ONLY
    let digits = e.target.value.replace(/\D/g, "").substring(0, 10);

    //SEPARATE THE PHONE NUMBER INTO PARTS
    let parts = [];

    //IF THEIR IS SOMETHING ENTERED, PUSH OPEN PARARENTHESIS AT FIRST INDEX
    if (digits.length > 0) parts.push("(" + digits.substring(0, 3));
    //IF YOU'VE ENTERED THE FIRST 3 DIGITS, THEN CLOSE THE PARENTHESIS FOR AREA CODE
    if (digits.length >= 4) parts.push(") " + digits.substring(3, 6));
    //AFTER THE NEXT 3 DIGITS, HAVE A DASH TO SEPARATE PHONE NUMBER FIELD
    if (digits.length >= 7) parts.push("-" + digits.substring(6, 10));

    //REJOIN THE FIELD PARTS WITHIN THE FIELD TO SHOW PROPER FORMATTING
    e.target.value = parts.join("");

});

