import gql from 'graphql-tag';

const GET_CUSTOMER = gql`
  query ($id: ID!) {
    customer(id: $id) {
      data {
        id
        firstName
        lastName
        email
        company
        phone
        addressBook
      }
    }
  }
`;

const ADD_ADDRESSBOOK = gql`
  mutation (
    $id: ID!
    $firstName: String
    $lastName: String
    $company: String
    $phone: String
    $addressLine1: String
    $addressLine2: String
    $city: String
    $country: String
    $state: String
    $pincode: String
    $defaultAddress: Boolean
  ) {
    addAddressBook(
      id: $id
      firstName: $firstName
      lastName: $lastName
      company: $company
      phone: $phone
      addressLine1: $addressLine1
      addressLine2: $addressLine2
      city: $city
      country: $country
      state: $state
      pincode: $pincode
      defaultAddress: $defaultAddress
    ) {
      message
      success
    }
  }
`;

const UPDATE_ADDRESSBOOK = gql`
  mutation (
    $id: ID!
    $_id: ID!
    $firstName: String
    $lastName: String
    $company: String
    $phone: String
    $addressLine1: String
    $addressLine2: String
    $city: String
    $country: String
    $state: String
    $pincode: String
    $defaultAddress: Boolean
  ) {
    updateAddressBook(
      id: $id
      _id: $_id
      firstName: $firstName
      lastName: $lastName
      company: $company
      phone: $phone
      addressLine1: $addressLine1
      addressLine2: $addressLine2
      city: $city
      country: $country
      state: $state
      pincode: $pincode
      defaultAddress: $defaultAddress
    ) {
      message
      success
    }
  }
`;

const DELETE_ADDRESSBOOK = gql`
  mutation ($id: ID!, $_id: ID!) {
    deleteAddressBook(id: $id, _id: $_id) {
      message
      success
    }
  }
`;

const DELETE_CUSTOMER = gql`
  mutation DeleteUser($deleteCustomerId: ID!) {
    deleteCustomer(id: $deleteCustomerId) {
      message
      success
    }
  }
`;

export {
  GET_CUSTOMER,
  ADD_ADDRESSBOOK,
  UPDATE_ADDRESSBOOK,
  DELETE_ADDRESSBOOK,
  DELETE_CUSTOMER,
};
