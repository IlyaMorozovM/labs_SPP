window.onload = async function() {
    const data = await clientRequest("/cars", "GET");
    for (let i = 0; i < data.length; i++) {
        showCars(data[i]);
    }
    document.getElementById("submitAdd").onclick = async function() {
        let car = {};
        car.name = document.getElementById("name").value;
        car.color = document.getElementById("color").value;
        car.photo = document.getElementById("photo").files[0];
        car.price = document.getElementById("price").value;

        const response = await clientPostRequest("/cars", "POST", car);
        console.log(response);
        showCars(response);
    };
}

async function clientPostRequest(url, method, data = null) {
    try {
        var formData = new FormData();
        formData.append("photo", data.photo);
        formData.append("name", data.name);
        formData.append("price", data.price);
        formData.append("color", data.color);
        let headers = {};
        let body;
        if (data) {
            //тип данных - JSON
            // headers['Content-type'] = 'application/json';
            body = formData;
        }
        //без перезагрузки страницы
        const response = await fetch(url, {
            method,
            headers,
            body
        });
        return await response.json();
    } catch (e) {
        console.warn(e.message);
    }
}

//запрос страницы
//method == post, get, и т.д.
async function clientRequest(url, method, data = null) {
    try {
        let headers = {};
        let body;
        if (data) {
            //тип данных - JSON
            headers['Content-type'] = 'application/json';
            body = JSON.stringify(data);
        }
        //без перезагрузки страницы
        const response = await fetch(url, {
            method,
            headers,
            body
        });
        return await response.json();
    } catch (e) {
        console.warn(e.message);
    }
}

function showCars(car) {
    const item = ` <tr>
        <td id="image-td">
        <img src="${car.photo}" class="responsive-img">
        </td>
        <td>
        ${car.name}
        </td>
        <td>
        ${car.color}
        </td>
        <td>
        ${car.price}
        </td>
        </tr> `;
    //добавление кода к html
    document.getElementById('cars').innerHTML =
        document.getElementById('cars').innerHTML + item;
}