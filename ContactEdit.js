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

    //IF FIRST NAME EXISTS IN LIST, ADD ERROR, ELSE REMOVE ERROR
    if(firstNameField.value.trim() === "" || (array && array.includes(firstNameField.value.trim()))) {
        firstNameField.classList.add('error');
        containsVal = true;
    }
    else firstNameField.classList.remove('error');
    
    //IF LAST NAME EXISTS IN LIST, ADD ERROR, ELSE REMOVE ERROR
    if(lastNameField.value.trim() === "" || (array && array.includes(lastNameField.value.trim()))) {
        lastNameField.classList.add('error');
        containsVal = true;
    }
    else lastNameField.classList.remove('error');
   
    //IF PHONE NUMBER EXISTS IN LIST, ADD ERROR, ELSE REMOVE ERROR
    if(phoneNumberField.value.trim() === "" || (array && array.includes(phoneNumberField.value.trim()))){
        phoneNumberField.classList.add('error');
        containsVal = true;
    } 
    else phoneNumberField.classList.remove('error');
    
    //IF EMAIL ADDRESS EXISTS IN LIST, ADD ERROR, ELSE REMOVE ERROR
    if(emailAddressField.value.trim() === "" || (array && array.includes(emailAddressField.value.trim()))) {
        emailAddressField.classList.add('error');
        containsVal = true;
    }
    else emailAddressField.classList.remove('error');

    //RETURN CONTAINS VALUE AFTER EDITS
    return containsVal;

}

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

//IF BACK BUTTON IS CLICKED
document.getElementById("back-button").addEventListener("click", function () {
    //SWITCH BACK TO THE CONTACT PAGE
    window.location.href = 'Contacts.html';
});
//TIE THE WRAPPER OF THE BACK BUTTON TO DO THE SAME THING
document.getElementById("back-button-wrapper").addEventListener("click", function () {
    //ACTIVATE BACK BUTTON CLICK ABOVE
    document.getElementById("back-button").click();
});

//CHECKS IF A FIELD IS UNIQUE FROM WHATS IN THE DB
function isTaken(firstName, lastName, phoneNumber, emailAddress){
    
    //SEARCH FOR THE CONTACT TO SEE IF ITS BEEN ENTERED PRIOR
    let results = search(firstName, lastName, phoneNumber, emailAddress);
    
    //SET ALL FIELDS BASED ON IF RESULTS CONTAINS VALUE
    setAllFieldsErr(results);

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
    if(isEmpty || isTaken(firstName, lastName, phoneNumber, emailAddress)) return; //PASS IN CURRENT FIELD INFO (NEED METHOD TO BE COMPLETED !!!!!!!!)

    //IF NOT ALREADY TAKEN, THEN SEND TO BACKEND VIA API ENDPOINT
    fetch('addContact.php', { // <-- CHANGE THIS OUT WITH THE ACTUAL BACKEND CODE NAME !!!!!!!!!!!!!
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