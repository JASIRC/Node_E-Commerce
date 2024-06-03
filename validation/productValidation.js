import Joi from 'joi';

const productjoi=Joi.object({
    title:Joi.string(),
    description:Joi.string(),
    price:Joi.number(),
    category:Joi.string()
})

export default productjoi;