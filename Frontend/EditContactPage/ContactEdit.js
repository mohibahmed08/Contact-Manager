//HOLDS THE DOM FIELD REFERENCE FOR ALL FIELDS
const firstNameField = document.getElementById('first-name-field');
const lastNameField = document.getElementById('last-name-field');
const phoneNumberField = document.getElementById('phone-number-field');
const emailAddressField = document.getElementById('email-address-field');
const favoriteField = document.getElementById('favorite-field');

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
        firstNameField.classList.add('error');
        containsVal = true;
    }
    else firstNameField.classList.remove('error');

    if(lastNameField.value.trim() === "") {
        lastNameField.classList.add('error');
        containsVal = true;
    }
    else lastNameField.classList.remove('error');

    if(emailAddressField.value.trim() === "" || !emailAddressField.value.trim().includes("@") || !emailAddressField.value.trim().includes(".")) {
        emailAddressField.classList.add('error');
        containsVal = true;
    }
    else emailAddressField.classList.remove('error');

    if(phoneNumberField.value.trim() === "" || phoneNumberField.value.trim().length < 14) {
        phoneNumberField.classList.add('error');
        containsVal = true;
    }
    else phoneNumberField.classList.remove('error');

    if(containsVal) return containsVal;
    if(!array) return;

    array.forEach(element => {
        let field = element.split(", ");

        if((field[0] === firstNameField.value.trim() && field[1] === lastNameField.value.trim())) {
            firstNameField.classList.add('error');
            lastNameField.classList.add('error');
            containsVal = true;
        }
        else {
            firstNameField.classList.remove('error');
            lastNameField.classList.add('error');
        }

        if(field[2] === emailAddressField.value.trim()) {
            emailAddressField.classList.add('error');
            containsVal = true;
        }
        else emailAddressField.classList.remove('error');

        if(field[3] === phoneNumberField.value.trim()) {
            phoneNumberField.classList.add('error');
            containsVal = true;
        }
        else phoneNumberField.classList.remove('error');

    });

    return containsVal;

}

function updatePreviewAppearance()
    {
        const preview = document.getElementById('profile-preview');
        const removeBtn = document.getElementById('remove-photo');
        const wrapper = preview.parentElement;

        if (preview.src.includes('pencil-line.svg'))
            {
                preview.style.width = "50%";
                preview.style.height = "50%";
                preview.style.objectFit = "contain";
                wrapper.style.backgroundColor = "#e1ebf7";
                removeBtn.style.display = "none";
            }
        else
            {
                preview.style.width = "100%";
                preview.style.height = "100%";
                preview.style.objectFit = "cover";
                wrapper.style.backgroundColor = "white";
                removeBtn.style.display = "inline";
            }
    }

function compressImage(base64Str)
    {
        return new Promise((resolve) => {
        const img = new Image();
        img.src = base64Str;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_SIZE = 200;
            let width = img.width;
            let height = img.height;

            if(width > height)
                {
                    if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; }
                }
            else
                {
                    if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; }
                }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');

            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, width, height);

            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
    });
    }

document.getElementById('remove-photo').addEventListener('click', function()
    {
        document.getElementById('profile-preview').src = "../Icons/pencil-line.svg";
        updatePreviewAppearance();
        document.getElementById('contactImage').value = "";
    });

document.addEventListener("DOMContentLoaded", () => {

    const raw = localStorage.getItem("contactInfo");
    let savedContactInfo = raw ? JSON.parse(raw) : null;

    if(savedContactInfo){
        if(savedContactInfo.length >= 4){
            document.getElementById('title-label').textContent = "Edit Contact";
            document.getElementById('webpage-name').textContent = "Edit Contact";
            firstNameField.value = savedContactInfo[0];
            lastNameField.value = savedContactInfo[1];
            phoneNumberField.value = savedContactInfo[2];
            emailAddressField.value = savedContactInfo[3];

            if(savedContactInfo.length >= 5 && savedContactInfo[4])
                {
                    document.getElementById('profile-preview').src = savedContactInfo[4];
                }

            favoriteField.checked = Boolean(savedContactInfo[5]);
            updatePreviewAppearance();
        }
        else{
            console.error("INVALID \"fieldInfo\" LOCAL STORAGE!!");
            console.error("PROPER FORMAT: ARRAY OF LENGTH 4 WITH THE FOLLOWING ORDER:\n");
            console.error("0) First Name\n1) Last Name\n2) Phone Number\n3) Email Address");
            savedContactInfo = null;
        }
    }

    if(!savedContactInfo){
        document.getElementById('title-label').textContent = "Create Contact";
        document.getElementById('webpage-name').textContent = "Create Contact";
        setAllFields("");
        favoriteField.checked = false;
    }

    console.log((savedContactInfo ? "Edit" : "Create") + " Contact page loaded");

});

