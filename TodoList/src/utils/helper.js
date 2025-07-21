export function saveToLocalStorage(name, data) {
  localStorage.setItem(name, JSON.stringify(data));
}
