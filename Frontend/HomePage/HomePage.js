const urlBase = 'http://colorslab.xyz/ContactsAPI'; 
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

// Tab Switching
function openTab(evt, tabName) {
    var tabContent = document.getElementsByClassName("tab-content");
    for (var i = 0; i < tabContent.length; i++) {
        tabContent[i].classList.remove("active");
    }
    var tabLinks = document.getElementsByClassName("tab-btn");
    for (var i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove("active");
    }
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
    clearErrors();
}

function clearErrors() {
    document.getElementById("loginResult").innerHTML = "";
    document.getElementById("signupResult").innerHTML = "";
    let inputs = document.querySelectorAll("input");
    inputs.forEach(input => input.classList.remove("error"));
}

// Signup
document.getElementById("signup-submit").addEventListener("click", function (e) {
    e.preventDefault();

    let firstNameField = document.getElementById("reg-firstName"); 
    let lastNameField = document.getElementById("reg-lastName");   
    let emailField = document.getElementById("reg-email");         
    let passwordField = document.getElementById("reg-password");   
    let resultSpan = document.getElementById("signupResult");

    // Pull from Field
    let firstNameVal = firstNameField.value.trim(); 
    let lastNameVal = lastNameField.value.trim();   
    let emailVal = emailField.value.trim();         
    let passwordVal = passwordField.value;

    // Validation
    let hasError = false;
    resultSpan.innerHTML = "";

    // 1. First Name Check
    if(firstNameVal === "") { 
        firstNameField.classList.add('error'); 
        hasError = true; 
    } else {
        firstNameField.classList.remove('error');
    }

    // 2. Last Name Check
    if(lastNameVal === "") { 
        lastNameField.classList.add('error'); 
        hasError = true; 
    } else {
        lastNameField.classList.remove('error');
    }

    // 3. Email Check (Empty OR missing '@' OR missing '.')
    if(emailVal === "" || !emailVal.includes("@") || !emailVal.includes(".")) { 
        emailField.classList.add('error'); 
        hasError = true; 
    } else {
        emailField.classList.remove('error');
    }

    // 4. Password Check
    if(passwordVal.trim() === "") { 
        passwordField.classList.add('error'); 
        hasError = true; 
    } else {
        passwordField.classList.remove('error');
    }

    if(hasError) {
        resultSpan.style.color = "red";
        resultSpan.innerHTML = "Please fix the invalid fields."; 
        return;
    }

    // JSON Payload
    let tmp = {
        FirstName: firstNameVal,
        LastName: lastNameVal,
        Login: emailVal,
        Password: passwordVal
    };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/signup.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 201 || this.status == 200) {
                    resultSpan.style.color = "green";
                    resultSpan.innerHTML = "Account Created! Logging in...";
                    
                    // Clear fields
                    firstNameField.value = ""; 
                    lastNameField.value = "";  
                    emailField.value = "";     
                    passwordField.value = ""; 

                    // Auto-switch to login tab
                    setTimeout(function(){
                         let loginBtn = document.querySelector("button[onclick*='login']");
                         if(loginBtn) loginBtn.click();
                    }, 1500);
                } else {
                    try {
                        let jsonObject = JSON.parse(xhr.responseText);
                        resultSpan.style.color = "red";
                        resultSpan.innerHTML = jsonObject.error;
                    } catch {
                        resultSpan.style.color = "red";
                        resultSpan.innerHTML = "Error: " + xhr.status;
                    }
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        resultSpan.innerHTML = err.message;
    }
});

// Login
document.getElementById("login-submit").addEventListener("click", function (e) {
    e.preventDefault(); 

    // Reset Globals
    userId = 0;
    firstName = "";
    lastName = "";

    let login = document.getElementById("login-email").value;
    let password = document.getElementById("login-password").value;
    let resultSpan = document.getElementById("loginResult");

    // Validation
    if(login.trim() === "" || password.trim() === "") {
        resultSpan.style.color = "red";
        resultSpan.innerHTML = "Please enter email and password.";
        if(login.trim() === "") document.getElementById("login-email").classList.add('error');
        if(password.trim() === "") document.getElementById("login-password").classList.add('error');
        return;
    }

    let tmp = {Login: login, Password: password};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    let jsonObject = JSON.parse(xhr.responseText);
                    userId = jsonObject.id;

                    if (userId < 1) {
                        resultSpan.style.color = "red";
                        resultSpan.innerHTML = "User/Password combination incorrect";
                        return;
                    }

                    firstName = jsonObject.FirstName;
                    lastName = jsonObject.LastName;

                    // SAVE COOKIE 
                    saveCookie();

                    // Redirect to ContactPage
                    window.location.href = '../ContactsPage/ContactsPage.html';
                } else {
                    resultSpan.style.color = "red";
                    resultSpan.innerHTML = "User/Password combination incorrect";
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        resultSpan.innerHTML = err.message;
    }
});

// Cookies

function setCookie(name, value, minutes) {
  const expires = new Date(Date.now() + minutes * 60 * 1000).toUTCString();
  value = value ?? ""; // "Clean up" the value so it's safe
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function saveCookie() {
  const minutes = 48 * 60; // 48 hours or two day expiration
  setCookie("firstName", firstName, minutes);
  setCookie("lastName", lastName,  minutes);
  setCookie("userId", String(userId), minutes);
}

