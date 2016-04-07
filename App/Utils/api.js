const api = {
  // const google_API = 'AIzaSyAX9CAIAZVOGgj_noHfmSEUVZPpBZQPSrY';
  const AirBnB = '3092nxybyb0otqw18e8nh5nty';
  // access_token = 'afb4dyafgux8f9xvr6ec9z9f1' to be stored in header?

  // AirBnB API - gets list of apartments
  getListings(params){
    const url = `https://api.airbnb.com/v2/search_results?client_id=${AirBnB}&locale=en-US&currency=USD&_format=for_search_results&_limit=50${params}`;
    // return fetch(url).then(res => res.json());  
    fetch(url).then({
        res => res.json()
        console.log('AirBnB - Search Listings: ', res.json())
    });
  },

  // AirBnB API - gets apartment info
  getListingInfo(id){
    const url = `https://api.airbnb.com/v2/listings/${id}?client_id=${AirBnB}&locale=en-US&currency=USD&_format=v1_legacy_for_p3`;
    // return fetch(url).then(res => res.json());  
    fetch(url).then({
        res => res.json()
        console.log('AirBnB - Listing Info: ', res.json())
    }); 
  },

  // Open NYC Data Crimes API - gets recent crimes around listing area
  getCrimes(){}




  // Google Places API - Text Search (name & address) nearest to placeID
  // getLaundromats(){},
  // getSchools(){},
  // getMTA(){},
  // getRestuarants(){},
  // getGyms(){},
  // getParks(){}
};

module.exports = api;