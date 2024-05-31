import gql from 'graphql-tag';

const GET_APP_SETTING = gql`
  query HomePageSettings {
    getSettings {
      seo {
        meta_title
      }
      store {
        currency_options {
          currency
          currency_position
          thousand_separator
          decimal_separator
          number_of_decimals
        }
        store_address {
          addressLine1
          addressLine2
          city
          country
          state
          zip
          hour
        }
        inventory {
          manage_stock
          notifications {
            show_out_of_stock
            alert_for_minimum_stock
          }
          notification_recipients
          low_stock_threshold
          left_quantity
          stock_display_format
        }
      }
      payment {
        cash_on_delivery {
          enable
          title
          description
        }
        bank_transfer {
          enable
          title
          description
          account_details {
            account_name
            account_number
            bank_name
            short_code
            iban
            bic_swift
          }
        }
        stripe {
          enable
          title
          description
          test_mode
        }
        paypal {
          enable
          title
          description
          test_mode
          sandbox_secret_key
          live_secret_key
          sandbox_client_id
          live_client_id
        }
        razorpay {
          enable
          title
          description
          test_mode
          sandbox_secret_key
          live_secret_key
          sandbox_client_id
          live_client_id
        }
      }
      imageStorage {
        status
        s3_id
        s3_key
      }
      appearance {
        theme {
          primary_color
          playstore
          appstore
          logo
        }

        mobile {
          mobile_section {
            label
            section_img
            visible
            url
            category
          }
          slider {
            image
            link
            open_in_tab
          }
        }
      }
    }
  }
`;

export { GET_APP_SETTING };
