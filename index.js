const PICTURE_COUNTER = document.getElementById('stat-pictures');
const PROJECT_ROOT = './projects';

const swiper = new Swiper(".swiper-container", {
    pagination: {
        el: '.swiper-pagination',
        clickable: true
    }
})

emailjs.init({
    publicKey: 'OCROOLuuSFU5X3pgG'
});

const fetchDirectoryContent = async (directory) => {
    try {
        const response = await fetch(directory);
        return await response.text();
    } catch (error) {
        console.error('Error fetching directory content:', error);
    }
}

const parseDirectoryContnet = async (directory) => {
    const directoryContent = await fetchDirectoryContent(directory);
    const parser = new DOMParser();
    const htmlDocument = parser.parseFromString(directoryContent, 'text/html');
    const qDirs = Array.from(htmlDocument.querySelectorAll(`ul a[href*="/"]:not([href$="/"]):not([href="${PROJECT_ROOT.substring(1, PROJECT_ROOT.length)}"]).icon-directory`))
    const dirs = qDirs.map(dir => dir.getAttribute('href'));
    let images = [];
    for (const dir of dirs) {
        images = images.concat(await parseDirectoryContnet(dir));
    }

    const qImages = Array.from(htmlDocument.querySelectorAll('a.icon-image'));
    return images.concat(qImages.map(image => image.getAttribute('href')));
}

const main = async () => {
    const imageFiles = await parseDirectoryContnet(PROJECT_ROOT);
    PICTURE_COUNTER.textContent = imageFiles.length;
}

window.onload = () => {
    document.getElementById('contact-form').addEventListener('submit', function(event) {
        event.preventDefault();
        // these IDs from the previous steps
        emailjs.sendForm('service_7gnpytp', 'template_2i76qkr', this)
            .then(() => {
                console.log('SUCCESS!');
            }, (error) => {
                console.log('FAILED...', error);
            });
    });

    main();
}