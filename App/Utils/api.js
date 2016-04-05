const api = {
  const AirBnB = '3092nxybyb0otqw18e8nh5nty';
  // access_token = 'afb4dyafgux8f9xvr6ec9z9f1' to be stored in header?

  // AirBnB API
  getListings(params){
    const url = `https://api.airbnb.com/v2/search_results?client_id=${AirBnB}&locale=en-US&currency=USD&_format=for_search_results_with_minimal_pricing&_offset=0&${params}`;
    // return fetch(url).then(res => res.json());  
    fetch(url).then({
        res => res.json()
        console.log('AirBnB - Search Listings: ', res.json())
    });
  },

  getListingInfo(id){
    const url = `https://api.airbnb.com/v2/listings/${id}?client_id=${AirBnB}&locale=en-US&currency=USD&_format=v1_legacy_for_p3`;
    // return fetch(url).then(res => res.json());  
    fetch(url).then({
        res => res.json()
        console.log('AirBnB - Listing Info: ', res.json())
    }); 
  },

  // Google Places - Text Search around area (placeID)
  getLaundromats(){},
  getSchools(){},
  getMTA(){},
  getRestuarants(){},
  getGyms(){},
  getParks(){},

  // Open NYC Data Crimes around listing area
  getCrimes(){}
};

module.exports = api;


// const streeteasy = {
//   const zillow_API = 'X1-ZWz1f7axiu73t7_10irx';
//   const google_API = 'AIzaSyAX9CAIAZVOGgj_noHfmSEUVZPpBZQPSrY';
//   const easy_API = '083e15a0075183da09fd113c234364f5701b8398';
//   const base_url = 'http://streeteasy.com/nyc/api/rentals/search?criteria=[area:flatiron&limit:10&order:price_asc]&key=${StEasy_API}&format=json'
// }