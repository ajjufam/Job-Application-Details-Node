1.  Sign UP
    url : api/v1/job/app/tracker/users/register POST
    req:{
    name:string
    email:string //unique
    password:string
    phoneNo:string
    role:enum
    reportingManager:id
    }
    res:{
    statusCode:201,
    message:created,
    data:...
    }

    Error
    {
    statusCode:409 //conflict
    message:'email alrady exist',
    "error": "Conflict"
    }

    {
    statusCode:500 //Internal server error
    message:'internal server error',
    error:"Internal Server Error"
    }

2.  login
    url: api/v1/job/app/tracker/users/login POST
    req:{
    email:strig,
    password:strig
    }

    res:{
    statusCode:200,
    message:'login Successfull',
    data:token
    }

    Error
    {
    "statusCode": 401,
    "message": "Invalid email or password",
    "error": "Unauthorized"
    }

    {
    statusCode:500 //Internal server error
    message:'internal server error',
    error:"Internal Server Error"
    }

3.  Update Password
    url : api/v1/job/app/tracker/users/update-password PUT/PATCH
    req:{
    email:string,
    oldPassword:string,
    newPassword:string,
    confirmPassword:string
    }

    res:{
    statusCode:200,
    message:'password updated successfully'
    data:...
    }

    Error
    {
    "statusCode": 401,
    "message": "Invalid email or password",
    "error": "Unauthorized"
    }

    {
    statusCode:409 //conflict
    message:'New password should not be same as old',
    "error": "Conflict"
    }

    {
    statusCode:500 //Internal server error
    message:'internal server error',
    error:"Internal Server Error"
    }

4.  Reset Password ////////
    url : project/reset-password PUT/PATCH
    req:{
    email:string,
    password:string,
    confirmPassword:string
    }

    res:{
    statusCode:200,
    message:'password reseted successfully'
    data:...
    }

    Error
    {
    "statusCode": 404,
    "message": "Email not found",
    "error": "NOT Found"
    }

    {
    statusCode:409 //conflict
    message:'New password should not be same as old',
    "error": "Conflict"
    }

    {
    statusCode:500 //Internal server error
    message:'internal server error',
    error:"Internal Server Error"
    }

5.  Update Role
    url: api/v1/job/app/tracker/users/update-role
    req:{
    email:string,
    role:string
    }

    Error
    {
    "statusCode": 404,
    "message": "Email Not Found",
    "error": "Not Found"
    }

    {
    statusCode:500 //Internal server error
    message:'internal server error',
    error:"Internal Server Error"
    }

6.  Update reportingManager
    url: api/v1/job/app/tracker/users/update-reporting-manager
    req:{
    email:string,
    reportingManager:string //id
    }

    Error
    {
    "statusCode": 404,
    "message": "Email Not Found",
    "error": "Not Found"
    }

    {
    "statusCode": 404,
    "message": "Reporting manager Id Not found or invalid",
    "error": "Not Found"
    }

    {
    statusCode:500 //Internal server error
    message:'internal server error',
    error:"Internal Server Error"
    }

7.  add Notification
    url:project/temp-notification POST
    req:{
    email:string,
    subject:string,
    msg:string,
    timeAnddate:date
    }

    res:{
    "statusCode": 201,
    "message": "Notification sent successfully",
    "data":...
    }

    Error
    {
    "statusCode": 404,
    "message": "Email Not Found",
    "error": "Not Found"
    }

    {
    statusCode:500 //Internal server error
    message:'internal server error',
    error:"Internal Server Error"
    }

8.  Apply job
    url:project/apply-job POST
    req:{
    "companyName":"string",
    "website":"string",
    "position":"String",
    "jobId":"string",
    "candiateId":"UserDB.\_ID",
    "address":{
    "country":"String",
    "state":"String"
    },
    "appliedDate":"Date", //current date and should not update
    "experienced":"boolean",  
     "currentCTC":"number", // if experienced true then required else null
    "expectedCTC":"number", // if experienced true then required else null
    "noticePeriod":"number", // if experienced true then required else null
    "lastWorkingDate":"Date", // if experienced true then required else null
    "daysRemains":"Number", //lastWorkingDate-currentDay
    "resume":"String"
    }

       <!-- "shortListed":"boolean",
       "interviewStatus":"enum", //[todo,inprogress,done] default todo // it can be change from todo if shortListed is true else todo only
       "offered":"boolean", // it can true after interviewStatus becomes done else it always false
       "offerLetter":"string", // required when offered is true
       "joiningDateIssued":"boolean", // it can true after offered becomes true else it always false
       "joiningDate":"Date", // required when joiningDateIssued is true
       "onBorded":"boolean", // if this got true then no more changes here -->

    res:{
    statusCode:201,
    message:'job applied succesfully',
    data:...
    }

    ERROR
    {
    statusCode:404,
    message:'Candidate not found for the given id',
    error:'not found'
    }

    {
    statusCode:404,
    message:'Job ID not found for the given id',
    error:'not found'
    }

    {
    statusCode:500,
    message:'Internal server error',
    error:'Internal server error'
    }

