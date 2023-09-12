const { test, expect } = require('@playwright/test');
import { MercadolibrePage } from '../pages/MercadolibrePage';

test('Mercadolibre prices', async ({ page }) => {

  const mercadolibre = new MercadolibrePage(page);
  let products = [];

  await page.goto(mercadolibre.url);

  await page.click(mercadolibre.searchBar);
  await page.fill(mercadolibre.searchBar, "camisetas");
  await page.click(mercadolibre.findBtn);

  for (let i = 0; i <= 2; i++) {
    await page.waitForURL("**/camisetas**", { waitUntil: 'domcontentloaded' })
    let productsPage = await mercadolibre.getInfo();
    products = products.concat(productsPage);
    await page.click(mercadolibre.nextBtn);
  }

  await mercadolibre.writeFile(products);
});
