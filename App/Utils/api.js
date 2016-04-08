// var access_token = 'afb4dyafgux8f9xvr6ec9z9f1'  // stored in header?
const AirBnB = '3092nxybyb0otqw18e8nh5nty';


var api = {

  // AirBnB API - gets list of apartments
  getApartments(params){
    var url = `https://api.airbnb.com/v2/search_results?client_id=${AirBnB}&locale=en-US&currency=USD&_format=for_search_results&_limit=5${params}`;
    
    // calls AirBnB API
    return fetch(url)
      .then((res)=>res.json())       // converts & returns response in JSON
      .catch(err => console.log('ERROR in getting Apartments!'))  
  },

  getApartmentInfo(id){
    var url = `https://api.airbnb.com/v2/listings/${id}?client_id=${AirBnB}&locale=en-US&currency=USD&_format=v1_legacy_for_p3`;
    // var aptInfo = {}
    // var categories = ['id','bedrooms','bathrooms','beds','lat','lng','person_capacity',
    //                   'picture_urls','property_type','address','price_formatted',
    //                   'smart_location','min_nights','map_image_url','summary'];

    // gets listing info from AirBnB API
    return fetch(url)
      .then((res)=>res.json())       // converts & returns response in JSON
      .catch(err => console.log('ERROR in getting Apartment INFO!'))  

    // return fetch(url)
    //   .then(res => res.json())        // converts response to JSON
    //   .then(data => {
    //     categories.forEach((el)=>{
    //       aptInfo[el] = data.listing[el]
    //     })
    //     console.log('aptInfo', aptInfo)
    //     // return aptInfo
    //   })
    //   .catch(err => console.log('ERROR in Step 2!'))
  },

  // Open NYC Data Crimes API - gets recent crimes around listing area (lat, lng)
  // getCrimes(){}

};

module.exports = api;


        // return data.search_results.map((el)=>{
        //   apartments.push(el.listing.id)
        // })
        // console.log('apartments?? ', apartments)



// .then((data)=>{
    
//         // iterates through each apartment
//         data.search_results.forEach((apt)=>{
//           var getInfo = `https://api.airbnb.com/v2/listings/${apt.listing.id}?client_id=${AirBnB}&locale=en-US&currency=USD&_format=v1_legacy_for_p3`;
//           var aptInfo = {}      // empty object 

//           // calls AirBnB API -- PART 2
//           fetch(getInfo)
//             .then(res => res.json())
//             .then(data => {
//               // Object.keys(data.listing).map((key)=>{})

//               for(var x in categories){
//                 var i = categories[x]
//                 aptInfo[i] = data.listing[i]
//               }
//               // apartments.push(aptInfo)
//               console.log('aptInfo is --- ', aptInfo)
//             })
//             // .then(resData => console.log('resData: ', resData))
//             .catch(err => console.log('ERROR in PHASE 2!'))
//         })
        
//       })

// for(var x in categories){
//   var i = categories[x]
//   info[i] = listing[i]
// }

// //  ******* BONUS for version 2.0.0: *******

  // Google Places API - Text Search (name & address) nearest to placeID
  // var google_API = 'AIzaSyAX9CAIAZVOGgj_noHfmSEUVZPpBZQPSrY';
  // getLaundromats(){},
  // getSchools(){},
  // getMTA(){},
  // getRestuarants(){},
  // getGyms(){},
  // getParks(){}