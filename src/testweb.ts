import DirectPurchase from "./sg/dex/starfish/DirectPurchase";
import MetamaskProviderWeb from "./sg/dex/starfish/Providers/MetamaskProviderWeb";
document.body.innerHTML = 'Hello Web';
let mematamskProviderWeb = new MetamaskProviderWeb();
let directPurchase = new DirectPurchase(mematamskProviderWeb);
directPurchase.shutdown();