9.  update shortlisted status
    url:project/short-list-status PATCH/PUT
    req:{
    candidateId:'string',
    jobId:'string',
    shortListed:'boolean'
    }

    res:{
    statusCode:200,
    message:'short list status updated',
    data:...
    }

    ERROR
    {
    statusCode:404,
    message:'Candidate not found for the given id',
    error:'not found'
    }

    {
    statusCode:404,
    message:'Job ID not found for the given id',
    error:'not found'
    }

    {
    statusCode:500,
    message:'Internal server error',
    error:'Internal server error'
    }

10. Interview status
    update Interview status
    url:project/interview-status PATCH/PUT
    req:{
    candidateId:'string',
    jobId:'string',
    interviewStatus:'enum'
    }

    res:{
    statusCode:200,
    message:'interview-status updated',
    data:...
    }

    ERROR
    {
    statusCode:404,
    message:'Candidate not found for the given id',
    error:'not found'
    }

    {
    statusCode:404,
    message:'Job ID not found for the given id',
    error:'not found'
    }

    {
    statusCode:500,
    message:'Internal server error',
    error:'Internal server error'
    }

11. Offered status
    url:project/offered-status //PATCH/PUT
    req:{
    candidateId:'string',
    jobId:'string',
    offered:'boolean',
    offerLetter:'string' // required if offered is true
    }

    res:{
    statusCode:200,
    message:'offered status updated'
    data:...
    }

    ERROR
    {
    statusCode:404,
    message:'Candidate not found for the given id',
    error:'not found'
    }

    {
    statusCode:404,
    message:'Job ID not found for the given id',
    error:'not found'
    }

    {
    statusCode:500,
    message:'Internal server error',
    error:'Internal server error'
    }

12. Joining status
    url:project/joining-status // Patch/put
    req:{
    candidateId:'string',
    jobId:'string',
    joiningDateIssued:'boolean',
    joiningDate:'Date' // required if joiningDateIssued is true
    }

    res:{
    statusCode:200,
    message:'joining-status updated',
    data:...
    }

    ERROR
    {
    statusCode:404,
    message:'Candidate not found for the given id',
    error:'not found'
    }

    {
    statusCode:404,
    message:'Job ID not found for the given id',
    error:'not found'
    }

    {
    statusCode:500,
    message:'Internal server error',
    error:'Internal server error'
    }

13. onboard status
    url:project/onboard-status
    req:{
    candidateId:'string',
    jobId:'string',
    onBorded:'boolean' // once it became true i need to stop updating this db
    }

    res:{
    statusCode:200,
    message:'onboard status updated',
    data:...
    }

    ERROR
    {
    statusCode:404,
    message:'Candidate not found for the given id',
    error:'not found'
    }

    {
    statusCode:404,
    message:'Job ID not found for the given id',
    error:'not found'
    }

    {
    statusCode:500,
    message:'Internal server error',
    error:'Internal server error'
    }

14. schedule interview
    url:project/schedule-interview //POST
    req:{
    candidateId:'string',
    jobId:'string',
    interviewerId:'string',
    roundNumber:'enum', //make sure roundNumber should not be repeat [1,2,3,4]
    }

    res:{
    statusCode:201,
    message:'interview scheduled',
    data:...
    }

    ERROR
    {
    statusCode:404,
    message:'Candidate not found for the given id',
    error:'not found'
    }

    {
    statusCode:404,
    message:'Job ID not found for the given id',
    error:'not found'
    }
    {
    statusCode:404,
    message:'interviewerId not found for the given id',
    error:'not found'
    }

    {
    statusCode:500,
    message:'Internal server error',
    error:'Internal server error'
    }

15. update interview result status
    url:project/interview-result //PATCH/PUT
    req:{
    candidateId:'string',
    jobId:'string',
    roundNumber:'number',
    status:'boolean',
    remarks:'string' //required
    }

    res:{
    statusCode:200,
    message:'interview overall status updated',
    data:...
    }

    ERROR
    {
    statusCode:404,
    message:'Candidate not found for the given id',
    error:'not found'
    }

    {
    statusCode:404,
    message:'Job ID not found for the given id',
    error:'not found'
    }

    {
    statusCode:404,
    message:'roundNumber not found for the given id',
    error:'not found'
    }

    {
    statusCode:500,
    message:'Internal server error',
    error:'Internal server error'
    }

16. notification handle
    req:{
    candidateId:'string',
    jobId:'string',
    notification:'string'
    }

    res:{
    statusCode:200,
    message:'notication triggered',
    data:...
    }

    ERROR
    {
    statusCode:404,
    message:'Candidate not found for the given id',
    error:'not found'
    }

    {
    statusCode:404,
    message:'Job ID not found for the given id',
    error:'not found'
    }

    {
    statusCode:500,
    message:'Internal server error',
    error:'Internal server error'
    }
