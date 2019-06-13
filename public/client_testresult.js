testResultForm = document.forms[0];
testResultForm.onsubmit = function (event) {
    // stop our form submission from refreshing the page
    event.preventDefault();
    console.log(event); 
    
    // get product id from localStore
    var qrCodeResult = localStorage.getItem('product_id');
    console.log("qrcode = " + qrCodeResult); 
    // get rating from form 
    var v = testResultForm.elements['rating']; 
    var result = v.options[v.selectedIndex].value;
    console.log("result: " + result); 
    
    // insert into indexedDb

    const request = window.indexedDB.open("database", 1);
    request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction("products", "readwrite");
        const productStore = transaction.objectStore("products");
        console.log("productstore: " + productStore); 
        // Add data
        productStore.add(
            { id: qrCodeResult, key: "rating", value: result }
        );
 
        // Clean up: close connection
        transaction.oncomplete = () => {
            db.close();
            console.log("complete"); 
        };
        console.log("data added");
    };
}
