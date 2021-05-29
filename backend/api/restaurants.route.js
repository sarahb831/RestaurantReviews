import express from "express";
import RestaurantsCtrl from "./restaurants.controller.js";
import ReviewsCtrl from "./reviews.controller.js";

const router = express.Router();
/*
router.route("/").get((req, res) => res.send("hello world"));  // test route
*/
router.route("/").get(RestaurantsCtrl.apiGetRestaurants);

router
    .route("/review)"
    .post(ReviewCtrl.apiPostReview)
    .put(ReviewsCtrl.apiUpdateReview)
    .delete(ReviewCtrl.apiDeleteReview);

export default router;