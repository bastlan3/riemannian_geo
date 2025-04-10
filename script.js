document.addEventListener('DOMContentLoaded', () => {
    // Fetch the JSON data from the file
    fetch('riemannian_geometry.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // Parse the JSON response
        })
        .then(data => {
            renderContent(data); // Call function to build HTML
        })
        .catch(error => {
            console.error("Could not fetch or parse JSON:", error);
            // Display an error message to the user
            const container = document.getElementById('content-container');
            container.innerHTML = `<p style="color: red;">Error loading content. Please try again later.</p>`;
        });
});

function renderContent(data) {
    const header = document.querySelector('header');
    const container = document.getElementById('content-container');

    // Render Title and Description
    if (data.title) {
        const titleElement = document.createElement('h1');
        titleElement.textContent = data.title;
        header.appendChild(titleElement);
    }
    if (data.description) {
        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = data.description;
        header.appendChild(descriptionElement);
    }

    // Iterate through the main sections (foundations, key_geometric_notions, etc.)
    for (const key in data) {
        // Skip title and description as they are handled already
        if (key === 'title' || key === 'description') continue;

        const sectionData = data[key];
        if (typeof sectionData === 'object' && sectionData !== null && sectionData.name) {
            const sectionElement = document.createElement('div');
            sectionElement.className = 'section';

            const sectionTitle = document.createElement('h2');
            sectionTitle.textContent = sectionData.name;
            sectionElement.appendChild(sectionTitle);

            // Handle regular item lists
            if (sectionData.items && Array.isArray(sectionData.items)) {
                const listElement = document.createElement('ul');
                sectionData.items.forEach(item => {
                    const listItem = document.createElement('li');
                    // Determine structure based on keys present in the item
                    if (item.term && item.explanation) {
                        listItem.innerHTML = `<strong>${item.term}</strong><p>${item.explanation}</p>`;
                        // Handle sub-items (like in Curvature)
                        if (item.sub_items && Array.isArray(item.sub_items)) {
                            const subList = document.createElement('ul');
                            subList.className = 'sub-items';
                            item.sub_items.forEach(subItem => {
                                const subListItem = document.createElement('li');
                                if (subItem.term && subItem.explanation) {
                                     subListItem.innerHTML = `<strong>${subItem.term}</strong><p>${subItem.explanation}</p>`;
                                }
                                subList.appendChild(subListItem);
                            });
                            listItem.appendChild(subList);
                        }
                    } else if (item.theorem && item.statement) {
                        listItem.innerHTML = `<strong>${item.theorem}</strong><p>${item.statement}</p>`;
                    } else if (item.area && item.description) {
                         listItem.innerHTML = `<strong>${item.area}</strong><p>${item.description}</p>`;
                    }
                    listElement.appendChild(listItem);
                });
                sectionElement.appendChild(listElement);
            }

            // Handle specific lists in 'learning_path'
            if (key === 'learning_path') {
                 if (sectionData.prerequisites && Array.isArray(sectionData.prerequisites)) {
                    const prereqDiv = document.createElement('div');
                    prereqDiv.innerHTML = '<strong>Prerequisites:</strong>';
                    const prereqList = document.createElement('ul');
                    prereqList.className = 'prerequisites';
                    sectionData.prerequisites.forEach(prereq => {
                        const li = document.createElement('li');
                        li.textContent = prereq;
                        prereqList.appendChild(li);
                    });
                    prereqDiv.appendChild(prereqList);
                    sectionElement.appendChild(prereqDiv);
                }
                 if (sectionData.key_textbooks && Array.isArray(sectionData.key_textbooks)) {
                    const textbookDiv = document.createElement('div');
                    textbookDiv.innerHTML = '<strong>Key Textbooks:</strong>';
                    const textbookList = document.createElement('ul');
                    textbookList.className = 'key-textbooks';
                    sectionData.key_textbooks.forEach(book => {
                         const li = document.createElement('li');
                         li.textContent = book;
                         textbookList.appendChild(li);
                    });
                    textbookDiv.appendChild(textbookList);
                    sectionElement.appendChild(textbookDiv);
                }
                if (sectionData.note) {
                    const noteP = document.createElement('p');
                    noteP.innerHTML = `<em><strong>Note:</strong> ${sectionData.note}</em>`;
                    sectionElement.appendChild(noteP);
                }
            }

            container.appendChild(sectionElement);
        }
    }
}
