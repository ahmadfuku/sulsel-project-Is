import FuncClass from "./system/function.js";
import { Bxystore } from "./scraper/provider/bxystore.js";
import { Digiflazz } from "./scraper/provider/digiflazz.js";
import { GameZoneShop } from "./scraper/provider/gamezoneshop.js";
import { MedanPedia } from "./scraper/provider/medanpedia.js";
import { SmmNusantara } from "./scraper/provider/smmnusantara.js";

const { fetchJson } = new FuncClass();

export async function getBxystoreProducts() {
    if (!Bxystore || !global.bxystorekey?.apikey) return [];

    try {
        const bxystoreApi = new Bxystore(global.bxystorekey.apikey);
        const services = await bxystoreApi.getServices();
        return services?.data || [];
    } catch {
        return [];
    }
}

export async function getDigiflazzProducts() {
    if (!global.digiflazzkey?.username || !global.digiflazzkey?.production) return [];

    const digiflazzApi = new Digiflazz(global.digiflazzkey.username, global.digiflazzkey.production);
    const [prepaidProducts, pascaProducts] = await Promise.all([
        digiflazzApi.price("prepaid"),
        digiflazzApi.price("pasca")
    ]);

    return [...(prepaidProducts || []), ...(pascaProducts || [])];
}

export async function getGameZoneShopProducts() {
    if (!GameZoneShop || !global.gamezoneshopkey?.apikey) return [];

    const gameZone = new GameZoneShop(global.gamezoneshopkey.apikey);
    const services = await gameZone.service();
    return services?.data || [];
}

export async function getMedanPediaProducts() {
    if (!MedanPedia || !global.medanpediakey?.apiid || !global.medanpediakey?.apikey) return [];

    const smmApi = new MedanPedia(global.medanpediakey.apiid, global.medanpediakey.apikey);
    return (await smmApi.price())?.data || [];
}

export async function getOkeConnectProducts() {
    if (!fetchJson) return [];
    return await fetchJson("https://okeconnect.com/harga/json?id=905ccd028329b0a") || [];
}

export async function getSmmNusantaraProducts() {
    if (!SmmNusantara || !global.smmnusantarakey?.apiid || !global.smmnusantarakey?.apikey) return [];

    const smmApi = new SmmNusantara(global.smmnusantarakey.apiid, global.smmnusantarakey.apikey);
    return (await smmApi.price())?.services || [];
}