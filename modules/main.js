var results = [];
var continentes = [];

(async function() {

    /**Objects in IndexDB*/
    let indexDbClient = new IndexDbClient();
    let validateDb = indexDbClient.validateIndexDB();
    if (validateDb) { //Your browser support indexedDB
        indexDbClient.createDatabase();
    }

    let httpClient = new HttpClient();
    results = await indexDbClient.getAllData();

    if (results.length == 0 || !results) {
        let responseResult = await httpClient.request('GET', env.urlRequest, env.headerRequest);
        results = JSON.parse(responseResult);
        if (validateDb) {
            await indexDbClient.clearAllData();
            await indexDbClient.addData(results);
        } else {
            alert("Your not support the IndexedDb ");
        }
    }

    /**Object Modal*/
    let objectModal = new Modal();
    let modal = objectModal.initModal();

    /**Objects in Autocomplete*/
    var autocomplete = new AutoComplete(modal);
    autocomplete.initAutocomplete();

    document.addEventListener("click", function(e) {
        if (event.target === modal) {
            modal.classList.toggle("show-modal");
        }
        autocomplete.deleteLists();
    });

    /**Objects ContryList*/
    let countryList = new CountryList(modal);
    countryList.viewListAll(null, null);
    countryList.initFavorite();

})();