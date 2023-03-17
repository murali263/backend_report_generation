const puppeteer = require('puppeteer');

const hbs = require('handlebars')

const fs = require('fs-extra')

const path = require('path')

const data = require('./data.json')

const compile = async function (templateName,data){
    const filePath = path.join(process.cwd(),'templates',`${templateName}.hbs`)

    const html = await fs.readFile(filePath,'utf8')
    return hbs.compile(html)(data)
};

(async function() {
    try{
        const browser = await puppeteer.launch()

        const page = await browser.newPage()

        const content = await compile('index',data)

        await page.setContent(content);
        await page.addStyleTag(
            {'content':'@page{size:A4 landscape}'}
        )
        // await page.setViewport({
        //     width: 1080,
        //     height: 1600,
        //     deviceScaleFactor: 1,
        //     isLandscape: true
        // });
     
        await page.pdf({
            path:'report.pdf',
            format:'A4',
            // pageRanges:1,
            omitBackground:true,
            preferCSSPageSize:true,
            printBackground:true,
            height:'14cm',
            scale:1,
            margin: {
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px'
            },
        })

        console.log("done creating pdf")

        await browser.close()

        process.exit()

    }catch(e){
        console.log(e)
    }
})();