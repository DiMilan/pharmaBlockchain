/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global getAssetRegistry getFactory emit */

/**
 * Sample transaction processor function.
 * @param {org.example.basic.SampleTransaction} tx The sample transaction instance.
 * @transaction
 */
'use strict';


/**
 * Create the drug asset
 * @param {org.howest.pharma.CreateProduct} createProduct
 * @transaction
 */
async function createProduct(drug){

const d = getFactory().newResource('org.howest.pharma', 'Product', drug.serialNumber);
    d.hash = sha256(drug.serialNumber+drug.productCode+drug.batchNumber+drug.manufacturer);
    d.serialNumber = drug.serialNumber;
    d.productCode = drug.productCode;
    d.manufacturer = drug.manufacturer;
    d.batchNumber= drug.batchNumber;
let factory = getFactory();
var newTrace = getFactory().newConcept('org.howest.pharma','TraceProduct');
    newTrace.timestamp = new Date();
    newTrace.product = d;
    newTrace.manufacturer = drug.manufacturer;
 
    // update the state of the shipment
if (d.trace) {
        d.trace.push(newTrace);
    } else {
        d.trace = [newTrace];
    }

    let createProductEvent = factory.newEvent('org.howest.pharma', 'CreateProductEvent');
  createProductEvent.product= d;
    emit(createProductEvent);
 


    const registry = await getAssetRegistry('org.howest.pharma.Product');
await registry.add(d);
}



/**
 * A shipment has been received by an importer
 * @param {org.howest.pharma.ShipmentReceivedWholeseller} shipmentReceivedWholeseller - the ShipmentReceived transaction
 * @transaction
 */
async function shipmentReceivedWholeseller(shipmentReceived) {  // eslint-disable-line no-unused-vars
 
  const contract = shipmentReceived.shipment.contract;
   const shipment = shipmentReceived.shipment;
   let payOut = contract.unitPrice * shipment.unitCount;
  if(shipment.product.status != 'QUARANTINE'){
  const shipmentRegistry = await getAssetRegistry('org.howest.pharma.Shipment');
 
    console.log('Received at: ' + shipmentReceived.timestamp);
    console.log('Contract arrivalDateTime: ' + contract.arrivalDateTime);

    // set the status of the shipment
    shipment.status = 'ARRIVED_WHOLESELLER';

    console.log('Payout: ' + payOut);
    contract.manufacturer.accountBalance += payOut;
    contract.wholeseller.accountBalance -= payOut;

    console.log('Manufacturer: ' + contract.manufacturer.$identifier + ' new balance: ' + contract.manufacturer.accountBalance);
   console.log('Wholeseller: ' + contract.wholeseller.$identifier + ' new balance: ' + contract.wholeseller.accountBalance);

    // update the manufacturers balance
    const manufacturerRegistry = await getParticipantRegistry('org.howest.pharma.Manufacturer');
    await manufacturerRegistry.update(contract.manufacturer);

   // update the wholeseller's balance
    const wholesellerRegistry = await getParticipantRegistry('org.howest.pharma.WholeSeller');
    await wholesellerRegistry.update(contract.wholeseller);
var newTrace = getFactory().newConcept('org.howest.pharma','Trace');
  newTrace.timestamp = new Date();
  newTrace.product = shipment.product;
  newTrace.seller = contract.manufacturer;
  newTrace.buyer = contract.wholeseller;
    // update the state of the shipment
if (shipment.trace) {
        shipment.trace.push(newTrace);
    } else {
        shipment.trace = [newTrace];
    }
 
    await shipmentRegistry.update(shipment);}}

/**
 * A shipment has been received by an importer
 * @param {org.howest.pharma.ShipmentReceivedPharmacist} shipmentReceivedPharmacist - the ShipmentReceived transaction
 * @transaction
 */
async function shipmentReceivedPharmacist(shipmentReceived) {  // eslint-disable-line no-unused-vars
 
  const contract = shipmentReceived.shipment.contract;
   const shipment = shipmentReceived.shipment;
  if(shipment.product.status != 'QUARANTINE'){
   let payOut = contract.unitPrice * shipment.unitCount;
  const shipmentRegistry = await getAssetRegistry('org.howest.pharma.Shipment');
    
    console.log('Received at: ' + shipmentReceived.timestamp);
    console.log('Contract arrivalDateTime: ' + contract.arrivalDateTime);

    // set the status of the shipment
    shipment.status = 'ARRIVED_PHARMACIST';

    console.log('Payout: ' + payOut);
    contract.wholeseller.accountBalance += payOut;
    contract.pharmacist.accountBalance -= payOut;

    console.log('Wholeseller: ' + contract.wholeseller.$identifier + ' new balance: ' + contract.wholeseller.accountBalance);
   console.log('Pharmacist: ' + contract.pharmacist.$identifier + ' new balance: ' + contract.pharmacist.accountBalance);

    // update the manufacturers balance
    const pharmacistRegistry = await getParticipantRegistry('org.howest.pharma.Pharmacist');
    await pharmacistRegistry.update(contract.pharmacist);

   // update the wholeseller's balance
    const wholesellerRegistry = await getParticipantRegistry('org.howest.pharma.WholeSeller');
    await wholesellerRegistry.update(contract.wholeseller);
var newTrace = getFactory().newConcept('org.howest.pharma','Trace');
  newTrace.timestamp = new Date();
  newTrace.product = shipment.product;
  newTrace.seller = contract.wholeseller;
  newTrace.buyer = contract.pharmacist;
    // update the state of the shipment
  shipment.trace.push(newTrace);
  
    await shipmentRegistry.update(shipment);}}


