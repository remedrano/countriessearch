class AutoComplete {

    constructor(modal) {
        this.currentCountry = -1;
        this.searchInput = document.getElementById("search-input");
        this.countryList = new CountryList(modal);
    }

    initAutocomplete() {
        var _this = this;
        this.searchInput.addEventListener("keydown", function(e) {
            var countries = document.querySelectorAll(".item-country");
            if (e.keyCode == 40) {
                _this.currentCountry++;
                _this.addActive(countries);
            } else if (e.keyCode == 38) {
                _this.currentCountry--;
                _this.addActive(countries);
            } else if (e.keyCode == 13) {
                e.preventDefault();
                _this.coutryListFilter();
                if (_this.currentCountry > -1) {
                    if (countries[_this.currentCountry]) {
                        countries[_this.currentCountry].click();
                    }
                }
            } else if (e.keyCode == 13) {
                _this.deleteLists();
            }
        });

        this.searchInput.addEventListener("input", function(e) {
            _this.resultsView();
        });
    }

    addActive(countries) {

        if (!countries) return false;
        this.deleteActive(countries);

        if (this.currentCountry >= countries.length) this.currentCountry = 0;
        if (this.currentCountry < 0) this.currentCountry = (countries.length - 1);

        var divFlagList = document.querySelector("#" + this.searchInput.id + "-list");
        if (this.currentCountry > 12) {
            divFlagList.scrollTop = countries[this.currentCountry].offsetTop - 50;
        } else {
            divFlagList.scrollTop = 0;
        }
        countries[this.currentCountry].classList.add("autocomplete-active");
    }

    deleteActive(countries) {

        for (let item of countries) {
            item.classList.remove("autocomplete-active");
        }
    }

    deleteLists() {

        let elements = document.getElementsByClassName("autocomplete-items");
        for (let item of elements) {
            item.parentNode.removeChild(item);
        };
    }

    resultsView() {

        this.deleteLists();
        var divFlagList, flagDiv, _this = this,
            inputValue = this.searchInput.value.toUpperCase();
        divFlagList = document.createElement("div");
        divFlagList.setAttribute("id", this.searchInput.id + "-list");
        divFlagList.setAttribute("class", "autocomplete-items col-5");
        this.searchInput.parentNode.appendChild(divFlagList);

        results.forEach(item => {
            let countryName = item.name;
            let countryNamePart = countryName.substr(0, _this.searchInput.value.length).toUpperCase();
            if (countryNamePart == inputValue) {
                flagDiv = document.createElement("div");
                flagDiv.setAttribute("class", "item-country");
                flagDiv.innerHTML = "<img src='" + item.flag + "' alt=" + item.name + " class='img-country-list'>";
                flagDiv.innerHTML += "<strong>" + countryName.substr(0, _this.searchInput.value.length) + "</strong>";
                flagDiv.innerHTML += countryName.substr(_this.searchInput.value.length);
                flagDiv.innerHTML += "<input type='hidden' value='" + item.name + "'>";
                flagDiv.addEventListener("click", function(e) {
                    _this.searchInput.value = this.getElementsByTagName("input")[0].value;
                    _this.coutryListFilter();
                    _this.deleteLists();

                });
                divFlagList.appendChild(flagDiv);
            }
        });
    }

    coutryListFilter() {
        this.deleteLists();
        this.countryList.filterList(this.searchInput.value.toUpperCase());
    }
}