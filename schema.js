const joi = require("joi");

module.exports.listingSchema = joi.object({
    listing: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        location: joi.string().required(),
        country: joi.string().required(),
        image: joi.object({
      url: joi.string().allow('', null)
    }),
        price: joi.number().required().min(0),
    }).required(),
});

module.exports.reviewSchema = joi.object({
    reviews :joi.object({
        rating: joi.number().required().min(1).max(5),
        comment: joi.string().required(),
    }).required(),
});