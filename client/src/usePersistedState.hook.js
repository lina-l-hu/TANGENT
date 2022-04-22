import {useState, useEffect} from "react";

//hook to store and use value in local storage
const usePersistedState = (defaultValue, key) => {
    const [value, setValue] = useState(() => {
        const storedValue = window.localStorage.getItem(key);

        const parsedValue = storedValue !== null ? JSON.parse(storedValue) : defaultValue;
    
        return parsedValue;
    })    

    useEffect(() => {
    
        window.localStorage.setItem(key, JSON.stringify(value));
        
    }, [value])

    return [value, setValue];
}

export default usePersistedState;