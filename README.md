# KARA
## Table of Content 
 - [About The Application](#about-the-application)
 - [Inspiration](#inspiration)
 - [Technologies](#technologies)
 - [Client Pages](#client-pages)
 - [Server Routes](#server-routes) 
 - [Usage](#usage)

### About the Application 
---
KARA is a web application that allows its user to perform basic SQL operations on their local MSSQL servers.

### Inspiration 
---
The ideology behind the inception of our project was that we wanted to provide a solution topeople who are unfamiliar with SQL or people who have limited understanding of SQL. Generally, for beginners, when thinking about working with databases, one of the more daunting obstacles is the notion of having to understand SQL and how to build queries to emulate the operations you want done. This indirectly creates a constraint and takes away from the experience because they feel the need to have to learn how to create proper SQL queries
before ever interacting with databases. We hope to alleviate this constraint by allowing people to learn and interact in parallel. We want to allow users to work with databases but also provide insight on how their interactions correlate to SQL.

### Technologies 
---
- **The Client side** was built on ***Reactjs*** for the view.
- **The Server side** was built with ***Python*** and ***SQL***

### Client Pages 
--- 
- ### *Login* 
  ![login](https://user-images.githubusercontent.com/44884500/169722332-d1a6361d-0767-4a22-8ee5-2667108e7d83.jpg)
- ### *Databases*
  ![databases](https://user-images.githubusercontent.com/44884500/169722358-0815e4a7-58e9-4f83-a9fa-e7a4f9cae666.jpg)
- ### *Add New Database*
  ![add_new_db](https://user-images.githubusercontent.com/44884500/169722374-f0421473-3531-41c4-ba69-f7fc7cf72581.jpg)
- ### *Tables*
  ![tables](https://user-images.githubusercontent.com/44884500/169722462-19bf05eb-bdd1-451b-a35d-10418cf94261.jpg)
- ### *Add New Table*
  ![add_new_table](https://user-images.githubusercontent.com/44884500/169722472-e162ae35-ee75-4fc3-b0ea-0a9ed6af0879.jpg)
- ### *Entries*
  ![entries](https://user-images.githubusercontent.com/44884500/169722489-850f563b-eb5b-4c0d-8638-8a54cd1ce656.jpg)
- ### *Add New Entry*
  ![add_new_entry](https://user-images.githubusercontent.com/44884500/169722505-46a8e444-699d-4267-a690-a0cd0f56f6ad.jpg)

### Server Routes
--- 
- ### *GET* /
	- Returns a JSON Object
  	```javascript
  	{'status': 200, 'response': 'Server is running ...'}
    ```
- ### *POST* /login
- ### *POST* /db/info
- ### *POST* /db/create
- ### *POST* /db/delete
- ### *POST* /db/rename
- ### *POST* /table/metadata
- ### *POST* /table/info
- ### *POST* /table/create
- ### *POST* /table/delete
- ### *POST* /table/rename
- ### *POST* /table/add
- ### *POST* /table/remove
- ### *POST* /table/update
- ### *POST* /table/entries
- ### *POST* /entries/delete

### Usage
---
   - ### General
      ```sh
      git clone https://github.com/AbdulBaseetShabi/KARA
      ```
   - ### Client 
     ```sh
     cd Client
     npm start
     ```
   - ### Server 
     ```sh
     cd Server
     python index.py
     ```
