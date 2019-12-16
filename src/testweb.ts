import DirectPurchase from "./sg/dex/starfish/DirectPurchase";
import MetamaskProviderWeb from "./sg/dex/starfish/Providers/MetamaskProviderWeb";

function start(e:Event) {
    let mematamskProviderWeb = new MetamaskProviderWeb();
    let directPurchase = new DirectPurchase(mematamskProviderWeb);
    directPurchase.shutdown();
}

window.addEventListener('load', function() {
    var myBtn = window.document.getElementById("myBtn");
    myBtn.addEventListener("click", (e:Event) => start(e));  
})