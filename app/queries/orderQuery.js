import gql from 'graphql-tag';

const ADD_TOCART = gql`
  mutation (
    $userId: ID!
    $productId: String
    $productTitle: String
    $productPrice: String
    $productImage: String
    $total: Float
    $qty: Int
    $attributes: customArray
    $variantId: String
    $productQuantity: Int
  ) {
    addToCart(
      total: $total
      userId: $userId
      productId: $productId
      productTitle: $productTitle
      productPrice: $productPrice
      productImage: $productImage
      qty: $qty
      attributes: $attributes
      productQuantity: $productQuantity
      variantId: $variantId
    ) {
      message
      success
    }
  }
`;
const ADD_CART = gql`
  mutation ($userId: ID, $products: [cartProduct]) {
    addCart(userId: $userId, products: $products) {
      message
      success
    }
  }
`;

const UPDATE_ORDER = gql`
  mutation (
    $id: ID!
    $billing: customObject
    $shipping: customObject
    $status: String
  ) {
    updateOrder(
      id: $id
      billing: $billing
      shipping: $shipping
      status: $status
    ) {
      id
      user_id
      status
      shipping
      billing
      products
      date
      updated
    }
  }
`;
const DELETE_CART_PRODUCT = gql`
  mutation DeleteCartProduct($userId: ID!, $productId: ID!) {
    deleteCartProduct(userId: $userId, productId: $productId) {
      message
      success
    }
  }
`;

const DELETE_CART = gql`
  mutation DeleteCart($userId: ID!) {
    deleteCart(userId: $userId) {
      success
      message
    }
  }
`;

const GET_CART = gql`
  query ($id: ID!) {
    cartbyUser(userId: $id) {
      id
      userId
      status
      total
      cartItem
      availableItem
      unavailableItem
      date

      updated
    }
  }
`;

const CALCULATE_CART = gql`
  query ($id: ID!) {
    calculateCart(userId: $id) {
      id
      userId
      status
      cartItems
      date
      totalSummary
    }
  }
`;

const CALCULATE_CART_WITHOUT_LOGIN = gql`
  query ($cartItems: [calculateCartProducts]) {
    calculateCart(cartItems: $cartItems) {
      id
      userId
      status
      cartItems
      date
      totalSummary
    }
  }
`;

const UPDATE_CART = gql`
  mutation ($id: ID!, $products: [cartProduct]) {
    updateCart(id: $id, products: $products) {
      message
      success
    }
  }
`;

const CHANGE_QTY = gql`
  mutation ChangeQty($userId: ID!, $productId: ID!, $qty: Int!) {
    changeQty(userId: $userId, productId: $productId, qty: $qty) {
      success
      message
    }
  }
`;

// const APPLY_COUPON = gql`
//   query ($coupon_code: String, $cart: [cartProducts]) {
//     calculateCoupon(coupon_code: $coupon_code, cart: $cart) {
//       total_coupon
//       message
//     }
//   }
// `;

const APPLY_COUPON_CODE = gql`
  query (
    $userId: ID
    $cartItems: [calculateCartProducts]
    $couponCode: String!
  ) {
    calculateCoupon(
      couponCode: $couponCode
      cartItems: $cartItems
      userId: $userId
    ) {
      message
      success
      id
      userId
      status
      cartItems
      date
      totalSummary
      couponCard
      updated
    }
  }
`;

const ORDER_HISTORY = gql`
  query ($id: ID!) {
    orderbyUser(userId: $id) {
      data {
        id
        orderNumber
        userId
        paymentStatus
        shippingStatus
        shipping
        billing
        products
        couponCard
        totalSummary
        date
        updated
      }
      message {
        message
        success
      }
    }
  }
`;

const CHECK_ZIPCODE = gql`
  query ($zipcode: String!) {
    checkZipcode(zipcode: $zipcode) {
      message
      success
    }
  }
`;

const ADD_ORDER = gql`
  mutation ($userId: ID, $billing: customObject, $shipping: customObject) {
    addOrder(userId: $userId, shipping: $shipping, billing: $billing) {
      message
      success
      redirectUrl
      paypalOrderId
      razorpayOrderId
    }
  }
`;

export const UPDATE_PAYMENT_STATUS = gql`
  mutation ($id: ID!, $paymentStatus: String!) {
    updatePaymentStatus(id: $id, paymentStatus: $paymentStatus) {
      message
      success
    }
  }
`;
export {
  ADD_TOCART,
  ADD_CART,
  DELETE_CART,
  UPDATE_ORDER,
  DELETE_CART_PRODUCT,
  GET_CART,
  UPDATE_CART,
  APPLY_COUPON_CODE,
  ORDER_HISTORY,
  ADD_ORDER,
  CALCULATE_CART,
  CALCULATE_CART_WITHOUT_LOGIN,
  CHANGE_QTY,
  CHECK_ZIPCODE,
};
