document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('link_search_input');

    searchInput.addEventListener('keyup', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        
        const linksContainer = document.getElementById('links_container');
        const allLinks = linksContainer.querySelectorAll('.element_URL_subdiv');

        allLinks.forEach(linkElement => {
            const longURLParagraph = linkElement.querySelector('.long_link_URL');
            
            if (longURLParagraph) {
                const longURL = longURLParagraph.textContent.toLowerCase();

                if (longURL.includes(searchTerm)) {
                    linkElement.style.display = 'flex';
                    
                    const crudElement = linkElement.nextElementSibling;
                    if (crudElement && crudElement.classList.contains('element_CRUD_subdiv')) {
                        crudElement.style.display = 'flex';
                    }
                    
                } else {
                    linkElement.style.display = 'none';
                    
                    const crudElement = linkElement.nextElementSibling;
                    if (crudElement && crudElement.classList.contains('element_CRUD_subdiv')) {
                        crudElement.style.display = 'none';
                    }
                }
            }
        });
    });
});