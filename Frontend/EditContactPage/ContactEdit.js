const urlBase = "../../ContactsAPI";

const firstNameField = document.getElementById("first-name-field");
const lastNameField = document.getElementById("last-name-field");
const phoneNumberField = document.getElementById("phone-number-field");
const emailAddressField = document.getElementById("email-address-field");
const favoriteField = document.getElementById("favorite-field");

function getApiUrl(endpoint) {
    return `${urlBase}/${endpoint}.php`;
}

function isFavoriteValue(value) {
    return value === true || value === 1 || value === "1";
}

function safeParseJson(text) {
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}

function setAllFields(newText) {
    firstNameField.value = newText;
    lastNameField.value = newText;
    phoneNumberField.value = newText;
    emailAddressField.value = newText;
}

function setAllFieldsErr(array) {
    let containsVal = false;

    if (firstNameField.value.trim() === "") {
        firstNameField.classList.add("error");
        containsVal = true;
    } else firstNameField.classList.remove("error");

    if (lastNameField.value.trim() === "") {
        lastNameField.classList.add("error");
        containsVal = true;
    } else lastNameField.classList.remove("error");

    if (
        emailAddressField.value.trim() === "" ||
        !emailAddressField.value.trim().includes("@") ||
        !emailAddressField.value.trim().includes(".")
    ) {
        emailAddressField.classList.add("error");
        containsVal = true;
    } else emailAddressField.classList.remove("error");

    if (
        phoneNumberField.value.trim() === "" ||
        phoneNumberField.value.trim().length < 14
    ) {
        phoneNumberField.classList.add("error");
        containsVal = true;
    } else phoneNumberField.classList.remove("error");

    if (containsVal) return containsVal;
    if (!array) return;

    array.forEach((element) => {
        const field = element.split(", ");

        if (
            field[0] === firstNameField.value.trim() &&
            field[1] === lastNameField.value.trim()
        ) {
            firstNameField.classList.add("error");
            lastNameField.classList.add("error");
            containsVal = true;
        } else {
            firstNameField.classList.remove("error");
            lastNameField.classList.add("error");
        }

        if (field[2] === emailAddressField.value.trim()) {
            emailAddressField.classList.add("error");
            containsVal = true;
        } else emailAddressField.classList.remove("error");

        if (field[3] === phoneNumberField.value.trim()) {
            phoneNumberField.classList.add("error");
            containsVal = true;
        } else phoneNumberField.classList.remove("error");
    });

    return containsVal;
}

function getSavedContactInfo() {
    const raw = localStorage.getItem("contactInfo");
    if (!raw) return null;

    try {
        const savedContactInfo = JSON.parse(raw);

        if (Array.isArray(savedContactInfo)) {
            if (savedContactInfo.length < 4) {
                return null;
            }

            return {
                FirstName: savedContactInfo[0],
                LastName: savedContactInfo[1],
                Phone: savedContactInfo[2],
                Email: savedContactInfo[3],
                image: savedContactInfo[4] || "",
                IsFavorite: isFavoriteValue(savedContactInfo[5])
            };
        }

        if (savedContactInfo && typeof savedContactInfo === "object") {
            return {
                FirstName: savedContactInfo.FirstName || "",
                LastName: savedContactInfo.LastName || "",
                Phone: savedContactInfo.Phone || "",
                Email: savedContactInfo.Email || "",
                image: savedContactInfo.image || "",
                IsFavorite: isFavoriteValue(savedContactInfo.IsFavorite)
            };
        }
    } catch (error) {
        console.error("Unable to read contactInfo from local storage:", error);
    }

    return null;
}

function setProfilePreview(imageSource) {
    const profilePreview = document.getElementById("profile-preview");

    if (imageSource) {
        profilePreview.style.cssText = "width:100%; height:100%; object-fit:cover;";
        profilePreview.src = imageSource;
        return;
    }

    profilePreview.style.cssText = "";
    profilePreview.src = "../Icons/pencil-line.svg";
}

