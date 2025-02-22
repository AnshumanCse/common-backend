const Joi = require("joi");

// Custom validation for word count
const maxWords = (value, helpers) => {
  const wordCount = value.split(/\s+/).length;
  if (wordCount > 3000) {
    return helpers.error("string.maxWords", { max: 3000 });
  }
  return value;
};
const Words = (value, helpers) => {
  const wordCount = value.split(/\s+/).length;
  if (wordCount > 5000) {
    return helpers.error("string.maxWords", { max: 5000 });
  }
  return value;
};

const validateDateFormat = (value, helpers) => {
  const datePattern = /^\d{2}-\d{2}-\d{4}$/;
  if (!datePattern.test(value)) {
    return helpers.message('Date should be in the format DD-MM-YYYY');
  }

  const [day, month, year] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day); // Month is zero-based in JavaScript

  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return helpers.message('Date is not a valid date');
  }

  return value; // Return the value as is, keeping it in DD-MM-YYYY format
};



const userValidation = Joi.object({
  fullName: Joi.string()
    .allow("")
    .pattern(/^[A-Za-z\s]*$/)
    .max(25)
    .messages({
      "string.base": "Full Name should be a type of text",
      "string.pattern.base":
        "Full Name should contain only alphabets and spaces",
      "string.max":
        "Full Name should have a maximum length of {#limit} characters",
    }),
  mobileNo: Joi.string()
    .allow("")
    .pattern(/^\d{10}$/)
    .messages({
      "string.base": "Mobile Number should be a type of text",
      "string.pattern.base": "Mobile Number must be exactly 10 digits",
    }),
  dob: Joi.string()
    .allow("")
    .pattern(/^[0-9\/-]*$/)
    .max(20)
    .messages({
      "string.base": "Date of Birth should be a valid date",
      "string.pattern.base": "Date of Birth must follow the allowed format",
      "string.max":
        "Date of Birth should have a maximum length of {#limit} characters",
    }),
  education: Joi.string()
    .allow("")
    .pattern(/^[A-Za-z\s]*$/)
    .max(20)
    .messages({
      "string.base": "Education should be a type of text",
      "string.pattern.base":
        "Education should contain only alphabets and spaces",
      "string.max":
        "Education should have a maximum length of {#limit} characters",
    }),
  occupation: Joi.string()
    .allow("")
    .pattern(/^[A-Za-z\s]*$/)
    .max(20)
    .messages({
      "string.base": "Occupation should be a type of text",
      "string.pattern.base":
        "Occupation should contain only alphabets and spaces",
      "string.max":
        "Occupation should have a maximum length of {#limit} characters",
    }),
  email: Joi.string()
    .allow("")
    .email()
    .pattern(new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"))
    .messages({
      "string.base": "Email should be a type of text",
      "string.email": "Email must be a valid email address",
      "string.pattern.base": "Email must be a valid email address",
    }),
  password: Joi.string()
    .allow("")
    .min(8)
    .max(30)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,30}$"
      )
    )
    .messages({
      "string.base": "Password should be a type of text",
      "string.min":
        "Password should have a minimum length of {#limit} characters",
      "string.max":
        "Password should have a maximum length of {#limit} characters",
      "string.pattern.base":
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
    }),
});

