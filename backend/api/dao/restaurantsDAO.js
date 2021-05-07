// data access object to allow code to access restaurants in DB

let restaurants // used to store a reference to DB

export default class RestaurantDAO {
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
}