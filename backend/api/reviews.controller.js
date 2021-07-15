import ReviewsDAO from "../dao/reviewsDAO.js";

export default class ReviewsController {
    
    static async apiPostReview(req, res, next) {
        try {
            const restaurantId = req.body.restaurantId;
            const review = req.body.text;
            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id
            };
            const date = new Date();

            const ReviewResponse = await ReviewsDAO.addReview(
                restaurantId,
                userInfo,
                review,
                date,
            );
            res.json({ status: "success" });  // return success method if it added to collection
        } catch (e) {
            res.status(500).json({ error: e.message });
            //console.error("reviews.controller.js post error: ",restaurantId, userInfo, review, date)
        }
    }

    static async apiUpdateReview(req, res, next) {
        try {
            const reviewId = req.body.review_id;
            const text = req.body.text;
            const date = new Date();

            const reviewResponse = await ReviewsDAO.updateReview(
                reviewId,
                req.body.user_id,
                text,
                date
            );

            var { error } = reviewResponse;
            if (error) {
                res.status(400).json({ error })
            }

            if (reviewResponse.modifiedCount === 0) { // review wasn't updated
                throw new Error(
                    "unable to update review - user may not be original poster",
                )
            }

            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiDeleteReview(req, res, next) {
        try {
            const reviewId = req.query.id; // different than other methods in that query parameter
                                            // is included directly in url
            const userId = req.body.user_id;  // this is non-standard for a delete request but in this
                                        // demo we are checking the user id in the body to see if it
                                        // matches that for the review; in production wouldn't have anything
                                        // in body of delete request
            console.log(reviewId);
            const reviewResponse = await ReviewsDAO.deleteReview(
                reviewId,
                userId,
            );
            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}