import RestaurantsDAO from "../dao/restaurantsDAO.js";

export default class RestaurantsController {
    static async apiGetRestaurants(req, res, next) { // called through URL which can have query 
                                            // string to specify parameters ("?" with key-value pairs
                                            // to pass in to this api)
        const restaurantsPerPage = req.query.restaurantsPerPage ? parseInt(req.query.restaurantsPerPage, 10) : 20;
        const page = req.query.page ? parseInt(req.query.page, 10) : 0; // radix 10; remember it's not the default!

        let filters = {};
        if (req.query.cuisine) {
            filters.cuisine = req.query.cuisine;
        } else if (req.query.zipcode) {
            filters.zipcode = req.query.zipcode;
        } else if (req.query.name) {
            filters.name = req.query.name;
        }

        const { restaurantsList, totalNumRestaurants } = await RestaurantsDAO.getRestaurants({
            filters,
            page, 
            restaurantsPerPage
        })

        // create a response to send when this api URL is called
        let response = {
            restaurants: restaurantsList,
            page: page,
            filters: filters,
            entries_per_page: restaurantsPerPage,
            total_results: totalNumRestaurants
        };
        // convert to json format
        res.json(response);
    }
}