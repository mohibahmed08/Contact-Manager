const urlBase = "../../ContactsAPI";

let contactToDelete = null;
let searchTimeout = null;

function getApiUrl(endpoint) {
    return `${urlBase}/${endpoint}.php`;
}

function isFavoriteValue(value) {
    return value === true || value === 1 || value === "1";
}

function refreshContacts() {
    const searchInput = document.getElementById("searchText");
    retrieveContacts(searchInput ? searchInput.value.trim() : "");
}

function searchContacts() {
    refreshContacts();
}

function editContact(button) {
    const field = button.closest(".contact");
    const imgElement = field.querySelector(".avatar-img");
    const currentImage = imgElement ? imgElement.src : "";

    const contactInfo = {
        FirstName: field.querySelector(".first-name").textContent,
        LastName: field.querySelector(".last-name").textContent,
        Phone: field.querySelector(".phone").textContent,
        Email: field.querySelector(".email").textContent,
        image: currentImage,
        IsFavorite: isFavoriteValue(field.dataset.isFavorite)
    };

    localStorage.setItem("contactInfo", JSON.stringify(contactInfo));
    localStorage.setItem("ContactID", field.dataset.contactId);
    window.location.href = "../EditContactPage/ContactEdit.html";
}

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

    const payload = JSON.stringify({
        UserID: window.currentUserId,
        ID: contactId
    });

    const xhr = new XMLHttpRequest();
    xhr.open("POST", getApiUrl("removeContact"), true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            contactToDelete.classList.add("removing");

            setTimeout(() => {
                contactToDelete = null;
                refreshContacts();
            }, 250);
        }
    };

    xhr.send(payload);
    document.getElementById("deleteModal").style.display = "none";
};

function toggleFavorite(button) {
    const contactCard = button.closest(".contact");
    const contactId = Number(contactCard.dataset.contactId);

    if (!Number.isFinite(contactId)) {
        console.error("Invalid contact ID");
        return;
    }

    const shouldFavorite = !isFavoriteValue(contactCard.dataset.isFavorite);
    button.disabled = true;

    fetch(getApiUrl("toggleFavorite"), {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            UserID: window.currentUserId,
            ID: contactId,
            IsFavorite: shouldFavorite
        })
    })
        .then((response) => response.json())
        .then((data) => {
            if (!data.success) {
                throw new Error(data.error || "Unable to update favorite.");
            }

            refreshContacts();
        })
        .catch((error) => {
            console.error("Favorite toggle failed:", error);
        })
        .finally(() => {
            button.disabled = false;
        });
}

function getInitials(firstName, lastName) {
    const safeFirstName = String(firstName || "");
    const safeLastName = String(lastName || "");

    return `${safeFirstName.charAt(0)}${safeLastName.charAt(0)}`.trim();
}

function formatPhone(phone) {
    const digits = String(phone || "").replace(/\D/g, "");

    if (digits.length !== 10) return phone || "";

    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function buildContact(firstName, lastName, email, phone, contactId, imageBase64, isFavorite) {
    const favorite = isFavoriteValue(isFavorite);
    const avatarContent = imageBase64
        ? `<img src="${imageBase64}" class="avatar-img" alt="Avatar">`
        : getInitials(firstName, lastName);

    return `
    <li class="contact${favorite ? " favorite" : ""}" data-contact-id="${contactId}" data-is-favorite="${favorite ? 1 : 0}">
        <div class="contact-info">
            <div class="avatar">${avatarContent}</div>
            <div class="contact-details">
                <div class="name">
                    <span class="first-name">${firstName}</span>
                    <span class="last-name">${lastName}</span>
                    ${favorite ? '<span class="favorite-badge">Favorite</span>' : ""}
                </div>
                <a class="email" href="mailto:${email}">${email}</a>
                <a class="phone" href="tel:${phone}">${formatPhone(phone)}</a>
            </div>
        </div>

        <div class="contact-actions">
            <button
                class="favorite-btn${favorite ? " active" : ""}"
                type="button"
                onclick="toggleFavorite(this)"
                aria-label="${favorite ? "Remove from favorites" : "Add to favorites"} for ${firstName} ${lastName}"
                aria-pressed="${favorite ? "true" : "false"}"
            >
                ${favorite ? "&#9733;" : "&#9734;"}
            </button>
            <button class="edit-btn" type="button" onclick="editContact(this)">Edit</button>
            <button class="delete-btn" type="button" onclick="deleteContact(this)">Delete</button>
        </div>
    </li>`;
}

function retrieveContacts(query = "") {
    const userId = window.currentUserId;
    if (!userId) return;

    const url =
        `${getApiUrl("getContacts")}?UserID=${encodeURIComponent(userId)}&query=${encodeURIComponent(query)}`;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);

    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const jsonObject = JSON.parse(xhr.responseText);
            let contactListHTML = "";

            for (let i = 0; i < jsonObject.results.length; i++) {
                const c = jsonObject.results[i];

                contactListHTML += buildContact(
                    c.FirstName,
                    c.LastName,
                    c.Email,
                    c.Phone,
                    c.id,
                    c.image,
                    c.IsFavorite
                );
            }

            if (!contactListHTML) {
                contactListHTML = '<li id="emptyState">No contacts found.</li>';
            }

            document.getElementById("contactList").innerHTML = contactListHTML;
        }
    };

    xhr.send();
}

function readCookie() {
    let userId = -1;
    let firstName = "";
    let lastName = "";

    const data = document.cookie.split(";");

    for (const item of data) {
        const [key, value] = item.trim().split("=");

        if (key === "firstName") firstName = value;
        if (key === "lastName") lastName = value;
        if (key === "userId") userId = parseInt(value, 10);
    }

    if (userId < 0 || isNaN(userId)) {
        window.location.href = "../HomePage/HomePage.html";
        return;
    }

    window.currentUserId = userId;
    document.getElementById("userName").innerText =
        "Hello, " + firstName + " " + lastName;

    retrieveContacts();
}

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

function doLogout() {
    const date = new Date();
    date.setTime(date.getTime() - 1);

    document.cookie = "firstName=; expires=" + date.toUTCString();
    document.cookie = "lastName=; expires=" + date.toUTCString();
    document.cookie = "userId=; expires=" + date.toUTCString();

    window.location.href = "../HomePage/HomePage.html";
}
