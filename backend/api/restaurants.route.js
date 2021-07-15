import express from "express";
import RestaurantsCtrl from "./restaurants.controller.js";
import ReviewsCtrl from "./reviews.controller.js";

const router = express.Router();
/*
router.route("/").get((req, res) => res.send("hello world"));  // test route
*/
router.route("/").get(RestaurantsCtrl.apiGetRestaurants);
router.route("/id/:id").get(RestaurantsCtrl.apiGetRestaurantById); // to get a specific restaurant by ID
router.route("/cuisines").get(RestaurantsCtrl.apiGetRestaurantCuisines); // to get a list of cuisines
                                                        // to create list of cuisines as drop-down
                                                        // menu on front end

router
    .route("/review")
    .post(ReviewsCtrl.apiPostReview)
    .put(ReviewsCtrl.apiUpdateReview)
    .delete(ReviewsCtrl.apiDeleteReview)

export default router;