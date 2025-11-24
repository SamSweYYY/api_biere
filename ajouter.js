window.addEventListener("load", async () => {

    console.log("==> ajouter.js chargé");

    let db;
    let beers = [];

    // -----------------------------------
    // INIT IndexedDB
    // -----------------------------------
    async function initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('beerDB', 1);

            request.onupgradeneeded = event => {
                const db = event.target.result;
                const store = db.createObjectStore('beers', { keyPath: 'id' });
                store.createIndex('name', 'name', { unique: false });
            };

            request.onsuccess = event => resolve(event.target.result);
            request.onerror = event => reject(event.target.error);
        });
    }

    db = await initDB();

    async function addToDB(beer) {
        return new Promise((resolve, reject) => {

            console.log("==> Ajout de :", beer);

            const tx = db.transaction(['beers'], 'readwrite');
            const store = tx.objectStore('beers');
            const request = store.add(beer);

            request.onsuccess = () => {
                console.log("✔️ Ajout réussi :", beer);
                resolve(true);
            };

            request.onerror = () => {
                console.error("❌ IndexedDB error :", request.error);
                reject(request.error);
            };
        });
    }

    const form = document.getElementById("add-beer-form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); 

        const beer = {
            id: Date.now(),
            name: document.getElementById("name").value,
            tagline: document.getElementById("tagline").value,
            description: document.getElementById("description").value
        };

        console.log("==> Beer envoyée :", beer);

        await addToDB(beer);

        document.getElementById("message").innerHTML =
            `<div class="alert alert-success">Bière ajoutée avec succès </div>`;

        form.reset();
    });

});
