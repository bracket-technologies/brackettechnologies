module.exports = async () => {

    var Cookie = "JSESSIONID=_QblJ9MAJWkTAmrrEx5RAOeLwo62kf5lU9A9wKyi.server04"
    var uuid = "bfa58feb-3eb7-4d92-8035-7226e11b6abp"
    var pnr = "N9HIUR"
    var passportNumber = "R12345671"
    var travelDate = "29/05/2022"
    var from = "BEY"
    var to = "BGW"
    var firstName = "Merci"
    var lastName = "Papa Nowel"
    var paxType = "ADT"
    var passportExpiryDate = "16/05/2027"
    var dob = "02/05/1991"
    var gender = "F"
    /*
    await require("fs").writeFileSync(`flybaghdad/bookingStatus.json`, JSON.stringify({
        login: true
    }, null, 2))

    var { data } = await require("axios").post("https://booking.flybaghdad.net/agent/login", "j_username=hiba&username=IF%3AHIBA&password=vESOloeXC7WwAhdN4DfjPQ%3D%3D+046157e6e870dd128e1dfac45c0a4c74+1ecde3995f10343b88f7e192cc153037&captcha=&language=en&carrierID=10&carrierCode=IF", {
        timeout: 1000 * 10,
        headers: {
            "Origin": "https://booking.flybaghdad.net",
            "Referer": "https://booking.flybaghdad.net/agent/booking",
            Cookie,
            "Host": "booking.flybaghdad.net",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin"
        }
    })
    await require("fs").writeFileSync(`flybaghdad/login.json`, JSON.stringify(data, null, 2))
    */
    await require("fs").writeFileSync(`flybaghdad/bookingStatus.json`, JSON.stringify({
        login: false,
        endLogin: true,
        search: true
    }, null, 2))

    var { data } = await require("axios").post("https://booking.flybaghdad.net/agent/availability/search", {
        "rand": "2022-05-25T12:53:16.150Z",
        uuid,
        "searchRequestContext": {
            "modifyBookingContext": false,
            "opnRtnFareSearch": false,
            "opnRtnConfirmationSearch": false
        },
        "travelPaxInfo": {
            "adultCount": 1,
            "infantCount": 0,
            "paxQuantities": {
                "ADT": "1"
            }
        },
        "availabilitySearchType": "OW",
        "pqPref": {
            "preferredCurrencyCode": "USD",
            "salesTypePref": "MIX"
        },
        "searchedOnDInfos": [
            {
                "sequence": 1,
                "origin": {
                    "airportCodes": [
                        from
                    ],
                    "code": from,
                    "isAirport": true
                },
                "destination": {
                    "airportCodes": [
                        to
                    ],
                    "code": to,
                    "isAirport": true
                },
                "airlineID": 10,
                "selectedDepDateStr": travelDate,
                "depDayVariance": "PlusMinusOneDay",
                "advanceRoutingCode": "",
                "cabinClassCode": null
            }
        ],
        "posInfo": null,
        "searchBehaviour": {
            "sameFareProductPerOnd": false,
            "quotePriceForAllJourneys": false
        }
    }, {
        timeout: 1000 * 10,
        headers: {
            "Origin": "https://booking.flybaghdad.net",
            "Referer": "https://booking.flybaghdad.net/agent/booking",
            Cookie,
            "Host": "booking.flybaghdad.net",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin"
        }
    })
    await require("fs").writeFileSync(`flybaghdad/search.json`, JSON.stringify(data, null, 2))
    
    await require("fs").writeFileSync(`flybaghdad/bookingStatus.json`, JSON.stringify({
        login: false,
        endLogin: true,
        search: false,
        endSearch: true,
        ancillarySearch: true
    }, null, 2))

    var { data } = await require("axios").post("https://booking.flybaghdad.net/agent/ancillaryAvailability/ancillarySearch", {
        uuid,
        "bookingPaxTypes": [
            paxType
        ],
        "rand": "2022-05-25T08:41:08.654Z",
        "transferSegmentSearch": false
    }, {
        timeout: 1000 * 10,
        headers: {
            "Origin": "https://booking.flybaghdad.net",
            "Referer": "https://booking.flybaghdad.net/agent/booking",
            Cookie,
            "Host": "booking.flybaghdad.net",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin"
        }
    })
    await require("fs").writeFileSync(`flybaghdad/ancillarySearch.json`, JSON.stringify(data, null, 2))
    
    await require("fs").writeFileSync(`flybaghdad/bookingStatus.json`, JSON.stringify({
        login: false,
        endLogin: true,
        search: false,
        endSearch: true,
        ancillarySearch: false,
        endAncillarySearch: true,
        seatMapDetails: true
    }, null, 2))

    var { data } = await require("axios").post("https://booking.flybaghdad.net/agent/ancillaryAvailability/seatMapDetails", {
        uuid,
        "bookingPaxTypes": [
            paxType
        ],
        "flightTypes": {
            "45546": "INT"
        },
        "transferSegmentSearch": false,
        "paxDetailsDTOList": [
            {
                "dob": dob,
                "gender": gender,
                "lastName": lastName,
                "sequence": 0,
                "firstName": firstName,
                "psptNumber": passportNumber,
                "nationality": "487",
                "psptExpiryDate": passportExpiryDate,
                "psptIssuedCountry": "636",
                "ffpNumber": null,
                "airlineID": 10,
                "paxType": paxType,
                "paxIndex": 0
            }
        ],
        "rand": "2022-05-25T09:03:23.478Z"
    }, {
        timeout: 1000 * 10,
        headers: {
            "Origin": "https://booking.flybaghdad.net",
            "Referer": "https://booking.flybaghdad.net/agent/booking",
            Cookie,
            "Host": "booking.flybaghdad.net",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin"
        }
    })
    await require("fs").writeFileSync(`flybaghdad/seatMapDetails.json`, JSON.stringify(data, null, 2))
    
    await require("fs").writeFileSync(`flybaghdad/bookingStatus.json`, JSON.stringify({
        login: false,
        endLogin: true,
        search: false,
        endSearch: true,
        ancillarySearch: false,
        endAncillarySearch: true,
        seatMapDetails: false,
        endSeatMapDetails: true,
        paymentDetails: true
    }, null, 2))

    var { data } = await require("axios").post("https://booking.flybaghdad.net/agent/payment/paymentDetails", {
        uuid,
        "currency": "USD",
        "operation": "CREATE_BOOKING",
        "firstFltSegOwnedByCarrier": "IF"
    }, {
        timeout: 1000 * 10,
        headers: {
            "Origin": "https://booking.flybaghdad.net",
            "Referer": "https://booking.flybaghdad.net/agent/booking",
            Cookie,
            "Host": "booking.flybaghdad.net",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin"
        }
    })
    await require("fs").writeFileSync(`flybaghdad/paymentDetails.json`, JSON.stringify(data, null, 2))
 
    var flightSegId = "45546"
    var price = require("../flybaghdad/search.json").result.priceQuote.perPaxTotal.paxPrice.ADT
    var flightID = require("../flybaghdad/search.json").result.availableFltSegments[flightSegId][0].flightID
    var airlineID = require("../flybaghdad/search.json").result.availableFltSegments[flightSegId][0].airlineID
    var departureDateLocalStr = require("../flybaghdad/search.json").result.availableFltSegments[flightSegId][0].departureDateLocalStr
    var departureDateUTCStr = require("../flybaghdad/search.json").result.availableFltSegments[flightSegId][0].departureDateUTCStr
    var segmentCode = require("../flybaghdad/search.json").result.availableFltSegments[flightSegId][0].segmentCode
    
    await require("fs").writeFileSync(`flybaghdad/bookingStatus.json`, JSON.stringify({
        login: false,
        endLogin: true,
        search: false,
        endSearch: true,
        ancillarySearch: false,
        endAncillarySearch: true,
        seatMapDetails: false,
        endSeatMapDetails: true,
        paymentDetails: false,
        endPaymentDetails: true,
        bookingcreation: true,
        data: {
            flightSegId,
            price,
            flightID,
            airlineID,
            departureDateLocalStr,
            departureDateUTCStr,
            segmentCode
        }
    }, null, 2))
    
    var { data } = await require("axios").post("https://booking.flybaghdad.net/agent/bookingcreation/create", {
        uuid,
        "localForeign": "ANY",
        "ancillaryRequest": {
            "ssrRequests": {},
            "mealRequests": {},
            "seatRequests": {},
            "baggageRequest": {}
        },
        "sendItineraryNotification": false,
        "sendSmsNotification": false,
        "itineraryLanguage": "",
        "sendEmailPerPax": false,
        "sendEticket": false,
        "firstFlightSegmentOperatingCarrier": "IF",
        "agentSalesUserId": null,
        "deliveryMethods": [
            "EMAIL"
        ],
        "bookingCurrencyCode": "USD",
        "bookingPreference": {
            "timeLimit": true,
            "timeLimitAmend": false,
            "releaseTimeStr": "25/05/2022 13:22"
        },
        "bookingContactInfo": {
            "telephone": "",
            "mobile": "+961-01123456",
            "email": "test@gmail.com",
            "secondaryEmail": ""
        },
        "priceQuoteRequest": {
            "rand": "2022-05-25T08:20:38.136Z",
            uuid,
            "searchRequestContext": {
                "modifyBookingContext": false,
                "opnRtnFareSearch": false,
                "opnRtnConfirmationSearch": false
            },
            "travelPaxInfo": {
                "adultCount": 1,
                "infantCount": 0,
                "paxQuantities": {
                    [paxType]: "1"
                }
            },
            "availabilitySearchType": "OW",
            "pqPref": {
                "preferredCurrencyCode": "USD",
                "salesTypePref": "MIX",
                "fareRuleAgentDiscountInfo": null
            },
            "searchedOnDInfos": [
                {
                    "sequence": 1,
                    "origin": {
                        "airportCodes": [
                            from
                        ],
                        "code": from,
                        "isAirport": true
                    },
                    "destination": {
                        "airportCodes": [
                            to
                        ],
                        "code": to,
                        "isAirport": true
                    },
                    airlineID,
                    "selectedDepDateStr": travelDate,
                    "depDayVariance": "PlusMinusOneDay",
                    "advanceRoutingCode": "",
                    "cabinClassCode": null,
                    "fareProductMap": {},
                    "rbdIDMap": {
                        [segmentCode]: "832"
                    },
                    "selectedFlightList": [
                        {
                            flightId: flightID,
                            flightSegId
                        }
                    ]
                }
            ],
            "posInfo": null,
            "searchBehaviour": {
                "sameFareProductPerOnd": false,
                "quotePriceForAllJourneys": false
            },
            "currentPerPaxTotal": {
                [paxType]: price
            }
        },
        "blockRequest": {
            uuid,
            "nonBlockingFltSegIds": [],
            "deferBlockingFltSegIDs": []
        },
        "passengers": [
            {
                "sequence": 1,
                "paxType": paxType,
                "additionalInfo": {
                    "passportNumber": passportNumber,
                    "passportCountryID": 636,
                    "passportExpiryDateStr": passportExpiryDate
                },
                "passengerTitleID": "41",
                "firstName": firstName,
                "lastName": lastName,
                "dateOfBirthStr": dob,
                "gender": gender,
                "nationalityID": 502,
                "totalAmount": price
            }
        ],
        "bookingNotes": [],
        "flightDetails": [
            {
                "flightDesignator": "IF302",
                "departureCode": from,
                "arrivalCode": to,
                departureDateLocalStr,
                segmentCode,
                departureDateUTCStr,
                "operatedCarrier": "IF"
            }
        ],
        "searchUuid": uuid,
        pnr,
        "firstFlightDepDateTime": departureDateUTCStr
    }, {
        timeout: 1000 * 10,
        headers: {
            "Origin": "https://booking.flybaghdad.net",
            "Referer": "https://booking.flybaghdad.net/agent/booking",
            Cookie,
            "Host": "booking.flybaghdad.net",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin"
        }
    })
    await require("fs").writeFileSync(`flybaghdad/bookingcreation.json`, JSON.stringify(data, null, 2))
    
    await require("fs").writeFileSync(`flybaghdad/bookingStatus.json`, JSON.stringify({
        login: false,
        endLogin: true,
        searching: false,
        endSearch: true,
        ancillarySearch: false,
        endAncillarySearch: true,
        seatMapDetails: false,
        endSeatMapDetails: true,
        paymentDetails: false,
        endPaymentDetails: true,
        bookingcreation: false,
        data: {
            flightSegId,
            price,
            flightID,
            airlineID,
            departureDateLocalStr,
            departureDateUTCStr,
            segmentCode
        },
        endBookingcreation: true
    }, null, 2))
}