window.addEventListener("beforeunload", () => {
    localStorage.removeItem("contactInfo");
    localStorage.removeItem("ContactID");
});

document.getElementById("back-button").addEventListener("click", function () {
    window.location.href = '../ContactsPage/ContactsPage.html';
});

document.getElementById("back-button-wrapper").addEventListener("click", function () {
    document.getElementById("back-button").click();
});

function getCookieValue(name) {
    const cookies = document.cookie.split("; ");
    for (let c of cookies) {
        const [key, value] = c.split("=");
        if (key === name) return value;
    }
    return null;
}

function isTaken(searchQuery){

    fetch("../../ContactsAPI/searchContacts.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ID: parseInt(getCookieValue("UserID")),
            query: searchQuery
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log(data);
        if (data.error) {
            console.error("API Error:", data.error);
            return;
        }
        setAllFieldsErr(data.results || data);
    })
    .catch(err => {
        console.error("Fetch failed:", err);
    });
}

document.getElementById("action-button").addEventListener("click", function () {

    let firstName = firstNameField.value;
    let lastName = lastNameField.value;
    let phoneNumber = phoneNumberField.value;
    let emailAddress = emailAddressField.value;
    let isFavorite = favoriteField.checked ? 1 : 0;

    const profilePreview = document.getElementById('profile-preview');
    let imageBase64 = profilePreview.src.includes('data:image') ? profilePreview.src : "";

    let isEmpty = setAllFieldsErr();

    if(isEmpty || isTaken(emailAddress)) return;

    const raw = localStorage.getItem("contactInfo");
    const savedContactInfo = raw ? JSON.parse(raw) : null;

    if(savedContactInfo){
        fetch("../../ContactsAPI/editContact.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                FirstName: firstName,
                LastName: lastName,
                Phone: phoneNumber,
                Email: emailAddress,
                UserID: getCookieValue("userId"),
                ID: localStorage.getItem("ContactID"),
                image: imageBase64,
                IsFavorite: isFavorite
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Server response:", data);
            if (data.success) {
                console.log("Update successful!");
                window.location.href = '../ContactsPage/ContactsPage.html';
            } else {
                console.error("Update failed:", data.error);
            }
        })
        .catch(error => {
            console.error("Fetch error:", error);
        });
    }
    else{
        fetch('../../ContactsAPI/createContact.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                FirstName: firstName,
                LastName: lastName,
                Phone: phoneNumber,
                Email: emailAddress,
                UserID: getCookieValue("userId"),
                image: imageBase64,
                IsFavorite: isFavorite
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            window.location.href = '../ContactsPage/ContactsPage.html';
        })
        .catch(error => console.error('Fetch error:', error));
    }
});

document.getElementById('contactImage').addEventListener('change', function(e)
    {
        const file = e.target.files[0];
        if (file)
            {
                const reader = new FileReader();
                reader.onload = async function(event)
                    {
                        const img = document.getElementById('profile-preview');

                        if(file.type === 'image/gif') img.src = event.target.result;
                        else
                            {
                                const compressedBase64 = await compressImage(event.target.result);
                                img.src = compressedBase64;
                            }

                        updatePreviewAppearance();
                    };
                reader.readAsDataURL(file);
            }
});

document.getElementById("phone-number-field").addEventListener("input", function (e) {

    let digits = e.target.value.replace(/\D/g, "").substring(0, 10);

    let parts = [];

    if (digits.length > 0) parts.push("(" + digits.substring(0, 3));
    if (digits.length >= 4) parts.push(") " + digits.substring(3, 6));
    if (digits.length >= 7) parts.push("-" + digits.substring(6, 10));

    e.target.value = parts.join("");

});
