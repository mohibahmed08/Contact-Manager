let contactToDelete = null;
let searchTimeout = null;

function editContact(button){
    let field = button.closest(".contact");

    let imgElement = field.querySelector(".avatar-img");
    let currentImage = imgElement ? imgElement.src : "";

    let contactInfo = [
        field.querySelector(".first-name").textContent,
        field.querySelector(".last-name").textContent,
        field.querySelector(".phone").textContent,
        field.querySelector(".email").textContent,
        currentImage
    ];

    localStorage.setItem("contactInfo", JSON.stringify(contactInfo));
    localStorage.setItem("ContactID", field.dataset.contactId);

    // Navigate via iframe instead of window.location
    window.parent.navigateTo('/Frontend/EditContactPage/ContactEdit.html');
}

/* ===============================
   DELETE CONTACT
================================ */

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

document.getElementById("confirmDelete").onclick = function () {
    if (!contactToDelete) return;

    const contactId = Number(contactToDelete.dataset.contactId);

    if (!Number.isFinite(contactId)) {
        console.error("Invalid contact ID");
        return;
    }

    let payload = JSON.stringify({
        UserID: window.currentUserId,
        ID: contactId
    });

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://colorslab.xyz/ContactsAPI/removeContact.php", true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            contactToDelete.classList.add("removing");
            setTimeout(() => {
                contactToDelete.remove();
            }, 250);
        }
    };

    xhr.send(payload);

    document.getElementById("deleteModal").style.display = "none";
};

/* ===============================
   BUILD CONTACT CARD
================================ */

function getInitials(firstName, lastName) {
    return firstName[0] + lastName[0];
}

function formatPhone(phone) {
    const digits = String(phone || "").replace(/\D/g, "");
    if (digits.length !== 10) return "";
    return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
}

function buildContact(firstName, lastName, email, phone, contactId, imageBase64) {
    let avatarContent = imageBase64
        ? `<img src="${imageBase64}" class="avatar-img" loading="lazy" style="width:100%; height:100%; border-radius:50%; object-fit:cover; background-color:white; display:block;" alt="Avatar">`
        : getInitials(firstName, lastName);

    return `
    <li class="contact" data-contact-id="${contactId}">
        <div class="contact-info">
            <div class="avatar" style="display: flex; align-items: center; justify-content: center; overflow: hidden; border-radius: 50%;">
                ${avatarContent}
            </div>
            <div class="contact-details">
                <div class="name">
                    <span class="first-name">${firstName}</span>
                    <span class="last-name">${lastName}</span>
                </div>
                <a class="email" href="mailto:${email}">${email}</a>
                <a class="phone" href="tel:${phone}">${formatPhone(phone)}</a>
            </div>
        </div>
        <div class="contact-actions">
            <button class="edit-btn" onclick="editContact(this)">Edit</button>
            <button class="delete-btn" onclick="deleteContact(this)">🗑</button>
        </div>
    </li>`;
}

/* ===============================
   RETRIEVE CONTACTS
================================ */

function retrieveContacts(query = "") {
    let userId = window.currentUserId;
    if (!userId) return;

    let url =
        "http://colorslab.xyz/ContactsAPI/getContacts.php?UserID=" +
        encodeURIComponent(userId) +
        "&query=" +
        encodeURIComponent(query);

    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);

    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let jsonObject = JSON.parse(xhr.responseText);
            let contactListHTML = "";

            for (let i = 0; i < jsonObject.results.length; i++) {
                let c = jsonObject.results[i];
                contactListHTML += buildContact(c.FirstName, c.LastName, c.Email, c.Phone, c.id, c.image);
            }

            document.getElementById("contactList").innerHTML = contactListHTML;
        }
    };

    xhr.send();
}

/* ===============================
   COOKIE + INITIAL LOAD
================================ */

function readCookie() {
    let userId = -1;
    let firstName = "";
    let lastName = "";

    let data = document.cookie.split(";");

    for (let item of data) {
        let [key, value] = item.trim().split("=");
        if (key === "firstName") firstName = value;
        if (key === "lastName") lastName = value;
        if (key === "userId") userId = parseInt(value);
    }

    if (userId < 0 || isNaN(userId)) {
        // Navigate via iframe instead of window.location
        window.parent.navigateTo('/Frontend/HomePage/HomePage.html');
        return;
    }

    window.currentUserId = userId;
    document.getElementById("userName").innerText = "Hello, " + firstName + " " + lastName;

    retrieveContacts();
}

/* ===============================
   LIVE SEARCH (Debounced)
================================ */

document.addEventListener("DOMContentLoaded", function () {
    readCookie();

    const searchInput = document.getElementById("searchText");

    if (searchInput) {
        searchInput.addEventListener("input", function () {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                retrieveContacts(searchInput.value.trim());
            }, 300);
        });
    }
});

/* ===============================
   LOGOUT
================================ */

function doLogout() {
    let date = new Date();
    date.setTime(date.getTime() - 1);

    document.cookie = "firstName=; expires=" + date.toUTCString();
    document.cookie = "lastName=; expires=" + date.toUTCString();
    document.cookie = "userId=; expires=" + date.toUTCString();

    // Navigate via iframe instead of window.location
    window.parent.navigateTo('/Frontend/HomePage/HomePage.html');
}
