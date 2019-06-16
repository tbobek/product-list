
testResultForm = document.forms[0];
testResultForm.onsubmit = function (event) {
    // stop our form submission from refreshing the page
    event.preventDefault();
    console.log(event); 
    
    // get product id from localStore
    var qrCodeResult = localStorage.getItem('product_id');
    if(qrCodeResult === "None") {
        qrCodeResult = Math.floor(Math.random()*1000); 
    }
    console.log("qrcode = " + qrCodeResult); 
    // get rating from form 
    var v = testResultForm.elements['rating']; 
    var ratingResult = v.options[v.selectedIndex].value;
    console.log("result: " + ratingResult); 
    
    // insert into indexedDb

    const request = window.indexedDB.open("database", 1);
    request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction("products", "readwrite");
        const productStore = transaction.objectStore("products");
        const dataObject = { id: ""+qrCodeResult, key: 'rating', value: ratingResult }; 
        console.log("productstore: " + productStore); 
        // Add data
        productStore.add(
            dataObject
        );
 
        // Clean up: close connection
        transaction.oncomplete = () => {
            db.close();
            console.log("complete"); 
        };
        console.log("data added");

        // TODO check if remote db available. If so, insert there
        console.log(`before: ${JSON.stringify(dataObject)}`); 
        fetch('/glass/create', {
          method: 'POST',
          body: JSON.stringify(dataObject), 
          headers: {
            'Content-Type': 'application/json'
          },
        }).then(res => res.json())
        .then(res => console.log("Success: ", JSON.stringify(res)))
        .catch(error => console.error('Error: ',  error))
        // TODO check document
        // TODO give feedback to user about insertion
        var fbDiv = document.getElementById("feedback"); 
        fbDiv.innerHTML = "inserted: " + JSON.stringify(dataObject) + " at " + (new Date()).toString(); 
      
        // const testResultRequest = new XMLHttpRequest();
        // testResultRequest.
        // testResultRequest.open('post', '/testresult');
        // testResultRequest.send();
        console.log("finished")
    };
}
