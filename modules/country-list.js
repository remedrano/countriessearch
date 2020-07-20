class CountryList {

    constructor(modal) {
        this.indexDbClient = new IndexDbClient();
        this.modal = modal;
    }

    async viewListAll(regionsAll, resultsAll) {

        var _this = this;

        if (regionsAll == null) {
            regionsAll = await this.indexDbClient.searchAllRegions();
        }

        if (resultsAll == null) {
            resultsAll = results;
        }

        var divFlagList = document.querySelector("#country-file");
        divFlagList.innerHTML = "";
        var allFavorites = await this.indexDbClient.searchAllFavorites();

        regionsAll.forEach(item => {

            let flagColumn = document.createElement("div");
            let flagTitle = document.createElement("div");

            flagColumn.setAttribute("class", "col-4");
            flagTitle.setAttribute("class", "title-continent");
            flagTitle.innerHTML = "<span>" + item.name + "</span>";

            flagColumn.appendChild(flagTitle);
            let countries = resultsAll.filter(country => country.region == item.name);

            countries.forEach(country => {
                var flagCountry = document.createElement("div");

                let searchFavoriteResut = allFavorites.find(itemFavorite => country.name == itemFavorite.name);

                flagCountry.innerHTML = "<img  src='" + country.flag + "' alt=" + country.name + " class='img-country-continent'>";
                flagCountry.innerHTML += " <span >" + country.name + "</span>";

                if (searchFavoriteResut != undefined) {
                    flagCountry.innerHTML += " <img  id='img-" + country.name + "' src='assets/images/favorite-true.png' alt=" + country.name + " class='img-country-continent'>";
                }

                flagCountry.setAttribute("class", "country-item");
                flagCountry.setAttribute("title", country.name);
                flagCountry.setAttribute("id", country.name);

                flagCountry.addEventListener("click", async function(e) {
                    let searchResult = await _this.indexDbClient.searchCountry(country.name);

                    document.querySelector("#modal-title").innerHTML = searchResult.name;
                    document.querySelector("#modal-region").innerHTML = searchResult.region;

                    let currencies = _this.getCurrencies(searchResult.currencies);
                    let languages = _this.getLanguages(searchResult.languages);
                    let borders = searchResult.borders.length > 0 ? _this.getBorderCountries(searchResult.borders) : "Not found";
                    let population = _this.getPopulationUnit(searchResult.population);
                    let capital = searchResult.capital == "" ? "Not found" : searchResult.capital;

                    document.querySelector("#modal-population").innerHTML = _this.formatNumber(population.value) + " " + population.unit;
                    document.querySelector("#modal-capital").innerHTML = capital;
                    document.querySelector("#modal-currency").innerHTML = currencies;
                    document.querySelector("#modal-language").innerHTML = languages;
                    document.querySelector("#modal-countries").innerHTML = borders;
                    document.querySelector("#modal-flag").setAttribute("src", searchResult.flag);

                    /*Favorite*/
                    let searchResultFavorite = await _this.indexDbClient.searchFavorite(searchResult.name);
                    let favoriteElement = document.querySelector("#modal-favorite");
                    favoriteElement.setAttribute("country", searchResult.name);

                    if (searchResultFavorite == undefined) {
                        _this.changeObjectFavorite(favoriteElement, false);
                    } else {
                        _this.changeObjectFavorite(favoriteElement, true);
                    }
                    _this.modal.classList.toggle("show-modal");
                });

                flagColumn.appendChild(flagCountry);
            });
            divFlagList.appendChild(flagColumn);
        });

    }

    formatNumber(number) {

        return Number(number.toFixed(2)).toLocaleString('en', {
            minimumFractionDigits: 0
        });
    }

    getCurrencies(currencies) {

        let currenciesString = "";
        currencies.forEach(item => {
            currenciesString += item.name + " (" + item.code + "),"
        });
        currenciesString = currenciesString.slice(0, -1);

        return currenciesString;
    }

    getPopulationUnit(number) {

        let result;
        let unitPopulation = "";
        if ((number / 1000000) >= 1) {
            unitPopulation = "M";
            result = Math.round(number / 1000000);
        } else {
            result = number;
        }

        return { value: result, unit: unitPopulation };
    }

    getLanguages(languages) {

        let languagesString = "";
        languages.forEach(item => {
            languagesString += item.name + " (" + item.iso639_1 + "),"
        });
        languagesString = languagesString.slice(0, -1)
        return languagesString;
    }

    getBorderCountries(borders) {

        let bordersCountriesString = "";
        let bordersCountries = results.filter(item => borders.includes(item.cioc));
        bordersCountries.forEach(item => {
            bordersCountriesString += item.nativeName + ","
        });

        bordersCountriesString = bordersCountriesString.slice(0, -1);
        return bordersCountriesString;
    }

    initFavorite() {

        let favorite = document.querySelector("#modal-favorite");
        let _this = this;
        favorite.addEventListener("click", async function() {

            let element = { name: this.getAttribute("country") };
            let searchResult = await _this.indexDbClient.searchFavorite(element.name);
            let countryDiv = document.getElementById(element.name);

            if (this.getAttribute("favorite") == "true") {
                _this.changeObjectFavorite(this, false);
                document.createElement("img");
                let countryImg = document.getElementById("img-" + element.name);
                countryImg.parentNode.removeChild(countryImg);

                await _this.indexDbClient.deleteFavorite(element.name);
            } else {
                if (this.getAttribute("favorite") == "false") {
                    var imgFavorite = document.createElement("img");
                    imgFavorite.src = 'assets/images/favorite-true.png';
                    imgFavorite.setAttribute("class", "img-country-continent");
                    imgFavorite.setAttribute("id", "img-" + element.name);

                    countryDiv.appendChild(imgFavorite);
                    _this.changeObjectFavorite(this, true);
                    if (searchResult == undefined)
                        await _this.indexDbClient.addDataFavorites(element);
                }
            }

        });
    }

    changeObjectFavorite(object, value) {

        if (value == false) {
            object.setAttribute("favorite", "false");
            object.setAttribute("src", "assets/images/favorite-false.png");
            object.setAttribute("title", "Click to Add to favorites");
        } else {
            object.setAttribute("favorite", "true");
            object.setAttribute("src", "assets/images/favorite-true.png");
            object.setAttribute("title", "Click to Remove from favorites");
        }

    }

    filterList(value) {

        if (value == "" || value.length == 0) {
            this.viewListAll(null, null);
        } else {
            var arrayCountryFilter = results.filter(item => item.name.substr(0, value.length).toUpperCase() == value.toUpperCase());
            var regions = [];
            arrayCountryFilter.forEach(item => {
                let resultado = regions.find(region => region.name === item.region);
                if (resultado === undefined) {
                    regions.push({ name: item.region });
                }
            });
            this.viewListAll(regions, arrayCountryFilter);
        }
    }

}