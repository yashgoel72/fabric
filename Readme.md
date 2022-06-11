# Hyperledger Fabric chaincode-fabstudent
## How to run the project?
1. Clone or download this repository to your local machine.
2. Open your terminal/command prompt from your project directory and run "cd fabstudent"
3. Run " ./startFabric.sh" to run the network and use couchDb to see the deployed network and see initial transaction
4. Next start by changing into the "javascript" directory:
    cd javascript
5. Next, install all required packages:
    npm install
6. Then run the following applications to enroll the admin user, and register a new user called appUser which will be used by the other applications to interact with the deployed Fabstudent contract:
7.  Run "node enrollAdmin.js"
    "node registerUser.js"
8. next run "node apiserver.js" to start the server on (http://localhost:8080)
9. Make the get request at (http://localhost:8080/api/getallstudents) to get all the students data from the blockchain
10. Make the get request at (http://localhost:8080/api/query/bydid/{student_did}) to get the student data based on "student_did"
11. Make a post request at (http://localhost:8080/api/addstudent/) to add a student into the blockchain based on student.json format
12. Make a post request at (http://localhost:8080/api/changemarks/) to change a student marks based on changemarks.json format
  

 
