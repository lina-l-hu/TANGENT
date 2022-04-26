# TANGENT


<p>
**TANGENT** is a topic-based social app, created for my final project at the Concordia Web Dev Bootcamp. The experience is based around **Tangents**, which are conversation threads, and **Points** of interest, which are specific films or books. Friends are referred to as your **Circle**. (For those of you who like math, this naming was very intentional! 🤓) The motivation here is to encourage conversation amongst friends and friends of friends -- across the app, a user can only view Tangents in which at least one of their friends is a member. This is akin to, say, chatting at a party where there is at least one link to the host (or the friend who brought you along!), and this is natural way to get to know new friends (or even finding a new date 😉) through conversation about common interests! 

The front end is built with React V6, and the backend is constructed with Node.js / express, with data stored in MongoDB. 
</p>

<p align="middle">
<img width="150" alt="Tangent - full" src="https://user-images.githubusercontent.com/97921549/165363162-7c484991-3ba2-40ef-b955-7d70627c48b5.png">
<img width="288" alt="Tangent - text focus" src="https://user-images.githubusercontent.com/97921549/165365122-e902cb53-1f1a-4711-9c6a-004f467ad792.png">
</p>



**TANGENT**

Users can add regular text messages to a conversation, or a film or book Point, which displays a summary of the item. Searching for a Point is triggered by typing "#" in the textarea. The search function surveys both the Points already saved in the database, and the imdb, omdb and Google Books APIs. The top 3 book and film results from the APIs are displayed in a dropup after search, along with any existing Points that match by title in the database. 

<p align="middle">
<img width="293" alt="Tangent - Initiate Find Point" src="https://user-images.githubusercontent.com/97921549/165363420-49873231-54e4-41ba-9430-4a515d421212.png">
<img width="291" alt="Tangent - Find Point" src="https://user-images.githubusercontent.com/97921549/165364083-03599ca7-83fa-48bc-a366-c05d252987c7.png">
<img width="290" alt="Tangent - Select Point" src="https://user-images.githubusercontent.com/97921549/165364115-dc32f9e4-0af8-4eaa-95ee-f3f9c9b1a11d.png">
</p>

<p float="left">
A selected Point is added to the database with this same interface for a seamless user experience. 
<img width="292" alt="Tangent - Add Point" src="https://user-images.githubusercontent.com/97921549/165364124-fb6e495a-3262-4e88-9878-d0b235170f7c.png">
</p>


POINTS

A user can view all Points mentioned in a Tangent via a link at the top of each Tangent thread.
<img width="291" alt="Points in Tangent" src="https://user-images.githubusercontent.com/97921549/165364530-f0973fcf-a6d7-462f-a200-6fd6ccd94b31.png">

Clicking any Point will lead to a page with more details about that item, along with a link to imdb or Google Books for more information. As well, all the Tangents that mention the Point are listed as well. 
<img width="290" alt="Point Details" src="https://user-images.githubusercontent.com/97921549/165364676-aa240e87-7da5-4bf6-9815-ef60bbe4e6ac.png">


PROFILE

Users may bookmark a Point for reference later, and a user's list of bookmarked Points is found under the Points tab on the Profile page.
<img width="291" alt="Profile - Points Tab" src="https://user-images.githubusercontent.com/97921549/165365559-c5574975-2f90-4bf0-9056-975f4a425de0.png">

A list of the user's latest post in each Tangent they are a member of is shown via Tangents tab on the Profile page.
<img width="290" alt="Profile - Tangents Tab" src="https://user-images.githubusercontent.com/97921549/165366029-aa4b5161-6e0f-4f00-bbee-885703d95959.png">

If a user is not in your Circle, they will not see a detailed version of the Profile page.
<img width="291" alt="Profile - non-Circle " src="https://user-images.githubusercontent.com/97921549/165366669-282b4090-e30b-4645-9103-80393a3e3961.png">

Profile editing functionality will be included soon. 


CIRCLE

The user can view a list of friends in their Circle on this page, and also remove anyone from the Circle. 
<img width="292" alt="Circle" src="https://user-images.githubusercontent.com/97921549/165367987-7d88b090-c093-4a78-98a5-927464ef6d44.png">

Currently, users can add anyone to their Circle, but I will be adding friend request functionality in the next update. 


TANGENTS

The Tangents page lists the name and latest post of all the Tangents the current user's active chats. 
<img width="290" alt="My Tangents" src="https://user-images.githubusercontent.com/97921549/165367087-396a5242-8bce-4380-84cf-dfbb0582ec24.png">

A new Tangent may be added via a modal triggered by a link in the header. A name for the Tangent thread and a first text post is required. 
<img width="292" alt="Add Tangent Modal" src="https://user-images.githubusercontent.com/97921549/165365423-23d50089-d5fe-425e-8621-33ae74b5d920.png">


FEED

The Feed page displays 3 featured posts: 
1) The most popular Point in the user's Circle -- i.e. the most mentioned Point amongst all the Tangents in which the user and the user's friends are a part of;
2) The latest post of the most popular Tangent in the user's Circle -- i.e. the Tangent with the most posts amongst the user's Circle and the user;
3) The latest post of the most recently active Tangent in the user's Circle -- i.e. the Tangent in the user's Circle which the user is not a member of with a last post with the most recent timestamp.
 
<img width="291" alt="Home Feed" src="https://user-images.githubusercontent.com/97921549/165370845-a6a3e31c-6955-48d5-9f0a-820fc9e369cd.png">


SEARCH

Users may search for other users by name, and Points by title via the Search page. I will be adding additional search indices to the database soon to search by other fields, as well to search for Tangent conversation results.

<img width="292" alt="Search" src="https://user-images.githubusercontent.com/97921549/165368455-e8dda64e-6378-4f17-9585-fbdf5e65c672.png">


SIGN-IN / SIGN-UP

Currently sign-in is accomplished via retrieving a token from the backend with no encryption, but I will be updating this with a custom Auth0 UI. As well, I will be incorporating Cloudinary to add profile pictures to user accounts.

<img width="292" alt="Sign-in" src="https://user-images.githubusercontent.com/97921549/165371404-654f0cff-3105-4112-bbfc-45a2ac2cc0cc.png">
<img width="292" alt="Signup" src="https://user-images.githubusercontent.com/97921549/165371425-352d3641-20d7-48b6-a160-04be6e6c558f.png">


SOON . . .

Currently, Tangent conversations are not live chats -- I hope to add this functionality via socket.io. As well, the add friend/remove friend from Circle and add bookmarked Point/remove bookmarked Point functionality is not updating properly until the app is refreshed, and this will be addressed shortly. Follow to see future updates! 
