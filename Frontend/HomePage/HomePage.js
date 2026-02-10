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

    let firstNameVal = document.getElementById("reg-firstName").value;
    let lastNameVal = document.getElementById("reg-lastName").value;
    let emailVal = document.getElementById("reg-email").value;
    let passwordVal = document.getElementById("reg-password").value;
    let resultSpan = document.getElementById("signupResult");

    // Validation
    let hasError = false;
    resultSpan.innerHTML = "";

    if(firstNameVal.trim() === "") { document.getElementById("reg-firstName").classList.add('error'); hasError = true; } 
    else document.getElementById("reg-firstName").classList.remove('error');

    if(lastNameVal.trim() === "") { document.getElementById("reg-lastName").classList.add('error'); hasError = true; } 
    else document.getElementById("reg-lastName").classList.remove('error');

    if(emailVal.trim() === "") { document.getElementById("reg-email").classList.add('error'); hasError = true; } 
    else document.getElementById("reg-email").classList.remove('error');

    if(passwordVal.trim() === "") { document.getElementById("reg-password").classList.add('error'); hasError = true; } 
    else document.getElementById("reg-password").classList.remove('error');

    if(hasError) {
        resultSpan.style.color = "red";
        resultSpan.innerHTML = "Please fill in all fields.";
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
                    document.getElementById("reg-firstName").value = "";
                    document.getElementById("reg-lastName").value = "";
                    document.getElementById("reg-email").value = "";
                    document.getElementById("reg-password").value = "";

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

                    firstName = jsonObject.firstName;
                    lastName = jsonObject.lastName;

                    // SAVE COOKIE 
                    saveCookie();

                    // Redirect to ContactPage
                    window.location.href = "ContactPages.html";
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
function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");
    for(let i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if(tokens[0] == "firstName") firstName = tokens[1];
        else if(tokens[0] == "lastName") lastName = tokens[1];
        else if(tokens[0] == "userId") userId = parseInt(tokens[1].trim());
    }
}
