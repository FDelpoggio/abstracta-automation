exports.MercadolibrePage = class MercadolibrePage {
    constructor(page) {
        this.page = page
        this.url = 'https://www.mercadolibre.com.uy/'
        this.searchBar = "#cb1-edit"
        this.findBtn = "[aria-label='Buscar']"
        this.productsName = "a h2[class='ui-search-item__title shops__item-title']"
        this.productsPrices = "ol li span[class='andes-money-amount ui-search-price__part shops__price-part ui-search-price__part--medium andes-money-amount--cents-superscript']"
        this.productsLinks = "div[class='ui-search-item__group ui-search-item__group--title shops__items-group'] a:nth-child(2)"
        this.nextBtn = "a[title='Siguiente']"
    }

    async getInfo() {
        let productsNames = await this.page.$$eval(this.productsName, elements => elements.map(ele => ele.innerText));

        let productsPrices = await this.page.$$eval(this.productsPrices, elements =>
            elements.map((ele) => {
                let priceArr = ele.innerText.replaceAll('.', '').split('\n');
                let price
                if (priceArr.length >= 4) {
                    price = `${priceArr[1]},${priceArr[2]}.${priceArr[4]}`;
                } else {
                    price = `${priceArr[1]},${priceArr[2]}`;
                }
                return price;
            }));

        let productsLinks = await this.page.$$eval(this.productsLinks, elements => elements.map(ele => ele.href));

        let products = [];
        productsNames.forEach((product, index) => {
            products.push(`${product},${productsPrices[index]},${productsLinks[index]}`)
        });

        return products;
    }

    async writeFile(products = []) {
        const fs = require('fs');
        let name = `./results/products-${Date.now()}.txt`
        await products.forEach(product => {
            fs.appendFileSync(name, `${product}\n`);
        })
    }
}