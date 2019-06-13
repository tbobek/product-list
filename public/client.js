// client-side js
// run by the browser each time your view template referencing it is loaded

console.log("start")
//Creating an indexDB - Used to store users information.  
//window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;


//var request = window.indexedDB.open("database", 1);

request.onerror = () => {
  console.log("error"); 
};
  
// create schema in newly defined database


// insert some example data


console.log('hello world :o');
var products = []; 

// define variables that reference elements on our page
const productsList = document.getElementById('products');
const productsForm = document.forms[0];
const inputProductId= productsForm.elements['product_id'];
const inputProductKey = productsForm.elements['product_key'];
const inputProductValue = productsForm.elements['product_value'];

// a helper function to call when our request for dreams is done
const getProductsListener = function() {
  // parse our response to convert to JSON
  if(this.responseText !== "") {
    products = JSON.parse(this.responseText);
  
    console.log("products: " + JSON.stringify(products)); 
    // iterate through every dream and add it to our page
    products.forEach( function(row) {
      appendNewProduct(row.product, row.key, row.val);
    });
  }
}

// request the dreams from our app's sqlite database
const productRequest = new XMLHttpRequest();
productRequest.onload = getProductsListener;
productRequest.open('get', '/getProducts');
productRequest.send();

// a helper function that creates a list item for a given dream
const appendNewProduct = function(id, key, value) {
  const newListItem = document.createElement('li');
  newListItem.innerHTML = id + " - " + key + "- " + value;
  productsList.appendChild(newListItem);
  /*
  const deleteButton = document.createElement('input'); 
  const buttonValue = document.createAttribute('value'); 
  buttonValue.value = "x"; 
  deleteButton.setAttributeNode(buttonValue); 
  const buttonType = document.createAttribute('type'); 
  buttonType.value = 'button'; 
  deleteButton.setAttributeNode(buttonType); 
  const buttonAction = document.createAttribute('onclick'); 
  buttonAction.value = 'deleteEntry()'; 
  deleteButton.setAttributeNode(buttonAction); 
  const buttonName = document.createAttribute('name'); 
  buttonAction.value = id; 
  deleteButton.setAttributeNode(buttonName); 
  
  productsList.appendChild(deleteButton); 
  */
}

const deleteEntry = () => {
  console.log("deleteEntry" ); // + event.target.value); 
}
// listen for the form to be submitted and add a new dream when it is
productsForm.onsubmit = function(event) {
  // stop our form submission from refreshing the page
  event.preventDefault();
  var pid = inputProductId.value; 
  var pkey = inputProductKey.value;
  var pvalue = inputProductValue.value; 
  // get dream value and add it to the list
  products.push([pid, pkey, pvalue]);
  appendNewProduct(pid, pkey, pvalue);

  const request = window.indexedDB.open("database", 1);
  request.onsuccess = () => {
    const db = request.result;
    const transaction = db.transaction("products", "readwrite" );
    const productStore = transaction.objectStore("products");
    
    // Add data
    productStore.add(
        { id: pid, key: pkey, value: pvalue }
    );
    
    // Clean up: close connection
    transaction.oncomplete = () => {
        db.close();
    };
  console.log("data added"); 
};
  
  // reset form 
  inputProductId.value = '';
  inputProductKey.value = ''; 
  inputProductValue.value = ''; 
  inputProductValue.focus();
  const productRequest = new XMLHttpRequest();
  //dreamRequest.onload = getDreamsListener;
  productRequest.open('post', '/insertProduct');
  productRequest.send();
};

const appendIndexedDbItem = function(list, id, key, value) {
  const newListItem = document.createElement('li');
  newListItem.innerHTML = id + " - " + key + " - " + value;
  list.appendChild(newListItem);
}

const getitemsi = () => {
  const request = window.indexedDB.open("database", 1);
  request.onsuccess = () => {
    const db = request.result;
    if(!db) console.log("no db"); 
    const transaction = db.transaction("products", "readwrite");
    
  const productStore = transaction.objectStore("products");
  const getRequest = productStore.getAll();
    getRequest.onsuccess = () => {
        console.log(getRequest.result); // {invoiceId: "123", vendor: "Whirlpool", paid: false}
    };
    
    // Clean up: close connection
    transaction.oncomplete = () => {
        db.close();
    };
};
 
  
}