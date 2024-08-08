import gql from 'graphql-tag';

export const ADD_CUSTOMER = gql`
  mutation (
    $firstName: String
    $lastName: String
    $email: String
    $company: String
    $phone: String
    $password: String
  ) {
    addCustomer(
      firstName: $firstName
      lastName: $lastName
      email: $email
      company: $company
      phone: $phone
      password: $password
    ) {
      message
      success
    }
  }
`;
export const EDIT_CUSTOMER = gql`
  mutation (
    $id: ID!
    $first_name: String
    $last_name: String
    $email: String
    $phone: String
    $gender: String
  ) {
    updateCustomer(
      id: $id
      firstName: $first_name
      lastName: $last_name
      email: $email
      phone: $phone
      gender: $gender
    ) {
      message
      success
    }
  }
`;
export const CHANGE_PASSWORD = gql`
  mutation ($id: ID!, $oldPassword: String, $newPassword: String) {
    updateCustomerPassword(
      id: $id
      oldPassword: $oldPassword
      newPassword: $newPassword
    ) {
      message
      success
    }
  }
`;

export const SAVE_DEVICE_ID = gql`
 mutation UpdateCustomerDeviceInfo($deviceInfo: DEVICE_INFO_INPUT) {
  updateCustomerDeviceInfo(device_info: $deviceInfo) {
    message
    success
  }
}
`;

export const FORGOT_PASSWORD = gql`
  mutation ($email: String) {
    sendForgetPasswordEmail(email: $email) {
      message
      success
    }
  }
`;

