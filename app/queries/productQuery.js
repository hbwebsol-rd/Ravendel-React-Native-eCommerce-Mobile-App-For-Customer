import { gql, useQuery } from '@apollo/client';

const GET_PRODUCTS = gql`
  query {
    products {
      data {
        _id
        name
        categoryId {
          id
          name
          __typename
        }
        rating
        url
        sku
        description
        quantity
        pricing
        feature_image
        gallery_image
        meta
        shipping
        taxClass
        status
        featured_product
        product_type
        custom_field
        attribute
        attribute_master {
          id
          name
          attribute_values
          createdAt
          updatedAt
        }
        date
        updated
        short_description
        __typename
      }
      message {
        success
        message
        __typename
      }
      __typename
    }
  }
`;

const GET_PRODUCT = gql`
  query ($url: String!) {
    productbyurl(url: $url) {
      data {
        _id
        breadcrumb
        attributes
        variations
        specifications {
          key
          value
          group
          attributeValueId
          attributeId
        }
        rating
        name
        url
        sku
        description
        quantity
        pricing
        feature_image
        brand {
          id
          name
        }
        gallery_image
        meta
        shipping
        taxClass
        status
        featured_product
        product_type
        custom_field
        date
        updated
        categoryId {
          id
          name
          __typename
        }
        short_description
        __typename
        ratingCount
        levelWiseRating
      }
      message {
        message
        success
        __typename
      }
      __typename
    }
  }
`;

const GET_CATEGORIES = gql`
  query {
    productCategories {
      data {
        id
        name
        parentId
        date
        url
        image
      }
    }
  }
`;

export const GET_FILTEREDPRODUCTS = gql`
  query ($filter: customObject) {
    filteredProducts(filter: $filter) {
      ...ProductTile
      __typename
    }
  }

  fragment ProductTile on Product {
    _id
    name
    url
    pricing
    quantity
    rating
    feature_image
    status
    brand {
      id
      name
      __typename
    }
    attribute_master {
      id
      name
      attribute_values
      createdAt
      updatedAt
    }
    categoryId {
      id
      name
      __typename
    }
    attribute

    shipping
    taxClass
    __typename
  }
`;

const GET_FILTEREDPRODUCTS_WITH_PAGINATION = gql`
  query GetCategoryPageData(
    $mainFilter: customObject
    $filters: customArray
    $sort: customObject
    $pageNo: Int
    $limit: Int
  ) {
    getCategoryPageData(
      mainFilter: $mainFilter
      filters: $filters
      pageNo: $pageNo
      limit: $limit
      sort: $sort
    ) {
      isMostParentCategory
      mostParentCategoryData
      categoryTree
      filterData
      productData
      message
      success
    }
  }
`;

const GET_SEARCH_PRODUCTS = gql`
  query SearchProducts($searchTerm: String!, $page: Int!, $limit: Int!) {
    searchProducts(searchTerm: $searchTerm, page: $page, limit: $limit) {
      count
      products {
        _id
        name
        categoryId {
          id
          name
          parentId
          attributeIds
          url
          description
          image
          thumbnail_image
          meta
          date
          updated
        }
        categoryTree
        brand {
          id
          name
          url
          brand_logo
          meta
          date
          updated
        }
        url
        sku
        short_description
        description
        quantity
        pricing
        feature_image
        gallery_image
        meta
        shipping
        taxClass
        status
        featured_product
        product_type
        custom_field
        specifications {
          key
          attributeId
          value
          attributeValueId
          group
        }
        attributes
        variations
        date
        rating
        ratingCount
        levelWiseRating
        breadcrumb
        updated
      }
    }
  }
`;

const GET_PRODUCT_REVIEWS = gql`
  query ($id: ID!) {
    productwisereview(productId: $id) {
      count
      reviews {
        review
        date
        rating
        status
        title
        customerId {
          firstName
          lastName
        }
      }
    }
  }
`;

const ADD_REVIEW = gql`
  mutation (
    $title: String
    $customer_id: String
    $product_id: String
    $email: String
    $review: String
    $rating: String
    $status: String
  ) {
    addReview(
      title: $title
      customerId: $customer_id
      productId: $product_id
      email: $email
      review: $review
      rating: $rating
      status: $status
    ) {
      message
      success
    }
  }
`;

const SALE_PRODUCT = gql`
  query {
    onSaleProducts {
      _id
      name
      feature_image
      pricing
      url
      categoryId {
        id
        name
      }
      quantity
      featured_product
      status
      variant
    }
  }
`;

const RECENT_PRODUCT = gql`
  query {
    recentproducts {
      _id
      name
      feature_image
      pricing
      url
      categoryId {
        id
        name
      }
      quantity
      featured_product
      status
      variant
    }
  }
`;

export const GET_RELATED_PRODUCTS_QUERY = gql`
  query ($category: customArray!, $productID: ID!) {
    relatedProducts(category: $category, productID: $productID) {
      _id
      name
      feature_image
      pricing
      rating
      url
      categoryId {
        id
        name
      }
      quantity
      featured_product
      status
      shipping
      taxClass
    }
  }
`;
export const GET_ADDITIONAL_PRODUCTS_QUERY = gql`
  query ($productId: ID!) {
    additionalDetails(productId: $productId)
  }
`;

const GET_ALL_FIELDS = gql`
  query GetHomePage($deviceType: ID!) {
    getHomePage(deviceType: $deviceType) {
      parentCategories {
        id
        name
        url
        image
      }
      sections {
        name
        section_img
        display_type
        products {
          _id
          name
          quantity
          rating
          pricing
          feature_image
          url
        }
      }
    }
  }
`;

const GET_BRANDS_QUERY = gql`
  query {
    brands {
      data {
        id
        name
        url
        brand_logo
        meta {
          title
          description
          keywords
        }
      }
    }
  }
`;

const PRODUCT_BY_A_CATEGORY = gql`
  query ($id: ID!) {
    productsbycatid(cat_id: $id) {
      _id
      name
      feature_image
      pricing
      url
      categoryId {
        id
        name
      }
      quantity
      featured_product
      status
      variant
    }
  }
`;
const FEATURE_CATEGORY = gql`
  query {
    featureproducts {
      _id
      name
      feature_image
      pricing
      url
      categoryId {
        id
        name
      }
      quantity
      featured_product
      status
      variant
    }
  }
`;

const ATTRIBUTE_TILE = gql`
  fragment AttributeTile on productAttribute {
    id
    name
    values
    date
    updated
  }
`;
export const GET_ATTRIBUTES = gql`
  {
    productAttributes {
      data {
        ...AttributeTile
      }
      message {
        message
        success
      }
    }
  }
  ${ATTRIBUTE_TILE}
`;

export {
  GET_PRODUCTS,
  GET_CATEGORIES,
  GET_PRODUCT,
  GET_PRODUCT_REVIEWS,
  ADD_REVIEW,
  SALE_PRODUCT,
  RECENT_PRODUCT,
  PRODUCT_BY_A_CATEGORY,
  FEATURE_CATEGORY,
  GET_BRANDS_QUERY,
  GET_ALL_FIELDS,
  GET_FILTEREDPRODUCTS_WITH_PAGINATION,
  GET_SEARCH_PRODUCTS,
};
