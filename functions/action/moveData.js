const { generate } = require("./generate")
const { postJsonFiles, removeJsonFiles } = require("./jsonFiles")

const moveData = (data) => {

    const fromFirebaseToLocalstore = () => {

        // doc is document name (__props__.doc) and is unique per collection

        // project id
        var accID = "f1m7R0f878N8V7g0c1w8W9u1C6"
        var bracketID = "K1x7d0l898q817C0w1W9c2j4d6"

        // use cases
        var accAccountID = "1197B078m8x8q4e9T5X949d858"
        var bracketAccountID = "k1A7R0N8X8Y8l7c030q8S8W7O3"
        var sessionID = "61Q7V0B8j8I887D0P1e8q9Y7C7"
        var obeidUserID = "41V7H078W8I8I780z1m9Y2E4Y2"
        var pluginID = "x1u7J0X8a8K8c7H0I14901G9B3"
        var subscriptionID = "81z7k0f878H897v0N1a8z9R9G7"
        var accBillingAccountID = "21w710Q828V8p7u0J1z9p0n3n7"
        var bracketTokenAccountID = "31v7G0g8u8O817H0Y0S9d1W0c0"
        var paymentMethodID = "F1A7q0r8T8l8o7C0K1v9Z0M629"
        var voucherID = "H1Q7f0a828R8d7d0Q060p1E5l2"
        var debitBracketAccountID = "a1W7x0t8a818j7n0B0P8I7n3V0"
        var creditAccBillingAccountTransactionID = "78RzUgdMSRNoXBTKCfD3"
        var debitAccBillingAccountTransactionID = "Jb01zikhk6B5gQcORcFC"
        var creditBracketTokenAccountTransactionID = "vPkyWcnarNF2gp4kOoqU"
        var debitBracketTokenAccountTransactionID = "wro8HuFn08gbek8KLM99"
        var encryptionKey = ""

        // project DB
        var bracketDB = "a1t7U0H8A8y877a0A1t9O05879"
        var accDB = "01I7C0K8W8X8h720t1U9P123p6"

        // collection KEY
        var bracketKEY = "d17770q8A8Z7l0Q0l031g188q9"
        var accKEY = "71j7R0d8Z8p7E0d0n081r1e854"

        // db per project, collection forAll projects (collections: ✓project, ✓account, ✓session, ✓user, ✓permission, ✓billingAccount, ✓paymentMethod, ✓exchangeRate)
        removeJsonFiles({ erase: { db: bracketDB } }); // ✓
        removeJsonFiles({ erase: { db: accDB } }); // ✓

        // collection per project
        removeJsonFiles({ erase: { db: "views" } }); // ✓(doc per view)
        removeJsonFiles({ erase: { db: "files" } }); // ✓(doc per file)

        removeJsonFiles({ erase: { db: "plugins" } }); // ✓(doc per plugin)
        removeJsonFiles({ erase: { db: "subscriptions" } }); // ✓(doc per subscription)
        removeJsonFiles({ erase: { db: "bills" } }); // ✓(doc per bill, bill per month per plugin)
        removeJsonFiles({ erase: { db: "vouchers" } }); // ✓payment, reciept, and transfer voucher (doc per voucher)
        removeJsonFiles({ erase: { db: "transactions" } }); // ✓(doc per transaction)
        removeJsonFiles({ erase: { db: "tokens" } }); // release 100,000 token/year on launch for Bracket Account (doc per token)
        removeJsonFiles({ erase: { db: "blocks" } }); // transaction of each token
        removeJsonFiles({ erase: { db: "usage" } }); // data usage per project (doc per day)

        // create projects
        (["acc", "brackettechnologies"]).map((doc, i) => {
            data.firebaseDB.collection("_project_").doc(doc).get().then(doc => {

                // docs.forEach(doc => postJsonFiles({ save: { data: doc.data(), collection: "_project_", doc: doc.id } }))
                var data = doc.data()
                data.__props__ = {
                    db: bracketDB,
                    collection: "project",
                    id: generate({ unique: true }),
                    creationDate: new Date().getTime(),
                    active: true,
                    createdBy: obeidUserID,
                    doc: data.name
                }

                // confidential: database access keys, publicID, and account ID
                data.publicID = doc.id === "acc" ? accID : bracketID
                data.accountID = doc.id === "acc" ? accAccountID : bracketAccountID
                data.dataDB = doc.id === "acc" ? accDB : bracketDB
                data.dataKEY = doc.id === "acc" ? accKEY : bracketKEY

                // project details
                data.subdomain = doc.id
                data.views = data.datastore.views
                data.collections = data.datastore.collections

                delete data["creation-date"]
                delete data.clooossseeed
                delete data.hezzzyawezzz
                delete data.functions
                delete data.datastore
                delete data.id

                postJsonFiles({ save: { data, collection: `${bracketDB}/project`, doc: data.__props__.doc } })
                createData(doc.id, data.database.collections)
            })
        });

        // create account
        const creatAccounts = () => {

            var data = {
                email: "ceo@brackettechnologies.com",
                __props__: {
                    db: bracketDB,
                    collection: "account",
                    id: bracketAccountID,
                    doc: "bracketAccount",
                    creationDate: new Date().getTime(),
                    active: true
                }
            }

            postJsonFiles({ save: { data, collection: `${bracketDB}/account`, doc: data.__props__.doc } })

            var data = {
                email: "acc@brackettechnologies.com",
                __props__: {
                    db: bracketDB,
                    collection: "account",
                    id: accAccountID,
                    doc: "accAccount",
                    creationDate: new Date().getTime(),
                    active: true
                }
            }

            postJsonFiles({ save: { data, collection: `${bracketDB}/account`, doc: data.__props__.doc } })
        }
        creatAccounts();

        // create billing account
        const createBillingAccounts = () => {

            // Bracket Account: start 0 TOKEN
            var data = {
                name: "Token",
                currency: "TOKEN",
                lastTransactionID: "",
                creditLimit: 0,
                paymentTerms: "Monthly",
                organizationName: "Bracket Technologies",
                country: "Lebanon",
                accountType: "Business",
                organizationAddress: "Hazmieh Village",
                languagePreference: "English",
                projectID: accID,
                accountID: accAccountID,
                __props__: {
                    db: bracketDB,
                    collection: "billingAccount",
                    id: accBillingAccountID,
                    doc: "TokenBillingAccount",
                    creationDate: new Date().getTime(),
                    createdBy: obeidUserID,
                    active: true
                }
            }

            postJsonFiles({ save: { data, collection: `${bracketDB}/billingAccount`, doc: data.__props__.doc } })

            // Bracket Account: start 100,000 TOKEN
            var data = {
                name: "Token",
                currency: "TOKEN",
                lastTransactionID,
                creditLimit: 0,
                paymentTerms: "Monthly",
                organizationName: "Bracket Technologies",
                country: "Lebanon",
                accountType: "Business",
                organizationAddress: "Hazmieh Village",
                languagePreference: "English",
                projectID: bracketID,
                accountID: bracketAccountID,
                __props__: {
                    db: bracketDB,
                    collection: "billingAccount",
                    id: bracketTokenAccountID,
                    doc: "BracketTokenAccount",
                    creationDate: new Date().getTime(),
                    createdBy: obeidUserID,
                    active: true
                }
            }

            postJsonFiles({ save: { data, collection: `${bracketDB}/billingAccount`, doc: data.__props__.doc } })
        }
        createBillingAccounts();

        // create billing account
        const createPaymentMethod = () => {

            const data = {
                name: "My Card",
                type: "Master Card",
                primary: true, // backup: true
                expiryMonth: "05",
                expiryYear: "31",
                cvc: "123",
                holderName: "Mohamad Baker Obeid",
                cardNumber: "1234 5678 9000 0000",
                addressLine1: "",
                addressLine2: "",
                city: "Beirut",
                postalCode: "12345",
                projectID: accID,
                accountID: accAccountID,
                __props__: {
                    db: bracketDB,
                    collection: "paymentMethod",
                    id: paymentMethodID,
                    doc: "PaymentMethod1",
                    creationDate: new Date().getTime(),
                    createdBy: obeidUserID,
                    active: true
                }
            }

            postJsonFiles({ save: { data, collection: `${bracketDB}/paymentMethod`, doc: data.__props__.doc } })
        }
        createPaymentMethod();

        // create acc users
        (["78RzUgdMSRNoXBTKCfD3", "Jb01zikhk6B5gQcORcFC", "vPkyWcnarNF2gp4kOoqU", "wro8HuFn08gbek8KLM99"]).map(doc => {
            data.firebaseDB.collection("_account_").doc(doc).get().then(doc => {

                var data = doc.data()
                data.__props__ = {
                    db: bracketDB,
                    collection: "user",
                    doc: data["first-name"].tolowercase() + data["last-name"].tolowercase(),
                    id: data["last-name"] === "Obeid" ? obeidUserID : generate({ unique: true }),
                    creationDate: new Date().getTime(),
                    active: true,
                    createdBy: obeidUserID,
                    collapsed: [],
                    comments: [],
                    folderPath: [],
                }

                data.accountID = accAccountID
                data.firstName = data["first-name"]
                data.lastName = data["last-name"]

                // password
                if (data["last-name"] === "Obeid") data.password = "Obeid@123"
                else if (data["last-name"] === "Al Zoghbi") data.password = "Mohamad@Z"
                else if (data["last-name"] === "Hassan") data.password = "Mohamad@H"
                else if (data["last-name"] === "Assaf") data.password = "Assaf@T"

                delete data.id
                delete data["creation-date"]
                delete data.clooossseeed
                delete data.hezzzyawezzz
                delete data.functions
                delete data["first-name"]
                delete data["last-name"]

                postJsonFiles({ save: { data, collection: `${bracketDB}/user`, doc: data.__props__.doc } })

                // permission
                var id = generate({ unique: true })
                var permission = {
                    userID: data.__props__.id,
                    admin: true,
                    __props__: {
                        db: bracketDB,
                        collection: "permission",
                        id,
                        doc: id,
                        creationDate: new Date().getTime(),
                        active: true,
                        createdBy: obeidUserID,
                        collapsed: [],
                        comments: [],
                        folderPath: [],
                    }
                }

                // create permission
                postJsonFiles({ save: { data: permission, collection: `${bracketDB}/permission`, doc: permission.__props__.doc } })
            })
        });

        // create bracket user: obeidUser
        const createBracketUser = () => {}
        createBracketUser();

        // create session
        const createSession = () => {
            // if user opens different project a new session is created
            const data = {
                accountID: bracketAccountID,
                projectID: bracketID,
                userID: obeidUserID,
                dataDB: bracketDB,
                dataKEY: bracketKEY,
                expiryDate: 9999999999999,
                encryptionKey,
                subscriptions: [{
                    type: "view",
                    db: "view",
                    collection: bracketKEY,
                    doc: "console",
                    expiryDate: 9999999999999,
                }],
                __props__: {
                    db: bracketDB,
                    collection: "session",
                    id: sessionID,
                    doc: "session1",
                    creationDate: new Date().getTime(),
                    active: true,
                    createdBy: obeidUserID
                }
            }

            postJsonFiles({ save: { data, collection: `${bracketDB}/session`, doc: "session1" } })
        }
        createSession();

        // create exchangeRate
        const createExchangeRate = () => {

            const data = {
                fromUnit: "TOKEN",
                fromAmount: 1,
                toAmount: 1,
                toUnit: "USD",
                __props__: {
                    db: bracketDB,
                    collection: "exchangeRate",
                    id: exchangeRateID,
                    doc: "TOKENtoUSD",
                    creationDate: new Date().getTime(),
                    active: true,
                    createdBy: obeidUserID
                }
            }

            postJsonFiles({ save: { data, collection: `${bracketDB}/exchangeRate`, doc: "TOKENtoUSD" } })
        }
        createExchangeRate();

        /////////////////////////////////////// Collection Per Project ///////////////////////////////////////////

        // create plugin
        const createPlugin = () => {

            const data = {
                accountID: bracketAccountID,
                projectID: bracketID,
                data: [{
                    type: "view",
                    db: "view",
                    collection: bracketKEY,
                    doc: "console"
                }],
                price: 100,
                priceUnit: "TOKEN",
                avDuration: 9999999999999,
                releaseDate: 0,
                expiryDate: 9999999999999,
                status: "Confirmed",
                approved: true,
                __props__: {
                    db: "plugin",
                    collection: bracketKEY,
                    id: pluginID,
                    doc: "plugin1",
                    creationDate: new Date().getTime(),
                    active: true,
                    createdBy: obeidUserID
                }
            }

            postJsonFiles({ save: { data, collection: `plugin/${bracketKEY}`, doc: "plugin1" } })
        }
        createPlugin();

        // create subscription
        const createSubscription = () => {

            const data = {
                accountID: accAccountID,
                projectID: accID,
                pluginID,
                subscriptionDate: 0,
                expiryDate: 9999999999999,
                status: "Confirmed",
                __props__: {
                    db: "subscriptions",
                    collection: accKEY,
                    id: subscriptionID,
                    doc: "subscription1",
                    creationDate: new Date().getTime(),
                    active: true,
                    createdBy: obeidUserID
                }
            }

            postJsonFiles({ save: { data, collection: `subscriptions/${accKEY}`, doc: "subscription1" } })
        }
        createSubscription();

        // create bill
        const createBill = () => {

            const data = {
                accountID: accAccountID,
                projectID: accID,
                pluginID,
                subscriptionID,
                dueDate: 9999999999999,
                amount: 100,
                amountUnit: "TOKEN",
                status: "Confirmed",
                paymentStatus: "Paid",
                __props__: {
                    db: "bills",
                    collection: accKEY,
                    id: billID,
                    doc: "bill1",
                    creationDate: new Date().getTime(),
                    active: true,
                    createdBy: obeidUserID
                }
            }

            postJsonFiles({ save: { data, collection: `bills/${accKEY}`, doc: "bill1" } })
        }
        createBill();

        // create voucher
        const createVoucher = () => {

            const data = {
                accountID: accAccountID,
                projectID: accID,
                billID,
                voucherDate: 9999999999999,
                amount: 100,
                amountUnit: "TOKEN",
                status: "Confirmed",
                __props__: {
                    db: "vouchers",
                    collection: accKEY,
                    id: voucherID,
                    doc: "voucher1",
                    creationDate: new Date().getTime(),
                    active: true,
                    createdBy: obeidUserID
                }
            }

            postJsonFiles({ save: { data, collection: `vouchers/${accKEY}`, doc: "voucher1" } })
        }
        createVoucher();

        // create 4 transactions: 1 Bill and 1 Voucher: 2 billingAccount, 2 TokenAccount
        const createTransactions = () => {
            [
                debitBracketAccountID, // release tokens
                debitAccBillingAccountTransactionID, // vouhcer: client charges his account
                creditBracketTokenAccountTransactionID, // vouhcer: client charges his account
                creditAccBillingAccountTransactionID, // bill: client subscribes
                debitBracketTokenAccountTransactionID // bill: client subscribes

            ].map((transactionID, i) => {
                
                var data = {
                    accountID: accAccountID,
                    projectID: accID,
                    transactionDate: new Date().getTime(),
                    debit: 0,
                    credit: 0,
                    unit: "TOKEN",
                    status: "Confirmed",
                    exchangeRate: [{
                        fromUnit: "TOKEN",
                        fromAmount: 1,
                        toUnit: "USD",
                        toAmount: 1
                    }],
                    __props__: {
                        db: "transactions",
                        collection: accKEY,
                        id: transactionID,
                        doc: "transaction" + (i + 1),
                        creationDate: new Date().getTime(),
                        active: true,
                        createdBy: obeidUserID
                    }
                }

                if (i === 0) data.debit = 100 // DR Bracket (release)
                else if (i === 1) data.debit = 100 // DR Acc (voucher)
                else if (i === 2) data.credit = 100 // CR Bracket Token (voucher)
                else if (i === 3) data.credit = 100 // CR Acc (bill)
                else if (i === 4) data.debit = 100 // DR Bracket Token (bill)

                // payment voucher
                if (i === 1 || i === 2) data.voucherID = voucherID
                // bill invoice
                else if (i === 3 || i === 4) data.billID = billID

                postJsonFiles({ save: { data, collection: `transactions/${accKEY}`, doc: data.__props__.doc } })
            })
        }
        createTransactions();

        // release 100 token
        var tokens = []
        const createTokens = () => {
            for (let index = 0; index < 100; index++) {
                
                var data = {
                    token: generate({ universal: true }),
                    releaseDate: new Date().getTime(),
                    __props__: {
                        db: "tokens",
                        collection: bracketKEY,
                        id: generate({ unique: true }),
                        doc: "token" + (i + 1),
                        creationDate: new Date().getTime(),
                        active: true,
                        createdBy: obeidUserID
                    }
                }
                tokens.push(data.token)

                postJsonFiles({ save: { data, collection: `tokens/newRelease`, doc: data.__props__.doc } })
            }
        }
        createTokens();

        // create 300: 100 deposit to Bracket => 100 move to Acc => 100 move back to Bracket
        const createBlocks = () => {

            // for voucher
            tokens.map(token => {
                
                var data = {
                    token,
                    transactionID: debitBrakcetTokenAccountTransactionID,
                    releaseDate: new Date().getTime(),
                    __props__: {
                        db: "blocks",
                        collection: bracketKEY,
                        id: generate({ unique: true }),
                        doc: "block" + (i + 1),
                        creationDate: new Date().getTime(),
                        active: true,
                        createdBy: obeidUserID
                    }
                }

                postJsonFiles({ save: { data, collection: `blocks/${bracketKEY}`, doc: data.__props__.doc } })
            })

            // for Bill
            tokens.map(token => {
                
                var data = {
                    token: generate({ universal: true }),
                    releaseDate: new Date().getTime(),
                    __props__: {
                        db: "blocks",
                        collection: bracketKEY,
                        id: generate({ unique: true }),
                        doc: "block" + (i + 1),
                        creationDate: new Date().getTime(),
                        active: true,
                        createdBy: obeidUserID
                    }
                }

                postJsonFiles({ save: { data, collection: `blocks/${bracketKEY}`, doc: data.__props__.doc } })
            })
        }
        createBlocks();

        // create views
        (["acc", "brackettechnologies"]).map(project => {
            data.firebaseDB.collection(`view-${project}`).get().then(docs => {

                docs.forEach(doc => {

                    var data = doc.data()

                    data.__props__ = {
                        db: "views",
                        collection: project === "brackettechnologies" ? bracketKEY : accKEY,
                        id: generate({ unique: true }),
                        doc: doc.id,
                        creationDate: new Date().getTime(),
                        active: true,
                        createdBy: obeidUserID,
                        actions: data.functions,
                        collapsed: [...(data.clooossseeed || []), ...(data.actions.clooossseeed || [])],
                        comments: [...(data.hezzzyawezzz || []), ...(data.actions.hezzzyawezzz || [])],
                        folderPath: [],
                        version: 0,
                        projectID: project === "brackettechnologies" ? bracketID : accID
                    }

                    delete data["creation-date"]
                    delete data.clooossseeed
                    delete data.hezzzyawezzz
                    data.__props__.actions && delete data.__props__.actions.clooossseeed
                    data.__props__.actions && delete data.__props__.actions.hezzzyawezzz
                    delete data.functions
                    delete data.id

                    postJsonFiles({ save: { data, collection: `views/${project === "brackettechnologies" ? bracketKEY : accKEY}`, doc: data.__props__.doc } })
                })
            });
        });

        // create files
        (["acc", "brackettechnologies"]).map(project => {
            data.firebaseDB.collection(`storage-${project}`).get().then(docs => {

                docs.forEach(doc => {

                    var data = doc.data()
                    var id = generate({ unique: true })

                    data.__props__ = {
                        db: "files",
                        collection: project === "brackettechnologies" ? bracketKEY : accKEY,
                        id,
                        creationDate: new Date().getTime(),
                        active: true,
                        createdBy: obeidUserID,
                        collapsed: [],
                        comments: [],
                        folderPath: [],
                        actions: {},
                        doc: doc.id,
                        projectID: project === "brackettechnologies" ? bracketID : accID
                    }

                    delete data["creation-date"]
                    delete data.id

                    postJsonFiles({ save: { data, collection: `files/${project === "brackettechnologies" ? bracketKEY : accKEY}`, doc: data.__props__.doc } })
                })
            });
        });

        // create data
        const createData = (project, collections) => {
            project === "acc" && collections.map(collection => {
                data.firebaseDB.collection(`collection-${collection}-${project}`).get().then(docs => {

                    docs.forEach(doc => {

                        var data = doc.data()

                        data.__props__ = {
                            id: generate({ unique: true }),
                            doc: doc.id,
                            creationDate: new Date().getTime(),
                            active: true,
                            createdBy: obeidUserID,
                            collapsed: [...(data.clooossseeed || []), ...((data.functions || {}).clooossseeed || [])],
                            comments: [...(data.hezzzyawezzz || []), ...((data.functions || {}).hezzzyawezzz || [])],
                            folderPath: [],
                            actions: {},
                            projectID: accID
                        }

                        delete data["creation-date"]
                        delete data.clooossseeed
                        delete data.hezzzyawezzz
                        delete data.functions
                        delete data.id

                        postJsonFiles({ save: { data, collection: `${accDB}/${collection}`, doc: data.__props__.doc } })
                    })
                })
            })
        }
    }
}

module.exports = moveData