# Small Project - COP4331C, Processes for Object-Oriented Software Development (POOSD)
In this project, we designed, developed, deployed, and present a Personal Contact Manager web application.
Each user on the app can create an account, log in, and manage their own private contacts.

## Features of the app
* User Authentication:
  - Registration (Sign up)
  - Login
* Contact Management (per user)
  - Add contacts
  - Edit contacts
  - Delete contacts
  - Search contacts

## Technologies Used
A LAMP (Linux, Apache, MySQL, and PHP) stack, provided through Digital Ocean, was used in a droplet. The domain
name was obtained through GoDaddy.

## How To Access Application (as of Feb 16, 2026)
**http://colorslab.xyz/**

## Running Locally
This app needs to be served through PHP to use the API files in `ContactsAPI/`.

1. Make sure your local MySQL server is running.
2. Run `bash database/setup_local_mysql.sh` and enter your MySQL root password when prompted.
3. From the repository root, run `php -S localhost:8000`.
4. Open [http://localhost:8000](http://localhost:8000) in your browser.

You can also override the default DB credentials before starting PHP:
`CONTACT_MANAGER_DB_HOST=127.0.0.1 CONTACT_MANAGER_DB_USER=your_mysql_user CONTACT_MANAGER_DB_PASSWORD=your_mysql_password CONTACT_MANAGER_DB_NAME=ContactManager php -S localhost:8000`

## AI Use
We acknowledge the use of AI to help set up, debug, and configure this application, helping us learn along the way.

## Meet the Dev team
* Ryan Murphy: Project Manager / Front-End
* Mohib Ahmed: Front-End
* Jason Comras: Front-End
* Austin Robinson: Database
* Jonathan Slattery: Database / API
* Tyler Wheelhouse: API
* Anthony Mahon: API / Additional Features


University of Central Florida, Spring 2026.
