class HttpClient {
    constructor() {}

    request(method, url, headers) {

        return new Promise((resolve, reject) => {

            let xhr = new XMLHttpRequest();
            xhr.open(method || "GET", url);

            if (headers) {
                Object.keys(headers).forEach(key => {
                    xhr.setRequestHeader(key, headers[key]);
                });
            }
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.response);
                } else {
                    reject(xhr.statusText);
                }
            };
            xhr.onerror = () => reject(xhr.statusText);
            xhr.send();
        });
    }

}