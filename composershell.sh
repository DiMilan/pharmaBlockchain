#!bin/bash

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{  
   "$class": "org.howest.pharma.Manufacturer",  
   "email": "Eline.Snyers@howest.be",  
   "address": {  
     "$class": "org.howest.pharma.Address",  
     "city": "string",  
     "country": "Belgie",  
     "street": "string",  
     "zip": "string"  
   },  
   "accountBalance": 100  
 }' 'http://localhost:3000/api/Manufacturer'

curl -X GET --header 'Accept: application/json' 'http://localhost:3000/api/Manufacturer'

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{  
   "$class": "org.howest.pharma.WholeSeller",  
   "email": "Milan.Dima@howest.be",  
   "address": {  
     "$class": "org.howest.pharma.Address",  
     "city": "string",  
     "country": "Belgie",  
     "street": "string",  
     "zip": "string"  
   },  
   "accountBalance": 100  
 }' 'http://localhost:3000/api/WholeSeller'
curl -X GET --header 'Accept: application/json' 'http://localhost:3000/api/WholeSeller'

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{  
   "$class": "org.howest.pharma.Pharmacist", 
   "email": "Stefaan.Snyers@howest.be",  
   "address": {  
     "$class": "org.howest.pharma.Address",  
     "city": "string",  
     "country": "Belgie",  
     "street": "string",  
     "zip": "string"  
   },  
   "accountBalance": 100  
 }' 'http://localhost:3000/api/Pharmacist'

curl -X GET --header 'Accept: application/json' 'http://localhost:3000/api/Pharmacist'
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{  
   "$class": "org.howest.pharma.Patient",  
   "email": "Jo.Vercammen@howest.be",  
   "address": {  
     "$class": "org.howest.pharma.Address",  
     "city": "string",  
     "country": "Belgie",  
     "street": "string",  
     "zip": "string"  
   },  
   "accountBalance": 100  
 }' 'http://localhost:3000/api/Patient'
curl -X GET --header 'Accept: application/json' 'http://localhost:3000/api/Patient'
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{  
   "$class": "org.howest.pharma.Contract",  
   "contractId": "1",  
   "unitPrice": 20,  
   "manufacturer": "org.howest.pharma.Manufacturer#Eline.Snyers%40howest.be",  
   "wholeseller": "org.howest.pharma.WholeSeller#Milan.Dima%40howest.be",  
   "pharmacist": "org.howest.pharma.Pharmacist#Stefaan.Snyers%40howest.be",  
   "patient": "org.howest.pharma.Patient#Jo.Vercammen%40howest.be",  
   "arrivalDateTime": "2018-06-15T18:20:55.636Z"  
 }' 'http://localhost:3000/api/Contract'

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{  
   "$class": "org.howest.pharma.CreateProduct", 
   "serialNumber": "210",  
   "productCode": "102",  
   "batchNumber": "30",  
   "manufacturer": "org.howest.pharma.Manufacturer#Eline.Snyers%40howest.be"}' 'http://localhost:3000/api/CreateProduct'

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{  
   "$class": "org.howest.pharma.Shipment", 
   "shipmentId": "1",  
   "product": "org.howest.pharma.Product#210",  
   "status": "CREATED",  
   "unitCount": 10,  
   "contract": "org.howest.pharma.Contract#1",  
   "trace": []  
 }' 'http://localhost:3000/api/Shipment'

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ 7{ 
   "$class": "org.howest.pharma.Verify",  
   "product": "org.howest.pharma.Product#210",  
   "transactionId": "string", 
   "timestamp": "2018-06-15T18:20:56.414Z"  
 }' 'http://localhost:3000/api/Verify'
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{  
   "$class": "org.howest.pharma.ShipmentReceivedWholeseller",  
   "shipment": "org.howest.pharma.Shipment#1"}' 'http://localhost:3000/api/ShipmentReceivedWholeseller'

curl -X GET --header 'Accept: application/json' 'http://localhost:3000/api/ShipmentReceivedWholeseller'
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ 7{ 
   "$class": "org.howest.pharma.Verify",  
   "product": "org.howest.pharma.Product#210",  
   "transactionId": "string", 
   "timestamp": "2018-06-15T18:20:56.414Z"  
 }' 'http://localhost:3000/api/Verify'
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ 
   "$class": "org.howest.pharma.ShipmentReceivedPharmacist", 
   "shipment": "org.howest.pharma.Shipment#1"
 }' 'http://localhost:3000/api/ShipmentReceivedPharmacist'

curl -X GET --header 'Accept: application/json' 'http://localhost:3000/api/ShipmentReceivedPharmacist'
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ 7{ 
   "$class": "org.howest.pharma.Verify",  
   "product": "org.howest.pharma.Product#210",  
   "transactionId": "string", 
   "timestamp": "2018-06-15T18:20:56.414Z"  
 }' 'http://localhost:3000/api/Verify'
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{  
   "$class": "org.howest.pharma.ShipmentReceivedPatient",  
   "shipment": "org.howest.pharma.Shipment#1"
   }' 'http://localhost:3000/api/ShipmentReceivedPatient'
curl -X GET --header 'Accept: application/json' 'http://localhost:3000/api/ShipmentReceivedPatient'
