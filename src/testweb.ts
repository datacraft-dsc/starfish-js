import DirectPurchase from "./sg/dex/starfish/DirectPurchase";
import MetamaskProviderWeb from "./sg/dex/starfish/Providers/MetamaskProviderWeb";
let directPurchase;

async function start(e:Event) {
    const publisher = getPublisher();
    if(!publisher)
      return;

    const reference = getReference();
    if(!reference)
      return;

    if(!directPurchase) {
      let mematamskProviderWeb = new MetamaskProviderWeb();
      directPurchase = new DirectPurchase(mematamskProviderWeb);
    }

    await directPurchase.subscribe(publisher, reference, document.getElementById("events"));
    const tokenNumber = 100000;
    let txReceipt = await directPurchase.sendTokenAndLog(
      publisher,
      tokenNumber,
      reference,
      reference
    );
    alert(txReceipt.transactionHash);
}

function getPublisher(){
    const publisher = document.getElementById("publisher");
    const value = publisher['value'];
    if (!value)
      alert("Empty publisher");
    return value;
}

function getReference(){
    const reference = document.getElementById("reference");
    const value = reference['value'];
    if (!value)
      alert("Empty reference");
    return value;
}

async function stop(e:Event) {
  await directPurchase.shutdown();
}

window.addEventListener('load', function() {
    var startBtn = window.document.getElementById("startBtn");
    startBtn.addEventListener("click", (e:Event) => start(e));
    var stopBtn = window.document.getElementById("stopBtn");
    stopBtn.addEventListener("click", (e:Event) => stop(e));
})