/**
 * A shipment has been received by an importer
 * @param {org.howest.pharma.ShipmentReceivedPatient} shipmentReceivedPatient - the ShipmentReceived transaction
 * @transaction
 */
async function shipmentReceivedPatient(shipmentReceived) {  // eslint-disable-line no-unused-vars
 
  const contract = shipmentReceived.shipment.contract;
   const shipment = shipmentReceived.shipment;
  if(shipment.product.status != 'QUARANTINE'){
   let payOut = contract.unitPrice * shipment.unitCount;
  const shipmentRegistry = await getAssetRegistry('org.howest.pharma.Shipment');
  
   
    console.log('Received at: ' + shipmentReceived.timestamp);
    console.log('Contract arrivalDateTime: ' + contract.arrivalDateTime);

    // set the status of the shipment
    shipment.status = 'ARRIVED_PATIENT';

    console.log('Payout: ' + payOut);
    contract.pharmacist.accountBalance += payOut;
    contract.patient.accountBalance -= payOut;

     console.log('Pharmacist: ' + contract.pharmacist.$identifier + ' new balance: ' + contract.pharmacist.accountBalance);
    console.log('Patient: ' + contract.patient.$identifier + ' new balance: ' + contract.patient.accountBalance);


    // update the manufacturers balance
    const pharmacistRegistry = await getParticipantRegistry('org.howest.pharma.Pharmacist');
    await pharmacistRegistry.update(contract.pharmacist);

   // update the patient's balance
    const patientRegistry = await getParticipantRegistry('org.howest.pharma.Patient');
    await patientRegistry.update(contract.patient);
var newTrace = getFactory().newConcept('org.howest.pharma','Trace');
  newTrace.timestamp = new Date();
  newTrace.product = shipment.product;
  newTrace.seller = contract.pharmacist;;
  newTrace.buyer = contract.patient;
    // update the state of the shipment
  
  shipment.trace.push(newTrace);
    await shipmentRegistry.update(shipment);}}
/**
 * Verify origne
 * @param {org.howest.pharma.Verify} verify
 * @transaction
 */
async function verify(productCheck) { // eslint-disable-line no-unused-vars
let hash = sha256(productCheck.product.serialNumber+productCheck.product.productCode+productCheck.product.batchNumber+productCheck.product.manufacturer)
  if(productCheck.product.hash !== hash)
  {
  productCheck.product.status = 'QUARANTINE';
  }
  let results = await query('selectShipment',{'product': 'resource:org.howest.pharma#'+productCheck.product});
  if(results.lenght> 1){
   productCheck.product.status = 'QUARANTINE';
  }
         const assetRegistry = await getAssetRegistry('org.howest.pharma.Product');
 
       await assetRegistry.update(productCheck.product);
 
}

var sha256 = function sha256(ascii) {
    function rightRotate(value, amount) {
        return (value>>>amount) | (value<<(32 - amount));
    };
  
    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var lengthProperty = 'length'
    var i, j; // Used as a counter across the whole file
    var result = ''

    var words = [];
    var asciiBitLength = ascii[lengthProperty]*8;
  
    //* caching results is optional - remove/add slash from front of this line to toggle
    // Initial hash value: first 32 bits of the fractional parts of the square roots of the first 8 primes
    // (we actually calculate the first 64, but extra values are just ignored)
    var hash = sha256.h = sha256.h || [];
    // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
    var k = sha256.k = sha256.k || [];
    var primeCounter = k[lengthProperty];
    /*/
    var hash = [], k = [];
    var primeCounter = 0;
    //*/

    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
            for (i = 0; i < 313; i += candidate) {
                isComposite[i] = candidate;
            }
            hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
            k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
        }
    }
  
    ascii += '\x80' // Append Ƈ' bit (plus zero padding)
    while (ascii[lengthProperty]%64 - 56) ascii += '\x00' // More zero padding
    for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i);
        if (j>>8) return; // ASCII check: only accept characters in range 0-255
        words[i>>2] |= j << ((3 - i)%4)*8;
    }
    words[words[lengthProperty]] = ((asciiBitLength/maxWord)|0);
    words[words[lengthProperty]] = (asciiBitLength)
  
    // process each chunk
    for (j = 0; j < words[lengthProperty];) {
        var w = words.slice(j, j += 16); // The message is expanded into 64 words as part of the iteration
        var oldHash = hash;
        // This is now the undefinedworking hash", often labelled as variables a...g
        // (we have to truncate as well, otherwise extra entries at the end accumulate
        hash = hash.slice(0, 8);
      
        for (i = 0; i < 64; i++) {
            var i2 = i + j;
            // Expand the message into 64 words
            // Used below if
            var w15 = w[i - 15], w2 = w[i - 2];

            // Iterate
            var a = hash[0], e = hash[4];
            var temp1 = hash[7]
                + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) // S1
                + ((e&hash[5])^((~e)&hash[6])) // ch
                + k[i]
                // Expand the message schedule if needed
                + (w[i] = (i < 16) ? w[i] : (
                        w[i - 16]
                        + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15>>>3)) // s0
                        + w[i - 7]
                        + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2>>>10)) // s1
                    )|0
                );
            // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
            var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) // S0
                + ((a&hash[1])^(a&hash[2])^(hash[1]&hash[2])); // maj
          
            hash = [(temp1 + temp2)|0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
            hash[4] = (hash[4] + temp1)|0;
        }
      
        for (i = 0; i < 8; i++) {
            hash[i] = (hash[i] + oldHash[i])|0;
        }
    }
  
    for (i = 0; i < 8; i++) {
        for (j = 3; j + 1; j--) {
            var b = (hash[i]>>(j*8))&255;
            result += ((b < 16) ? 0 : '') + b.toString(16);
        }
    }
    return result;
};

