function scrape(index) {
    let accordion = document.getElementsByClassName("accordion")[0];
    let afdelinger = accordion.getElementsByClassName("accordion__item");

    let ansatte = [];

    for (const afdeling of afdelinger) {
        let afdelingstitel = afdeling.getElementsByClassName("accordion__title")[0].innerText;

        let rækker = afdeling.getElementsByTagName("tr");

        for (const række of rækker) {
            let info = række.children[1].innerText;
            info = info.split("\n");
            info = info.filter(s => s); //Remove empty strings

            if (info.length < 2) {
                continue;
            }

            let navn = info[0];
            let job = info[1];

            //If it's an email
            if (job.includes("@")) {
                job = "Jedi";
            }

            //Billede
            let fileName;
            let billedeContainer = række.children[0];
            let billeder = billedeContainer.getElementsByTagName("img");

            for (const billed of billeder) {
                if (billed.width > 0) {
                    fileName = billed.src.replace(/(^.*\/)|(\?.*)/g, '');
                    downloadImage(billed.src, fileName);
                }
            }

            //Output
            let person = {
                "Navn": navn,
                "Stilling": job,
                "Afdeling": afdelingstitel,
                "image": `images/${fileName}`
            }

            ansatte.push(person);
        }
    }

    return ansatte;
}

async function downloadImage(imageSrc, name) {
    const image = await fetch(imageSrc)
    const imageBlog = await image.blob()
    const imageURL = URL.createObjectURL(imageBlog)

    const link = document.createElement('a')
    link.href = imageURL
    link.download = name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    sleep(100);
}

function sleep(milliseconds) {
    let timeStart = new Date().getTime();
    while (true) {
        let elapsedTime = new Date().getTime() - timeStart;
        if (elapsedTime > milliseconds) {
            break;
        }
    }
}