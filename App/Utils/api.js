// var access_token = 'afb4dyafgux8f9xvr6ec9z9f1'  // stored in header?
const AirBnB = '3092nxybyb0otqw18e8nh5nty';

var api = {

  // AirBnB API - gets list of apartments
  getListings(params){
    // console.log('COOL, got it: ', params)
    var url = `https://api.airbnb.com/v2/search_results?client_id=${AirBnB}&locale=en-US&currency=USD&_format=for_search_results&_limit=50${params}`;
    // console.log('AirBnB URL: ', url)
    return fetch(url).then((res)=>res.json())
  },

  // AirBnB API - gets apartment info
  // getListingInfo(id){
  //   const url = `https://api.airbnb.com/v2/listings/${id}?client_id=${AirBnB}&locale=en-US&currency=USD&_format=v1_legacy_for_p3`;
  //   // return fetch(url).then(res => res.json());  
  //   fetch(url).then({
  //       res => res.json()
  //       console.log('AirBnB - Listing Info: ', res.json())
  //   }); 
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