
let contactToDelete = null;

function deleteContact(button) {
    contactToDelete = button.closest(".contact");

    const first = contactToDelete.querySelector(".first-name").textContent;
    const last = contactToDelete.querySelector(".last-name").textContent;

    document.getElementById("deleteText").textContent =
        `Delete contact "${first} ${last}"?`;

    document.getElementById("deleteModal").style.display = "flex";
}
document.getElementById("cancelDelete").onclick = function () {
    contactToDelete = null;
    document.getElementById("deleteModal").style.display = "none";
};

// Implemented to find the contact ID, use it with the remove contact API endpoint, and then delete the html list element
document.getElementById("confirmDelete").onclick = function () {
    if (contactToDelete) {
        contactToDelete.classList.add("removing");

        // Get the contact ID
        const contactId = Number(contactToDelete.dataset.contactId);
        if (!Number.isFinite(contactId)) {
            console.error("Contact ID not found");
            contactToDelete.classList.remove("removing");
            return;
        }

        // Send to the remove endpoint
        let payload = JSON.stringify({ 
            UserID: window.currentUserId,
            ID: contactId
        });

        let url = 'http://colorslab.xyz/ContactsAPI/removeContact.php'; 
        
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true); // 
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        try
        {
            xhr.onreadystatechange = function() 
            {
                if (this.readyState == 4 && this.status == 200) 
                {
                    console.log("Deleted contact successfully!");

                    setTimeout(() => {
                        contactToDelete.remove();
                        contactToDelete = null;
                    }, 250);
                } else if (this.readyState == 4) {
                    console.error("Failed to delete contact:", this.status, this.responseText);
                    contactToDelete.classList.remove("removing");
                    return;                    
                }
            };
            xhr.send(payload);
        }
        catch(err)
        {
            console.error(err.message);
        }
    }

    document.getElementById("deleteModal").style.display = "none";
};

// KEPT THE OLD FUNTION HERE JUST INCASE!
/*
document.getElementById("confirmDelete").onclick = function () {
    if (contactToDelete) {
        contactToDelete.classList.add("removing");

        setTimeout(() => {
            contactToDelete.remove();
            contactToDelete = null;
        }, 250);
    }

    document.getElementById("deleteModal").style.display = "none";
};*/

// ADDED BY JASON TO LINK EDIT TO CONTACT PAGE FOR NOW
document.getElementById("editButton").onclick = () => {
    //OBTAIN THE CONTACT INFO ON CURRENT SELECTION (NEEDS THIS FORMAT FOR IT TO WORK)
    let contactInfo = ["John", "Doe", "(123) 456-7890", "john.doe@example.com"];
    //  ^^^^^^^^^^^ HARD CODED UNTIL YOU SET UP THE LIST TO DYNAMIC !!!!!!!
    //PASS IN THE CURRENT FIELD INFO ARRAY TO LOCAL STORAGE VIA JSON
    localStorage.setItem("contactInfo", JSON.stringify(contactInfo));    
    //SWITCH CONCURRENT WINDOW TO THE CONTACT EDIT PAGE
    window.location.href = '../EditContactPage/ContactEdit.html';
}



