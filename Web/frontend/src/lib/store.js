// store.js
// sessionStorage use kiya hai localStorage ki jagah.
// Fark: localStorage data tab tak rehta hai jab tak manually clear na karo.
//       sessionStorage data tab clear hota hai jab browser tab band ho ya refresh ho.
// Isliye refresh karne par predictions aur analytics apne aap saaf ho jaate hain.

export function saveToStore(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

export function loadFromStore(key) {
  try {
    return JSON.parse(sessionStorage.getItem(key));
  } catch {
    return null;
  }
}

export function clearStore() {
  try {
    sessionStorage.removeItem("predictions");
    sessionStorage.removeItem("analytics");
  } catch {}
}

