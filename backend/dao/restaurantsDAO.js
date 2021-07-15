// data access object to allow code to access restaurants in DB

import mongodb from "mongodb";

// these methods will be used by other files to access the DB
const ObjectId = mongodb.ObjectID; //
let restaurants; // used to store a reference to DB


export default class RestaurantsDAO {
    static async injectDB(conn) {   // how we initially connect to DB, called as soon as server starts
        if (restaurants) {          // to get a reference to restaurants DB
            return                  // "return" if reference already filled
        }
        try {                       // otherwise fill that variable with reference to that DB
                                    // trying to get collection "restaurants"
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants")
        } catch (e) {       // if unsuccessful send this message to console:
            console.error(
                `Unable to establish a collection handle in restaurantsDAO: ${e}`,
            )
        }
    }

    // call this method when we want list of all restaurants or subset in DB
    // it returns the array of restaurants for the specified query and page number and
    // page size, plus total number of restaurants for that query.
    static async getRestaurants({
        filters = null, // to sort list based on a filter
        page = 0,       // to specify a certain page number
        restaurantsPerPage = 20,  // default setting
        } = {}) {
        let query // for queries to MongoDB
        if (filters) {
            if ("name" in filters) {
                // do a search anywhere in this text for this name
                // this is different than subsequent searches that search based on
                // database fields;  we will set up this field in MongoDBAtlas and specify which fields
                // will be searched for a text search 
                query = { $text: { $search: filters["name"] } }
            } else if ("cuisine" in filters) {
                // if DB field "cuisine" equals the cuisine value that was passed in to method
                query = { "cuisine": { $eq: filters["cuisine"] } }
            } else if ("zipcode" in filters) {
                // if DB field "zipcode" value in MongoDB equals the zipcode value that was passed in
                query = { "address.zipcode": { $eq: filters["zipcode"] } }
            }
        }
    
        let cursor; // subset of restaurants that meet query conditions

        try {
            cursor = await restaurants.find(query) // find all restaurants in DB that meet this query
                                       // (if blank query, will return all restaurants) 
                
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`);
            return { restaurantsList: [], totalNumRestaurants: 0 } // return empty list and 0
                                                                    // restaurants if an error
        }
        // if no error, limit results to restaurantsPerPage value (vs all), and to get actual page number
        // we do a skip to get to that specific page number
        const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page);

        try {
            const restaurantsList = await displayCursor.toArray(); // set list to an array structure
            const totalNumRestaurants =  await restaurants.countDocuments(query); //return actual count
                                                                            // of restaurants from this query
              
            return { restaurantsList, totalNumRestaurants };

        } catch (e) {
            console.error(
                `Unable to convert cursor to array or problem counting documents, ${e}`
            )
            return { restaurantsList: [], totalNumRestaurants: 0 };
        }
    }

    // trying to get reviews from one collection and put into restaurant
    static async getRestaurantByID(id) {
        try {
            // create a "pipeline" to help match different collections together
            const pipeline = [
                {
                    $match: {       // trying to match id of a certain restaurant
                        _id: new ObjectId(id),
                    },
                },
                {   // then looking up other items (reviews) to add to result;
                    // part of mongodb aggregation pipeline
                    // aggregation pipeline is framework for data aggregation 
                    // modeled on concept of data processing pipelines:
                    // documents enter a multi-stage pipeline that transforms the 
                    // documents into aggregated results
                    $lookup: {
                        from: "reviews",
                        let: {
                            id: "$_id",
                        },
                        // from reviews collection, we are creating this pipeline 
                        // that is going to match the restaurant id and find all 
                        // reviews that match that restaurant id
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$restaurant_id", "$$id"],
                                    },
                                },
                            },
                            {
                                $sort: {
                                    date: -1,
                                },
                            },
                        ],
                        as: "reviews",  // set that pipeline to be "reviews" in the result
                    },
                },
                {
                    // we are adding this field, reviews, to the results
                    $addFields: {
                        reviews: "$reviews",
                    },
                },
            ]
            // aggregate the pipeline (collect everything together) and return it
            return await restaurants.aggregate(pipeline).next();
        } catch (e) {
            console.error(`Something went wrong in getRestaurantByID: ${e}`);
            throw e
        }
    }

    static async getCuisines() {
        let cuisines = [];
        try {
            cuisines = await restaurants.distinct("cuisine"); // get each cuisine one time
            return cuisines;
        } catch(e) {
            console.error(`Unable to get cuisines, ${e}`);
            return cuisines;
        }
    }
}