# Project #4: Padticular
###### GA-NYC-Bowie Final Project

#### Mission Statement:
Experience the ease of discovering beautiful rental apartments throughout NYC with just the swipe of a finger! 

---
#### Introduction:
Finding ravishingly stunning apartment rentals in NYC has never been so easy! Padticular is a React Native mobile application that provides a simplistic and interactive user experience in booking the ideal rental apartment in New York City. It answers (almost) all the major concerning questions that play a contributing role in the quest of finding that perfect **_Padticular_** apartment, such as -- _Is it affordable?_ Is it spacious? _Is it safe?_ What are the nearest trains and buses to me? _Where can I go to get some good grub around here?_ ~~locating the nearest laundromat, MTA transportation, schools, `fitness gyms, resturants, parks` and displaying **recent crimes in the area**~~

---
#### Technologies Used:
* Facebook React Native
* JavaScript
* Firebase 
* NodeJS
* PG-Promise
* React Bootstrap 
* React Semantic-UI
* AirBnB API
* NYC Open Data API
* ~~Google Places API~~

---
#### Installation Instructions (To be Added):

---
### User Story & Components (v1.0.0):

###### Authentication ( Signup & Login )
* When app is loaded, it will check if a token already exists
    * **Token exists** - redirect to Homepage
    * **Token does not exist** - redirect to Signup
* Guest will be prompted to sign up or login before granted access to application
    * **Denied** access until guest inputs the correct and|or valid information
    * **Granted** access will redirect guest (user) to Homepage

###### Nav | Menu bar
* **Home** - redirect to Homepage
* **Find me a home** - redirect to Search Component
* **Log Out**
    * destroy user token
    * redirect to Sign Up Component

###### Homepage
* **Nav | Menu bar**
* Greets user with "Hello, {firstname}!"
* Display list of saved favorite apartments. Each list item will show:
    * Address + Unit Number _(if available)_
    * Neighborhood
    * Property type
    * Price
    * View button (tap function?) - redirect to Profile
    * Delete button - delete from user's favorites list

###### Search Page
* **Nav | Menu bar**
* Display Search form with search filter features:
    * Select desired neighborhoods _(checkbox?)_
    * Affordable price range 
    * Desired number of bedrooms 
    * Desired number of bathrooms 
    * Select property type _(checkbox?)_
    * Search button
        * calls AirBnB API & converts response into JSON
        * redirect to YesOrNo Page

###### YesOrNo Page
* Display returned API response - **one at a time!**
* Toggles between views when user taps on the listing page
* **Front View:**
    * Images (user swipes left | right)
    * Address + unit number _(if available)_
    * Property Type | Neighborhood
    * Bedrooms | Bathrooms
    * Price
* **Back View:**
    * Recent Crimes ( most recent first )
    * ~~MTA Transportation:~~
        * ~~Trains _(logo images?)_~~
        * ~~Buses _(logo images?)_~~
    * ~~Schools:~~
        * ~~Elementary~~
        * ~~Middle School~~
        * ~~High School~~
    * ~~Laundromat~~
    * ~~Parks~~
* **User can swipe:**
    * **Left** - if they're not interested
        * Render next listing in response
    * **Right** - if they want to save & look back on the listing later
        * Save listing to favorites table
        * Render next listing in response
    * **Up | Down** - if they want to discontinue search
        * Redirect to Homepage Component

###### Profile Page
* **Nav | Menu bar**
* Display all information about the listing
    * Images (user swipes left | right)
    * Price
    * Address + unit number _(if available)_ + city + state + zipcode
    * Property Type | Neighborhood
    * Sqft Size | Bedrooms | Bathrooms
    * Crimes (most recent 5)
    * Listing Description
    * Apply button - listing URL_link
    * ~~MTA Transportation:~~
        * ~~Trains _(logo images?)_~~
        * ~~Buses _(logo images?)_~~
    * ~~Schools:~~
        * ~~Elementary~~
        * ~~Middle School~~
        * ~~High School~~
    * ~~Laundromat~~
    * ~~Parks~~
    * ~~Gyms~~
    * ~~Resturants (top 3 most reviewed)~~
    * ~~Bars (top 3 most reviewed)~~

