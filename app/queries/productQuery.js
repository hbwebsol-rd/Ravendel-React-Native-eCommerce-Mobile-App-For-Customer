import { gql, useQuery } from '@apollo/client';

export const GET_PRODUCTS = gql`
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

export const GET_PRODUCT = gql`
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

export const GET_CATEGORIES = gql`
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


export const GET_FILTEREDPRODUCTS_WITH_PAGINATION = gql`
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

export const GET_SEARCH_PRODUCTS = gql`
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

export const GET_PRODUCT_REVIEWS = gql`
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

export const ADD_REVIEW = gql`
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

export const SALE_PRODUCT = gql`
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

export const RECENT_PRODUCT = gql`
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
export const GET_CARTADDITIONAL_PRODUCTS_QUERY = gql`
  query ($productIds: [ID]) {
    cartAdditionalDetails(productIds: $productIds)
  }
`;

export const GET_ALL_FIELDS = gql`
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

export const GET_BRANDS_QUERY = gql`
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

export const PRODUCT_BY_A_CATEGORY = gql`
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
export const FEATURE_CATEGORY = gql`
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