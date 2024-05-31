import AsyncStorage from '@react-native-async-storage/async-storage';
import { AWS3 } from 'react-native-aws3';
import AWS from 'aws-sdk';

export const isEmpty = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0);

/*let baseURL = "";
if (process.env.NODE_ENV === "production") {
  baseURL = "http://159.89.170.199:80";
} else {
  baseURL = "http://localhost:8000";
}*/

export const baseUrl = 'http://192.168.1.6:8000';
// export const baseUrl = 'http://localhost:8000';
// export const baseUrl = 'https://ravendel-backend.hbwebsol.com';

/*-------------------------------------------------------------------------------------------------------------------------------------- */
//simple category array to Tree array
export const unflatten = (items, id = null, link = 'parentId') => {
  const arr = items
    .filter((item) => item[link] === id)
    .map((item) => ({ ...item, children: unflatten(items, item.id) }));
  return arr;
};

export const shippedStatuscolor = (status, alpha) => {
  const INPROGRESS_COLOR = '#8fbec7';
  const SHIPPED_COLOR = '#D6BFBF';
  const OUTFORDELIVERY_COLOR = '#D6D6BF';
  const DELIVERED_COLOR = '#BFD6C4';
  if (status === 'shipped') {
    return SHIPPED_COLOR + `${alpha ? '10' : ''}`;
  } else if (status === 'outfordelivery') {
    return OUTFORDELIVERY_COLOR + `${alpha ? '10' : ''}`;
  } else if (status === 'delivered') {
    return DELIVERED_COLOR + `${alpha ? '10' : ''}`;
  } else {
    return INPROGRESS_COLOR + `${alpha ? '10' : ''}`;
  }
};
export const shippedFinalStatuscolor = (status, alpha) => {
  const INPROGRESS_COLOR = '#00D8FF';
  const SHIPPED_COLOR = '#FF3636';
  const OUTFORDELIVERY_COLOR = '#FAFF00';
  const DELIVERED_COLOR = '#12C324';
  if (status === 'shipped') {
    return SHIPPED_COLOR + `${alpha ? '10' : ''}`;
  } else if (status === 'outfordelivery') {
    return OUTFORDELIVERY_COLOR + `${alpha ? '10' : ''}`;
  } else if (status === 'delivered') {
    return DELIVERED_COLOR + `${alpha ? '10' : ''}`;
  } else {
    return INPROGRESS_COLOR + `${alpha ? '10' : ''}`;
  }
};

/*----------------------------------------------------------------------------------------------------------------------------------------- */
//print tree array with html
// export var categoriesPrint = "";
// export const printTree = tree => {
//   categoriesPrint += "<ul>";

//   for (let i in tree) {
//     categoriesPrint += "<li>" + tree[i].name;
//     if (tree[i].children && tree[i].children.length) {
//       printTree(tree[i].children);
//     }
//     categoriesPrint += "</li>";
//   }

//   categoriesPrint += "</ul>";
// };

export var categoriesPrint = '';
export const printTree = (tree) => {
  categoriesPrint += "<ul className='category-dropdown'>";

  for (let i in tree) {
    categoriesPrint += `<li className="${
      tree[i].children && tree[i].children.length ? 'has-submenu' : ''
    }">                               
                        <label for="${
                          tree[i].name
                        }" className="checkmark-container">${tree[i].name}
                          <input type='checkbox' name="abc" id="${
                            tree[i].name
                          }">
                          <span className="checkmark"></span>
                        </label>`;
    if (tree[i].children && tree[i].children.length) {
      printTree(tree[i].children);
    }
    categoriesPrint += '</li>';
  }

  categoriesPrint += '</ul>';
};

export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error
  }
};

export const getToken = async () => {
  const token = await AsyncStorage.getItem('token');
  return token;
};

export const getValue = async (key) => {
  var data = '';
  try {
    const storageToken = await AsyncStorage.getItem(key);
    if (storageToken !== null) {
      data = storageToken;
    }
  } catch (e) {
    // Error
  }
  return data;
};

export const checkUserLoginStorage = async () => {
  const token = await AsyncStorage.getItem('token');
  const userDetails = await AsyncStorage.getItem('userDetails');

  return {
    token,
    userDetails: JSON.parse(userDetails),
  };
};

export const formatCurrency = (amt, currencyOptions, currencySymbol) => {
  if (!amt || !currencyOptions || !currencySymbol) {
    return '';
  }
  var amount = parseFloat(amt);
  if (currencyOptions && currencySymbol) {
    let postion = currencyOptions.currency_position;
    let decimal = currencyOptions.number_of_decimals || 2;
    return `${
      postion == 'left' || postion === 'left_space' ? currencySymbol : ''
    }${amount.toFixed(decimal)}${
      postion == 'right' || postion === 'right_space' ? currencySymbol : ''
    }`;
  } else {
    return `$${amount}`;
  }
};

export function capitalizeFirstLetter(string) {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

export const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};