// <!-- ADDED BY JONATHAN, YOU CAN REVISE AND DELETE OR MODIFY AS DESIRED -->

    function getInitials(firstName, lastName) {
        return '' + firstName[0] + lastName[0];
    }

    function formatPhone(phone) {
        const digits = String(phone || "").replace(/\D/g, "");

        if (digits.length !== 10) {
            return '';
        }

        phone = digits;

        return '(' + phone[0] + phone[1] + phone[2] + ') ' + phone[3] + phone[4] + phone[5] + "-" + phone[6] + phone[7] + phone[8] + phone[9];
    }

    function buildContact(firstName, lastName, email, phone, contactId) {
        return `<li class="contact" data-contact-id="${contactId}">
            <!-- Left side: avatar + contact details -->
            <div class="contact-info">
                <div class="avatar">${getInitials(firstName, lastName)}</div>
                <div class="contact-details">
                    <div class="name">
                        <span class="first-name">${firstName}</span>
                        <span class="last-name">${lastName}</span>
                    </div>

                    <a class="email" href="mailto:${email}">
                        ${email}
                    </a>
                    <a class="phone" href="tel:${phone}">
                        ${formatPhone(phone)}
                    </a>

                </div>

            </div>

            <!-- Right side: actions -->
            <div class="contact-actions">
                <button class="edit-btn" onclick="editContact(this)">Edit</button>
                <button class="delete-btn" onclick="deleteContact(this)">🗑</button>
            </div>

        </li>`
    }


    // Modified from searchColor() in colors lab
    function retrieveContacts(query="")
    {
        let userId = window.currentUserId; // uses the cookie stored in readCookie
        document.getElementById("contactList").innerHTML = ""; 
        
        let contactList = "";

        let url = 'http://colorslab.xyz/ContactsAPI/getContacts.php?UserID=' + encodeURIComponent(userId) + "&query=" + encodeURIComponent(query); 
        
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url, true); // 
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try
        {
            xhr.onreadystatechange = function() 
            {
                if (this.readyState == 4 && this.status == 200) 
                {
                    // Decode JSON into an array, then loop through the array to add to html
                    let jsonObject = JSON.parse( xhr.responseText );
                    for( let i=0; i<jsonObject.results.length; i++ )
                    {
                        let firstName = jsonObject.results[i].FirstName;
                        let lastName = jsonObject.results[i].LastName;
                        let phone = jsonObject.results[i].Phone;
                        let email = jsonObject.results[i].Email;
                        let contactId = jsonObject.results[i].id; // 

                        let newContact = buildContact(firstName, lastName, email, phone, contactId); // 

                        document.getElementById("contactList").innerHTML += newContact;
                    }

                    console.log("Contacts have been retrieved");
                }
            };
            xhr.send();
        }
        catch(err)
        {
            console.error(err.message);
        }
        
    }



    // Read Cookie When Page Loads
    document.addEventListener('DOMContentLoaded', function() {readCookie();});


    function readCookie() {
        
        let userId = -1;
        let firstName = "";
        let lastName = "";
        
        let data = document.cookie;
        let splits = data.split(";");
        
        for(let i = 0; i < splits.length; i++) {
            let thisOne = splits[i].trim();
            let tokens = thisOne.split("=");
            
            if(tokens[0] == "firstName") {
                firstName = tokens[1];
            }
            else if(tokens[0] == "lastName") {
                lastName = tokens[1];
            }
            else if(tokens[0] == "userId") {
                userId = parseInt(tokens[1].trim());
            }
        }

        // If no user ID found, go back to Login
        if(userId < 0 || isNaN(userId)) {
            window.location.href = '../HomePage/HomePage.html';
        }
        else {
            // save the user id for other uses
            window.currentUserId = userId;
            // Update Greeting
            document.getElementById("userName").innerText = "Hello, " + firstName + " " + lastName;
            // Retrieve Contacts
            retrieveContacts();
            }
    }

    // Logout 
    function doLogout() {
        let userId = 0;
        let firstName = "";
        let lastName = "";
        
        // Set expiration date to the past to delete cookies
        let date = new Date();
        date.setTime(date.getTime() - 1);
        
        document.cookie = "firstName=; expires=" + date.toGMTString();
        document.cookie = "lastName=; expires=" + date.toGMTString();
        document.cookie = "userId=; expires=" + date.toGMTString();
        
        // Redirect to Login Page
        window.location.href = '../HomePage/HomePage.html';
    }

    // Search function (implemented by Jonathan, feel free to modify as needed):
    // function searchContacts() {
    //     // Get the query
    //     let query = document.getElementById("searchText").value;

    //     // Retrieve the contacts matching our query
    //     retrieveContacts(query);
    // }
let searchTimeout;

document.addEventListener('DOMContentLoaded', function() {
    readCookie();

    const searchInput = document.getElementById("searchText");

    searchInput.addEventListener("input", function() {
        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(() => {
            let query = searchInput.value.trim();
            retrieveContacts(query);
        }, 300); // wait 300ms after typing stops
    });
});

function createContact() {
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let phone = document.getElementById("phone").value;
    let email = document.getElementById("email").value;

    let payload = JSON.stringify({
        UserID: window.currentUserId,
        FirstName: firstName,
        LastName: lastName,
        Phone: phone,
        Email: email
    });

    let url = "http://colorslab.xyz/ContactsAPI/createContact.php";

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("Contact created!");
            retrieveContacts(); // refresh list
        }
    };

    xhr.send(payload);
}