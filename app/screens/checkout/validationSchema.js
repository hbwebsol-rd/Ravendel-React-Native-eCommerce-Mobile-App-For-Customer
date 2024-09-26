import * as yup from 'yup';

const phoneReg =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const pincodeReg = '^[0-9]{5,10}$';

export const validationSchema = yup.object().shape({
  firstname: yup.string().label('First Name').min(4).required(),
  lastname: yup.string().label('Last Name').min(2).required(),
  phone: yup
    .string()
    .matches(phoneReg, 'Phone number is not valid')
    .label('Phone number')
    .required(),
  // landmark: yup
  //   .string()
  //   .label('Landmark')
  //   .required(),
  address: yup.string().label('Address').required(),
  city: yup.string().label('City').required(),
  pincode: yup
    .string()
    .matches(pincodeReg, 'Pincode is not valid')
    .label('Pincode')
    .required(),
  country: yup.string().label('Country').required(),
  state: yup.string().label('State').required(),
});
export const signupValidationSchema = yup.object().shape({
  firstName: yup.string().label('First Name').min(4).required(),
  lastName: yup.string().label('Last Name').min(2).required(),
  email: yup.string().label('Email').email().required(),
  password: yup
    .string()
    .label('Password')
    .required()
    .min(2, 'Seems a bit short...')
    .max(10, 'We prefer insecure system, try a shorter password.'),
  confirmPassword: yup
    .string()
    .required()
    .label('Confirm password')
    .test('passwords-match', 'Passwords must match', function (value) {
      return this.parent.password === value;
    }),
  mobile: yup
    .string()
    .matches(phoneReg, 'Phone number is not valid')
    .label('Mobile No.')
    .required(),
  policy: yup
    .boolean()
    .oneOf([true], 'Please accept terms and policy')
    .required('Please accept terms and policy'),
});
export const editProfileValidationSchema = yup.object().shape({
  first_name: yup.string().label('First Name').min(4).required(),
  last_name: yup.string().label('Last Name').min(2).required(),
  email: yup.string().label('Email').email().required(),
  phone: yup
    .string()
    .matches(phoneReg, 'Phone number is not valid')
    .label('Phone No.')
    .required(),
});
export const loginValidationSchema = yup.object().shape({
  email: yup.string().label('Email').email().required(),
  password: yup.string().label('Password').required(),
  // .min(2, 'Seems a bit short...'),
});
export const reviewValidationSchema = yup.object().shape({
  title: yup.string().label('Title').required(),
  review: yup.string().label('Review').required(),
  rating: yup
    .number()
    .label('Rating')
    .min(1, 'Rating is required field')
    .required(),
});
