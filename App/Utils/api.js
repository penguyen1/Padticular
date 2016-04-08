// var access_token = 'afb4dyafgux8f9xvr6ec9z9f1'  // stored in header?
const AirBnB = '3092nxybyb0otqw18e8nh5nty';


// AirBnB API - gets apartment info
function getApartmentInfo(id){
  var url = `https://api.airbnb.com/v2/listings/${id}?client_id=${AirBnB}&locale=en-US&currency=USD&_format=v1_legacy_for_p3`;
  
  var aptInfo = {}
  var categories = ['id','bedrooms','bathrooms','beds','lat','lng','person_capacity',
                    'picture_urls','property_type','address','price_formatted',
                    'smart_location','min_nights','map_image_url','summary'];

  console.log('AirBnB listing info URL: ', url)
  // return fetch(url).then(res => res.json());  

  // gets listing info from AirBnB API
  fetch(url)
    .then(res => res.json())        // converts response to JSON
    .then(data => console.log('WAHOOOOOOO: ', data))
    .catch(err => console.log('ERROR in Step 2!'))

}


var api = {

  // AirBnB API - gets list of apartments
  getApartments(params){
    var url = `https://api.airbnb.com/v2/search_results?client_id=${AirBnB}&locale=en-US&currency=USD&_format=for_search_results&_limit=50${params}`;
    var apartments = []     // array to be returned to Search Component

    // calls AirBnB API -- PART 1
    fetch(url)
      .then((res)=>res.json())       // converts response to JSON
      .then((data)=>{

        // iterates through each apartment
        data.search_results.forEach((apt)=>{
          var getInfo = `https://api.airbnb.com/v2/listings/${apt.listing.id}?client_id=${AirBnB}&locale=en-US&currency=USD&_format=v1_legacy_for_p3`;

          // calls AirBnB API -- PART 2
          fetch(getInfo)
            .then(res => res.json())
            .then(data => console.log('EUUUREKAAAA: ', data))
            .catch(err => console.log('ERROR in PHASE 2!'))

          // gets & pushes returned data from getApartmentInfo into an array
          // apartments.push(getApartmentInfo(apt.listing.id))
          // getApartmentInfo(apt.listing.id)
        })

      })
      // .then((resData)=>{
      //   apartments.push()
      // })
      .catch(err => console.log('ERROR in Step 1!'))

    console.log('apartments is: ', apartments.length)
    // console.log('How many pieces of the Masterpiece are there? ', apartments.length)
    // console.log('The Masterpiece: ', apartments)
    // return apartments
  },

  // AirBnB API - gets apartment info
  // getApartmentInfo(id){
  //   var url = `https://api.airbnb.com/v2/listings/${id}?client_id=${AirBnB}&locale=en-US&currency=USD&_format=v1_legacy_for_p3`;
    
  //   // var aptInfo = {}
  //   console.log('AirBnB listing info URL: ', url)
  //   console.log('--------------------------------------')
  //   // return fetch(url).then(res => res.json());  
  // },

  // Open NYC Data Crimes API - gets recent crimes around listing area (lat, lng)
  getCrimes(){}

};

module.exports = api;



//  ******* BONUS for version 2.0.0: *******

  // Google Places API - Text Search (name & address) nearest to placeID
  // var google_API = 'AIzaSyAX9CAIAZVOGgj_noHfmSEUVZPpBZQPSrY';
  // getLaundromats(){},
  // getSchools(){},
  // getMTA(){},
  // getRestuarants(){},
  // getGyms(){},
  // getParks(){}