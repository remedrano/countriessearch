class IndexDbClient {
    constructor() {}

    validateIndexDB() {
        if (!window.indexedDB) {
            return false;
        } else {
            return true;
        }
    }

    searchCountry(countryName) {
        return new Promise((resolve, reject) => {
            var dbRequest = indexedDB.open("Qrvey", 1);
            dbRequest.onsuccess = function(e) {

                let resultDb = e.target.result;
                try {
                    var objectStore = resultDb.transaction(["countries"], "readonly").objectStore("countries");
                    var indexName = objectStore.index('by_name');
                    var getAllRequest = indexName.get(countryName);
                    getAllRequest.onsuccess = function() {
                        resolve(getAllRequest.result);
                    }
                } catch (e) {
                    resolve(false);
                }
            }

            dbRequest.onerror = function(e) {
                reject("Error : " + e);
            };
        });
    }

    searchAllRegions() {
        return new Promise((resolve, reject) => {
            var dbRequest = indexedDB.open("Qrvey", 1);
            dbRequest.onsuccess = function(e) {

                let resultDb = e.target.result;
                try {
                    var objectStore = resultDb.transaction(["regions"], "readonly").objectStore("regions");
                    var regionIndex = objectStore.index('by_namecontinent');
                    var getAllKeysRequest = regionIndex.getAll();
                    getAllKeysRequest.onsuccess = function() {
                        resolve(getAllKeysRequest.result);
                    }
                } catch (e) {
                    resolve(false);
                }
            }

            dbRequest.onerror = function(e) {
                reject("Error : " + e);
            };
        });
    }

    createDatabase() {
        return new Promise((resolve, reject) => {
            try {
                let dbRequest = indexedDB.open("Qrvey", 1);
                dbRequest.onsuccess = function(e) {
                        resolve(dbRequest);
                    }
                    //Init database
                dbRequest.onupgradeneeded = function() {
                    let resultDb = dbRequest.result;
                    let store = resultDb.createObjectStore("countries", { keyPath: "name" });
                    store.createIndex("by_name", "name", { unique: true });
                    store.createIndex("by_region", "region");

                    let storeFavoritos = resultDb.createObjectStore("favorites", { keyPath: "name" });
                    storeFavoritos.createIndex("by_namefavorite", "name");

                    let storeContinent = resultDb.createObjectStore("regions", { keyPath: "id", autoIncrement: true });
                    storeContinent.createIndex("by_namecontinent", "name");
                }
                dbRequest.onerror = function(e) {
                    reject("Error : " + e);
                };
            } catch (e) {
                reject("Error : " + e);
            }
        });
    }

    addData(countries) {

        return new Promise((resolve, reject) => {
            var dbRequest = indexedDB.open("Qrvey", 1);
            dbRequest.onsuccess = function(e) {

                let resultDb = e.target.result;
                try {
                    var transaccion = resultDb.transaction(["countries", "regions"], "readwrite");
                    var objectStore = transaccion.objectStore("countries");
                    var objectStoreContinent = transaccion.objectStore("regions");

                    var uniqueValues = [];
                    countries.forEach(element => {

                        if (element.region === "" || element.region == null) {
                            element.region = "_Name Not found";
                        }
                        /*Save regions*/
                        let found = uniqueValues.find(el => el.name == element.region);
                        if (found === undefined || found == null) {
                            uniqueValues.push({ "name": element.region });
                            objectStoreContinent.add({ "name": element.region });
                        }
                        objectStore.add(element);

                    });
                    transaccion.oncomplete = function(e) {
                        resolve(dbRequest);
                    }
                    transaccion.onerror = function(e) {
                        reject("Error : " + e);
                    }

                } catch (e) {
                    reject("Error : " + e);
                }
            }

            dbRequest.onerror = function(e) {
                reject("Error : " + e);
            };
        });
    }

    clearAllData() {

        return new Promise((resolve, reject) => {

            var dbRequest = indexedDB.open("Qrvey", 1);
            dbRequest.onsuccess = function(e) {

                let resultDb = e.target.result;
                try {
                    var objectStore = resultDb.transaction(["countries"], "readwrite").objectStore("countries");

                    var requestClear = objectStore.clear();
                    requestClear.onsuccess = function(event) {
                        resolve(event);
                    }
                } catch (e) {
                    reject("Error : " + e);
                }
            }

            dbRequest.onerror = function(e) {
                reject("Error : " + e);
            };
        });
    }

    getAllData() {
        return new Promise((resolve, reject) => {
            var dbRequest = indexedDB.open("Qrvey", 1);

            dbRequest.onsuccess = function(e) {

                let resultDb = e.target.result;
                try {
                    var objectStore = resultDb.transaction(["countries"], "readonly").objectStore("countries");
                    var indexName = objectStore.index('by_name');
                    var getAllRequest = indexName.getAll();
                    getAllRequest.onsuccess = function() {
                        resolve(getAllRequest.result);
                    }
                } catch (e) {
                    resolve(false);
                }
            }

            dbRequest.onerror = function(e) {
                reject("Error : " + e);
            };
        });
    }

    addDataFavorites(favorite) {

        return new Promise((resolve, reject) => {
            var dbRequest = indexedDB.open("Qrvey", 1);
            dbRequest.onsuccess = function(e) {

                let resultDb = e.target.result;
                try {
                    var transaccion = resultDb.transaction(["favorites"], "readwrite");
                    var objectStore = transaccion.objectStore("favorites");

                    objectStore.add(favorite);
                    transaccion.oncomplete = function(e) {
                        resolve(dbRequest);
                    }
                    transaccion.onerror = function(e) {
                        reject("Error : " + e);
                    }

                } catch (e) {
                    reject("Error : " + e);
                }
            }

            dbRequest.onerror = function(e) {
                reject("Error : " + e);
            };
        });
    }

    searchFavorite(favoriteName) {

        return new Promise((resolve, reject) => {
            var dbRequest = indexedDB.open("Qrvey", 1);
            dbRequest.onsuccess = function(e) {

                let resultDb = e.target.result;
                try {
                    var objectStore = resultDb.transaction(["favorites"], "readonly").objectStore("favorites");
                    var indexName = objectStore.index('by_namefavorite');
                    var getAllRequest = indexName.get(favoriteName);
                    getAllRequest.onsuccess = function() {
                        resolve(getAllRequest.result);
                    }
                } catch (e) {
                    resolve(false);
                }
            }

            dbRequest.onerror = function(e) {
                reject("Error : " + e);
            };
        });
    }

    deleteFavorite(favoriteName) {
        return new Promise((resolve, reject) => {
            var dbRequest = indexedDB.open("Qrvey", 1);
            dbRequest.onsuccess = function(e) {

                let resultDb = e.target.result;
                try {
                    var objectStore = resultDb.transaction(["favorites"], "readwrite").objectStore("favorites");
                    var getAllRequest = objectStore.delete(favoriteName);
                    getAllRequest.onsuccess = function() {
                        resolve(getAllRequest.result);
                    }
                } catch (e) {
                    resolve(false);
                }
            }

            dbRequest.onerror = function(e) {
                reject("Error : " + e);
            };
        });
    }

    searchAllFavorites() {
        return new Promise((resolve, reject) => {
            var dbRequest = indexedDB.open("Qrvey", 1);
            dbRequest.onsuccess = function(e) {

                let resultDb = e.target.result;
                try {
                    var objectStore = resultDb.transaction(["favorites"], "readonly").objectStore("favorites");
                    var regionIndex = objectStore.index('by_namefavorite');
                    var getAllKeysRequest = regionIndex.getAll();
                    getAllKeysRequest.onsuccess = function() {
                        resolve(getAllKeysRequest.result);
                    }
                } catch (e) {
                    resolve(false);
                }
            }

            dbRequest.onerror = function(e) {
                reject("Error : " + e);
            };
        });
    }
}