import { createContext, useContext, useReducer, useEffect } from "react";

export const GridContext = createContext({});
export const GridContextDispatch = createContext(null);

export function useGridContext() {
  return useContext(GridContext);
}

export function useGridContextDispatch() {
  return useContext(GridContextDispatch);
}

export function GridProvider({ children, initialContext }) {
  const gridContext = {
    ...initialGridContext,
    ...initialContext
  };

  const [context, dispatch] = useReducer(reducer, gridContext);
  useEffect(() => {
    fetch(context.url)
      .then((response) => response.json())
      .then((json) => {
          dispatch({ type: "fetch_data", payload: json }); 
          dispatch({ type:"on_pagination", name: "first"});
      });
  }, [context.filterValues,context.url]);

  return (
    <GridContext.Provider value={context}>
      <GridContextDispatch.Provider value={dispatch}>
        {children}
      </GridContextDispatch.Provider>
    </GridContext.Provider>
  );
}

const initialGridContext = {
  columns: ["id", "name", "username", "email", "phone"],
  selectedColumns: ["id", "name"],
  filterValues: {},
  data: [],
  filtered: [],
  url : "https://jsonplaceholder.typicode.com/users",
  pageSize : 10,
  currentPage : 0,
  pageCount : 0
};

function reducer(context, action) {
  switch (action.type) {
    case "add_column":
      if (!context.selectedColumns.includes(action.name)) {
        return {
          ...context,
          selectedColumns: [...context.selectedColumns, action.name]
        };
      }
      return { ...context };
    case "remove_column":
      if (context.selectedColumns.includes(action.name)) {
        return {
          ...context,
          selectedColumns: context.selectedColumns.filter(
            (e) => e !== action.name
          ),
          filterValues: {
            ...context.filterValues,
            [action.name]: undefined
          }
        };
      }
      return { ...context };
    case "remove_filter":
      return {
        ...context,
        filterValues: {
          ...context.filterValues,
          [action.name]: undefined
        }
      };
    case "apply_filters":
      return {
        ...context,
        filterValues: action.payload
      };
    case "fetch_data":
      return {
        ...context,
        data: action.payload,
        filtered: action.payload
      };
    case "on_pagination" :
      return onPagination(context, action);
    default:
      return { ...context };
  }
}

function onPagination(context, action) {
  const {pageSize,data,currentPage} = context;
  const pageCount = Math.ceil(data.length / pageSize);
  context.pageCount = pageCount;

  switch(action.name) {
    case "first" :
        return {
          ...context,
          filtered : data.slice(0,pageSize),
          currentPage : 0
        }
    case "previous" :
       if (currentPage > 0) {
         let previousPage = (currentPage - 1);
          return {
          ...context,
          filtered: data.slice((previousPage * pageSize),((previousPage + 1) *pageSize)),
          currentPage: previousPage
        }
       }
       return { ...context };
    case "next" :
       if (currentPage < (pageCount - 1)) {
          let nextPage = (currentPage + 1);
          return {
            ...context,
            filtered: data.slice((nextPage * pageSize),((nextPage + 1)*pageSize)),
            currentPage : nextPage
          }
       }
       return { ...context };
    case "last" :
        return {
          ...context,
          filtered : data.slice(data.length - pageSize),
          currentPage : (pageCount - 1)
        }
    case "size" :
        return {
          ...context,
          pageSize : action.size
        }
    default:
        break;
  }
}