---
###### Database Entity Relationship Diagram (ERD) v1.0.0
#![](./images/ERD.png)

###### Signup | Login Wireframe
#![](./images/authentication.png)

###### Homepage Wireframe
#![](./images/homepage.png)

###### Search Page Wireframe
#![](./images/search.png)

###### YesOrNo Page Wireframe
#![](./images/YesOrNo.png)

###### Profile Page Wireframe
#![](./images/profile.png)

---
###### AirBnB Routes
| What does it do? | API Route | Required URL Parameters |
|:---:|:---:|:---:|
| Searches rental listings in an area | `https://api.airbnb.com/v2/search_results?client_id=[API_KEY]&[params]` | API key + optional query parameters |
| Gets rental listing info | `https://api.airbnb.com/v2/search_results?client_id=[API_KEY]&[params]` | API key + result format |
| URL link to rental listing  | `https://www.airbnb.com/rooms/[id#]` | Listing ID number |

---
###### Firebase Routes
| What does it do? | URL Route | Query Event | Required Parameters |
|:---:|:---:|:---:|:---:|
| Create & verify new User | `https://dazzling-inferno-3629.firebaseio.com/` | userRef.createUser + users.child( uid ).set | unique email address |
| Authenticate User Login | `https://dazzling-inferno-3629.firebaseio.com/users` | userRef.authWithPassword | correct email + password |
| Get User's favorited apt listings | `https://dazzling-inferno-3629.firebaseio.com/favs` | aptRef.on( "value" ) | user uid |
| Add apt listing to User's favorites | `https://dazzling-inferno-3629.firebaseio.com/favs` | aptRef.on( "child_added" ) | user uid + apt id | 
| Delete apt listing from User's favorites | `https://dazzling-inferno-3629.firebaseio.com/favs` | aptRef.on("child_removed") | user uid + apt id |
| Add image(s) to an apt listing | `https://dazzling-inferno-3629.firebaseio.com/images` | imgRef.on( "child_added" ) | apt id | 
| Add crime(s) to an apt listing | `https://dazzling-inferno-3629.firebaseio.com/crimes` | crimeRef.on("child_added") |apt id |

---
###### NYC Open Data Routes
| What does it do? | API Route | Required Parameters |
|:---:|:---:|:---:|
| Gets recent crimes in an area | ? | ? |

---
# Bonus Features: ( to be added - v2.0.0 )
* ##### In Nav|Menu Bar: Invite a Friend 
    * Users can invite friends by submitting their:
        * Full Name
        * Email Address
        * Phone Number
    * Friends will receive a text message ( via Twilio API ) to join this awesome app

* ##### Additional Firebase Routes
| What does it do? | URL Route | Query Event | Required Parameters |
|:---:|:---:|:---:|:---:|
| Add schools to an apt listing | `https://dazzling-inferno-3629.firebaseio.com/schools` | schoolRef.on( "child_added") | apt id | 
| Add MTA transportation to an apt listing | `https://dazzling-inferno-3629.firebaseio.com/mta` | mtaRef.on("child_added") | apt id |
| Add resturants to an apt listing | `https://dazzling-inferno-3629.firebaseio.com/rests` | restRef.on( "child_added" ) | apt id | 
| Add fitness gyms to an apt listing | `https://dazzling-inferno-3629.firebaseio.com/gyms` | gymRef.on("child_added") | apt id |
| Add laundromat to an apt listing | `https://dazzling-inferno-3629.firebaseio.com/laundry` | laundryRef.on("child_added") | apt id |

* ##### Google Places Routes
| What does it do? | API Route | Required Parameters |
|:---:|:---:|:---:|
| Gets list of specified establishments near an apt | ? | API key + apt latitude & longitude |
| Gets establishment info  | ? | API key + place id |

