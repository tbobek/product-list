var requestI = window.indexedDB.open("database", 1);

requestI.onupgradeneeded = event => {  
  const db = event.target.result;
  
  const productStore = db.createObjectStore("products", { keyPath: "id" }); 
  productStore.createIndex("key", "key", {unique: false});    
}; 

requestI.onsuccess = () => {
  const db = requestI.result;
  const tx = db.transaction("products", "readwrite");
  const productsStore = tx.objectStore("products");
  const productsIndex = productsStore.index("key");

  // Add data
  productsStore.add({id: "123", key: "test", value: "bad"});
  productsStore.add({id: "234", key: "toast", value: "good"});
  
  // Get an item by key
  const getRequest = productsStore.get("123");
  getRequest.onsuccess = () => {
      console.log(getRequest.result); // {invoiceId: "123", vendor: "Whirlpool", paid: false}
  };
  
  // Get an item by index
  const getRequestIdx = productsIndex.getAll("123");
  getRequestIdx.onsuccess = () => {
      console.log(getRequestIdx.result); // [ {invoiceId: "123", vendor: "Whirlpool", paid: false},
  };                                     //   {invoiceId: "580", vendor: "Whirlpool", paid: true} ]
};
