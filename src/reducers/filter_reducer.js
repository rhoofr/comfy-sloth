import {
  LOAD_PRODUCTS,
  SET_LISTVIEW,
  SET_GRIDVIEW,
  UPDATE_SORT,
  SORT_PRODUCTS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS
} from '../actions';

const filter_reducer = (state, action) => {
  switch (action.type) {
    case LOAD_PRODUCTS: {
      let maxPrice = action.payload.map(p => p.price);
      maxPrice = Math.max(...maxPrice);
      return {
        ...state,
        filteredProducts: [...action.payload],
        allProducts: [...action.payload],
        filters: { ...state.filters, maxPrice, price: maxPrice }
      };
    }

    case SET_GRIDVIEW:
      return {
        ...state,
        gridView: true
      };

    case SET_LISTVIEW:
      return {
        ...state,
        gridView: false
      };

    case UPDATE_SORT:
      return {
        ...state,
        sort: action.payload
      };

    case SORT_PRODUCTS: {
      const { sort, filteredProducts } = state;
      let tempProducts = [...filteredProducts];
      switch (sort) {
        case 'price-lowest':
          tempProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-highest':
          tempProducts.sort((a, b) => b.price - a.price);
          break;
        case 'name-a':
          tempProducts.sort((a, b) =>
            a.name.localeCompare(b.name, 'en', { ignorePunctuation: true })
          );
          break;
        case 'name-z':
          tempProducts.sort((a, b) =>
            b.name.localeCompare(a.name, 'en', { ignorePunctuation: true })
          );
          break;

        default:
          return state;
      }
      return {
        ...state,
        filteredProducts: tempProducts
      };
    }

    case UPDATE_FILTERS: {
      const { name, value } = action.payload;
      return {
        ...state,
        filters: {
          ...state.filters,
          [name]: value
        }
      };
    }

    case CLEAR_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          text: '',
          company: 'all',
          category: 'all',
          color: 'all',
          price: state.filters.maxPrice,
          shipping: false
        }
      };

    case FILTER_PRODUCTS: {
      const { allProducts } = state;
      const { text, category, company, color, price, shipping } = state.filters;

      let tempProducts = [...allProducts];
      // filtering
      // text
      if (text) {
        tempProducts = tempProducts.filter(product => {
          return product.name.toLowerCase().startsWith(text);
        });
      }
      // category
      if (category !== 'all') {
        tempProducts = tempProducts.filter(
          product => product.category === category
        );
      }
      // company
      if (company !== 'all') {
        tempProducts = tempProducts.filter(
          product => product.company === company
        );
      }
      // colors
      if (color !== 'all') {
        tempProducts = tempProducts.filter(product => {
          return product.colors.find(c => c === color);
        });
      }
      // price
      tempProducts = tempProducts.filter(product => product.price <= price);

      // shipping
      if (shipping) {
        tempProducts = tempProducts.filter(product => product.shipping);
      }

      return { ...state, filteredProducts: tempProducts };
    }

    default:
      return state;
  }
  // return state;
  // throw new Error(`No Matching "${action.type}" - action type`);
};

export default filter_reducer;
