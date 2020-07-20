# Test FrontEnd Qrvey

## Funtionalities

1. All countries must be listed.
2. All countries are grouped by continent.
3. The flag must be shown with the name of the country.
4. We can search for a specific country
5. The detail of the country must be seen when clicked on it
6. The details must have the country name, region,  population, the capital, currency, language, border countries (full name), flag
7. We can add favorite countries, and this should be visible on the country name

## Notes

-	The project not contain any framework.
-	It was developed with its own project structure.
-	The styles are their own, generated to be responsive.
-	It was used pure javascript.
-	The program is making only a request to the countries service when the user initializes the application. https://restcountries.eu/rest/v2/all, then this data is stored in a browser database with three main objects

    o	Countries
    o	Regions
    o	Favorites

-	The Autocomplete function doesn’t have any library. When you press a key, autocomplete will be searches for all countries name consciences, but only put the final results into the list if you press the ENTER key.
-	To restore the initial results, just leave the field search in blank and press "ENTER", this reset the countries result list.
-	The modal hasn't any library, it was built exclusively for this test project.

## Tools

-	CSS.
-	Javascript
-	S3 AWS
-	IndexedDB WEB Api, front end database

## Link 

[https://qrvey.s3-us-west-2.amazonaws.com/test/index.html](https://qrvey.s3-us-west-2.amazonaws.com/test/index.html)

