// CRUD - localStorageHandler - C===U (a localStorage-ban a tartalom csak egészében módosíható)
const localDB = {
    setItem(key, value) {
        value = JSON.stringify(value);
        localStorage.setItem(key, value);
    },
    getItem(key) {
        const value = localStorage.getItem(key);
        if (!value) {
            return null;
        }
        return JSON.parse(value);
    },
    removeItem(key) {
        localStorage.removeItem(key);
    },
};

export default localDB;