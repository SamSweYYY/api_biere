const beerList = document.getElementById('beer-list');
        const searchInput = document.getElementById('search');
        const paginationUl = document.getElementById('pagination');
        let currentPage = 1;
        const perPage = 25;

        /* var page = 1;  */
        window.addEventListener("load", async (event) => {

            // Enregistrement du Service Worker
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/cache.js')
                    .then((reg) => {
                        console.log('Service worker enregistré avec succès', reg);
                    })
                    .catch((err) => {
                        console.error('Erreur lors de l\'enregistrement du service worker', err);
                    });
            }

            
            const beerList = document.createElement('div');
            beerList.className = 'beer-list';
            document.body.appendChild(beerList);

            function displayBeers(beers) {
                beerList.innerHTML = '';
                beers.forEach(beer => {
                    const beerItem = document.createElement('div');
                    beerItem.className = 'beer-item';
                    beerItem.dataset.title = beer.name.toLowerCase();
                    const image = document.createElement('img');
                    image.src = beer.image_url;
                    beerItem.classList.add('beer-item');
                    beerItem.innerHTML = `
        <h3>${beer.name}</h3>
        <img src="https://punkapi.online/v3/images/${beer.image}" />
        <p>${beer.tagline}</p>
        <p>Description: ${beer.description}</p>
        <p>First Brewed: ${beer.first_brewed}</p>
        <p>ABV: ${beer.abv}%</p>
        `;


                    beerItem.appendChild(image);
                    beerList.appendChild(beerItem);
                });
            }


            function filter() {
                const requete = searchInput.value.trim().toLowerCase();
                const items = document.querySelectorAll('.beer-item');
                let count = 0;

                items.forEach(it => {
                    const title = it.dataset.title || '';
                    const match = title.includes(requete);
                    it.hidden = !match;
                    if (match) count++;
                });

            }
            function loadPage(page) {
                const url = `https://punkapi.online/v3/beers?page=${page}&per_page=${perPage}`;
                fetch(url)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Erreur HTTP! Statut: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        currentPage = page; // Met à jour la page actuelle
                        displayBeers(data);
                        updatePagination(page, 3); // 5 est un exemple du nombre total de pages
                    })
                    .catch(error => {
                        console.error('Erreur lors de la récupération des données:', error);
                        beerList.innerHTML = '<p class="col-12 text-center text-danger">Désolé, une erreur est survenue lors du chargement des bières.</p>';
                    });
            }

            /**
             * 4. Met à jour les éléments de la pagination.
             * Comme l'API Punk n'indique pas le nombre total de bières, nous allons
             * générer une pagination simple (ex: 5 pages).
             */
            function updatePagination(current, total) {
                paginationUl.innerHTML = ''; // Vide la pagination

                // Bouton Précédent
                const prevLi = document.createElement('li');
                prevLi.className = `page-item ${current === 1 ? 'disabled' : ''}`;
                prevLi.innerHTML = `<a class="page-link" href="#" data-page="${current - 1}">Previous</a>`;
                paginationUl.appendChild(prevLi);

                // Liens des pages (générons 5 liens pour l'exemple)
                for (let i = 1; i <= total; i++) {
                    const li = document.createElement('li');
                    li.className = `page-item ${current === i ? 'active' : ''}`;
                    li.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
                    paginationUl.appendChild(li);
                }

                // Bouton Suivant
                const nextLi = document.createElement('li');
                nextLi.className = `page-item ${current === total ? 'disabled' : ''}`;
                nextLi.innerHTML = `<a class="page-link" href="#" data-page="${current + 1}">Next</a>`;
                paginationUl.appendChild(nextLi);
            }


            /**
             * 5. Gestionnaire d'événements pour la pagination.
             */
            function setupPaginationListener() {
                paginationUl.addEventListener('click', (event) => {
                    event.preventDefault();
                    const target = event.target.closest('.page-link');

                    if (target) {
                        const newPage = parseInt(target.dataset.page);

                        // Vérifie que la page est valide et différente de la page actuelle
                        if (!isNaN(newPage) && newPage !== currentPage) {
                            loadPage(newPage);
                        }
                    }
                });
            }
            searchInput.addEventListener('input', filter);
            loadPage(currentPage);
            setupPaginationListener(); 
        });
