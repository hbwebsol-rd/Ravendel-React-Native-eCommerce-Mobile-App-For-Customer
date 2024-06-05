import gql from 'graphql-tag';

const ADD_CUSTOMER = gql`
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
const EDIT_CUSTOMER = gql`
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
const CHANGE_PASSWORD = gql`
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

export { ADD_CUSTOMER, EDIT_CUSTOMER, CHANGE_PASSWORD };
