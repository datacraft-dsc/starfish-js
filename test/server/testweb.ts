import { Network } from "./starfish/Network";
import { MetamaskProviderWeb } from "./starfish/Provider/MetamaskProviderWeb";
// let directPurchase;

async function start(e:Event) {
    const publisher = getPublisher();
    if (!publisher) {
        return;
    }
    alert(publisher)

    const toAddress = getToAddress();
    if (!toAddress) {
        return;
    }
    alert(toAddress)

    const reference = getReference();
    if (!reference) {
        return;
    }
    alert(reference)

    const mematamskProviderWeb = new MetamaskProviderWeb();
    const network = Network.getInstance(mematamskProviderWeb);

    console.log(network);
//    await directPurchase.subscribe(publisher, reference, document.getElementById("events"));
//    const amount = 1;

/*
    let txReceipt = await network.sendTokenWithLog(
      publisher,
      toAddress,
      amount,
      reference,
      reference
    );
*/
    // alert(txReceipt.transactionHash);
}

function getPublisher(){
    const publisher = document.getElementById("publisher");
    const value = publisher['value'];
    if (!value) {
        alert("Empty publisher");
    }
    return value;
}

function getToAddress() {
    const toAddress = document.getElementById('toAddress');
    const value = toAddress['value'];
    if (!value) {
        alert('Empty toAddress');
    }
    return value;
}
function getReference(){
    const reference = document.getElementById("reference");
    const value = reference['value'];
    if (!value) {
        alert("Empty reference");
    }
    return value;
}


async function stop(e:Event) {
  // await directPurchase.shutdown();
}



window.addEventListener('load', function() {
    var startBtn = window.document.getElementById("startBtn");
    startBtn.addEventListener("click", (e:Event) => start(e));
    var stopBtn = window.document.getElementById("stopBtn");
    stopBtn.addEventListener("click", (e:Event) => stop(e));
})

