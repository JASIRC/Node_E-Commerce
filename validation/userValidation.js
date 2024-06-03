import Joi from "joi";

const userjoi=Joi.object({
    username:Joi.string(),
    email:Joi.string().email(),
    password:Joi.string()
});
export default userjoi;