document.addEventListener("DOMContentLoaded", () => {
    const savedContactInfo = getSavedContactInfo();

    if (savedContactInfo) {
        document.getElementById("title-label").textContent = "Edit Contact";
        document.getElementById("webpage-name").textContent = "Edit Contact";

        firstNameField.value = savedContactInfo.FirstName;
        lastNameField.value = savedContactInfo.LastName;
        phoneNumberField.value = savedContactInfo.Phone;
        emailAddressField.value = savedContactInfo.Email;
        favoriteField.checked = savedContactInfo.IsFavorite;

        if (savedContactInfo.image) {
            setProfilePreview(savedContactInfo.image);
        }
    } else {
        document.getElementById("title-label").textContent = "Create Contact";
        document.getElementById("webpage-name").textContent = "Create Contact";
        setAllFields("");
        favoriteField.checked = false;
        setProfilePreview("");
    }

    console.log(`${savedContactInfo ? "Edit" : "Create"} Contact page loaded`);
});

window.addEventListener("beforeunload", () => {
    localStorage.removeItem("contactInfo");
    localStorage.removeItem("ContactID");
});

document.getElementById("back-button").addEventListener("click", function () {
    window.location.href = "../ContactsPage/ContactsPage.html";
});

document.getElementById("back-button-wrapper").addEventListener("click", function () {
    document.getElementById("back-button").click();
});

function getCookieValue(name) {
    const cookies = document.cookie.split("; ");
    for (const c of cookies) {
        const [key, value] = c.split("=");
        if (key === name) return value;
    }

    return null;
}

function isTaken(searchQuery) {
    fetch(getApiUrl("searchContacts"), {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ID: parseInt(getCookieValue("userId"), 10),
            query: searchQuery
        })
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            if (data.error) {
                console.error("API Error:", data.error);
                return;
            }

            setAllFieldsErr(data.results || data);
        })
        .catch((err) => {
            console.error("Fetch failed:", err);
        });
}

document.getElementById("action-button").addEventListener("click", function () {
    const firstName = firstNameField.value.trim();
    const lastName = lastNameField.value.trim();
    const phoneNumber = phoneNumberField.value.trim();
    const emailAddress = emailAddressField.value.trim();
    const isFavorite = favoriteField.checked;
    const profilePreview = document.getElementById("profile-preview");
    const imageBase64 = profilePreview.src.includes("data:image") ? profilePreview.src : "";

    const isEmpty = setAllFieldsErr();

    if (isEmpty) return;

    const savedContactInfo = getSavedContactInfo();
    const payload = {
        FirstName: firstName,
        LastName: lastName,
        Phone: phoneNumber,
        Email: emailAddress,
        UserID: getCookieValue("userId"),
        IsFavorite: isFavorite,
        image: imageBase64
    };

    if (savedContactInfo) {
        payload.ID = localStorage.getItem("ContactID");
    }

    fetch(getApiUrl(savedContactInfo ? "editContact" : "createContact"), {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
        .then((response) => response.text())
        .then((text) => {
            const data = safeParseJson(text);

            if (!data) {
                console.error("Save failed with non-JSON response:", text);
                return;
            }

            console.log("Server response:", data);
            if (data.success === false) {
                console.error("Save failed:", data.error);
                return;
            }

            window.location.href = "../ContactsPage/ContactsPage.html";
        })
        .catch((error) => {
            console.error("Fetch error:", error);
        });
});

document.getElementById("contactImage").addEventListener("change", function (e) {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        setProfilePreview(event.target.result);
    };
    reader.readAsDataURL(file);
});

document.getElementById("phone-number-field").addEventListener("input", function (e) {
    const digits = e.target.value.replace(/\D/g, "").substring(0, 10);
    const parts = [];

    if (digits.length > 0) parts.push("(" + digits.substring(0, 3));
    if (digits.length >= 4) parts.push(") " + digits.substring(3, 6));
    if (digits.length >= 7) parts.push("-" + digits.substring(6, 10));

    e.target.value = parts.join("");
});
