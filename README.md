README
======
jqtran,cmpiette,asunderl,sxchen,hl65

Features
--------
*Simple and grid-like display for the NYC Cultural Events
*Space for Ads
*Left Side Navigation Bar for sorting by Category
*Hover over Posts for Description
*Click on Posts for link to Event
*A way to submit events that the administrator will have to approve
*An administrator version of the website to allow them to edit/post/remove events
*Sort By Function by pricing, post date, event dates
*Automatically show events that haven't already passed 

### Tools
*Stack: Node, Express, Javascript
*Dependencies: forever,moment,any-db,sqlite3,hogan,jade,calendar
*express.sessions for administrator
*Persona for logging in

### User Side
*Can sort by pricing, post date, event dates
*Clickable categories on the left side bar to see events by that category
*Clickable calendar to see what events occur on that date
*Submitting a post for the administrator to approve/reject
*Can search

### Admin Side
*Uses Persona to log in
*Separate admin version of the website
*Can edit/approve posts
*Can view your approved/unapproved/rejectedposts
*Can submit your own posts
