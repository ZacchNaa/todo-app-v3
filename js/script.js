// selecting form events
const shoppingContent = document.querySelector(`.shopping_list`);
const shoppingForm = shoppingContent.querySelector(`.shopping`);
const shoppingList = shoppingContent.querySelector(`.list`);

// array to hold the state
let stateItems = [];

const submitHandler = (e) => {
  e.preventDefault();
  //   console.dir(e.currentTarget.item.value);
  const name = e.currentTarget.item.value;
  if (!name) return;
  const item = {
    name,
    id: Date.now(),
    complete: false,
  };

  stateItems.push(item);
  console.log(stateItems.length);

  e.target.reset();
  //   making use of custom events
  shoppingList.dispatchEvent(new CustomEvent(`itemsUpdated`));
};

// display the list shopping items to the user
const displayShoppingList = () => {
  const html = stateItems
    .map(
      (item) => `
        <li>
            <span class="checklist">
              <input type="checkbox"  value="${item.id}"
              ${item.complete && "checked"} />
              <span class="itemName">${item.name}</span>
            </span>
            <button aria-label="Remove ${item.id}" value="${
        item.id
      }">&times;</button>
        </li>
    `
    )
    .join(``);

  shoppingList.innerHTML = html;
};

// saving to the localstorage
const saveToLocalStorage = () => {
  localStorage.setItem(`listStore`, JSON.stringify(stateItems));
};

// retrieve from the localstorage
const pullFromLocalStorage = () => {
  const storeLists = JSON.parse(localStorage.getItem(`listStore`));
  if (storeLists.length) {
    /**ALTERNATIVES: 1. use foreach to loop through each list
     * and push is into to the stateItems array
     *::storeLists.forEach(storeList=>stateItems.push(storeList))
     * 2.use the spread operator to push the lists
     * 3. convert the stateItems array from const to let
     * and push the list one at a time:
     * :stateItems.push(storeLists[0])
     * 4. convert stateItems from const to let and assign storeLists to
     * it::stateItems=storeLists
     */
    //   spread the storeLists into the stateItems array
    stateItems.push(...storeLists);
    shoppingList.dispatchEvent(new CustomEvent(`itemsUpdated`));
  }
};

// saving to the localstorage
const deleteFromLocalStorage = (id) => {
  stateItems = stateItems.filter((stateItem) => stateItem.id !== id);
  console.log(stateItems);
  shoppingList.dispatchEvent(new CustomEvent(`itemsUpdated`));
};

// mark as complete
const markCompleteToLocalStorage = (id) => {
  itemRef = stateItems.find((stateItem) => stateItem.id === id);
  itemRef.complete = !itemRef.complete; //switching boolean
  shoppingList.dispatchEvent(new CustomEvent(`itemsUpdated`));
};

shoppingForm.addEventListener("submit", submitHandler);
// using the custom event
shoppingList.addEventListener("itemsUpdated", displayShoppingList);
shoppingList.addEventListener("itemsUpdated", saveToLocalStorage);
/**EVENT DELEGATION: listening for a click event on the <ul>/
shoppingList, but them delegate the click over to the button
if that is what was clicked */
shoppingList.addEventListener("click", (e) => {
  const id = parseInt(e.target.value);
  if (e.target.matches(`button`)) {
    deleteFromLocalStorage(id);
  }

  if (e.target.matches(`input[type="checkbox"]`)) {
    markCompleteToLocalStorage(id);
  }
});

// fire on page load
pullFromLocalStorage();
