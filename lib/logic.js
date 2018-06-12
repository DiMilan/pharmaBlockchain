/*
 here comes the smart contract
 */

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

/* global getParticipantRegistry getAssetRegistry getFactory */

/**
 * A shipment has been received by an importer
 * @param {org.howest.pharma.ShipmentReceived} shipmentReceived - the ShipmentReceived transaction
 * @transaction
 */
async function payOut(shipmentReceived) {  // eslint-disable-line no-unused-vars

    const contract = shipmentReceived.shipment.contract;
    const shipment = shipmentReceived.shipment;
    let payOut = contract.unitPrice * shipment.unitCount;

    console.log('Received at: ' + shipmentReceived.timestamp);
    console.log('Contract arrivalDateTime: ' + contract.arrivalDateTime);

    // set the status of the shipment
    shipment.status = 'ARRIVED';

    console.log('Payout: ' + payOut);
    contract.manufacturer.accountBalance += payOut;
    contract.wholeseller.accountBalance -= payOut;

    console.log('Manufacturer: ' + contract.manufacturer.$identifier + ' new balance: ' + contract.manufacturer.accountBalance);
    console.log('Wholeseller: ' + contract.wholeseller.$identifier + ' new balance: ' + contract.wholeseller.accountBalance);

    // update the manufacturers balance
    const manufacturerRegistry = await getParticipantRegistry('org.howest.pharma.Manufacturer');
    await manufacturerRegistry.update(contract.manufacturer);

    // update the wholeseller's balance
    const wholesellerRegistry = await getParticipantRegistry('org.howest.pharma.Wholeseller');
    await wholesellerRegistry.update(contract.wholeseller);

    // update the state of the shipment
    const shipmentRegistry = await getAssetRegistry('org.howest.pharma.Shipment');
    await shipmentRegistry.update(shipment);
}

