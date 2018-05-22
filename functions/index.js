const functions = require('firebase-functions');
var admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
var firestore = admin.firestore();

exports.webhook = functions.https.onRequest((request, response) => {

    // console.log("request.body.result.parameters: ", request.body.result.parameters);
    // {
    //     name: "john",
    //     persons: "3"
    //     ...
    // }

    switch (request.body.result.action) {

        case 'details':


						let params = request.body.result.parameters;

						firestore.collection('donors').add(params)
							.then(() => {

								response.send({
									speech:
										`Hi ${params.lastname} we will contact you on this number ${params.phone} and intimate you when blood is needed around your city
										${params.city} or in the state ${params.state} which suites to your blood group ${params.blood} ...Thanks for being part of BloodBot`
								});
							})
							.catch((e => {

								console.log("error: ", e);

								response.send({
									speech: "something went wrong when writing on database"
								});
							}))
            break;
            
            
            case 'getData':
			
					
					let param = request.body.result.parameters;


                    firestore.collection('donors').where('city', '==', param.reqcity).where('blood', '==', param.reqblood).get()
                .then((querySnapshot) => {

                    var donors = [];
                    querySnapshot.forEach((doc) => { donors.push(doc.data()) });
                    // now orders have something like this [ {...}, {...}, {...} ]

                    response.send({
                        speech: `you have ${donors.length} donors,  Will get back to you with thier confirmation
`
                    });
                })
                .catch((err) => {
                    console.log('Error getting documents', err);

                    response.send({
                        speech: "something went wrong when reading from database"
                    })
                })

            
            break;
            
        case 'countDonors':

            firestore.collection('donors').get()
                .then((querySnapshot) => {

                    var donors = [];
                    querySnapshot.forEach((doc) => { donors.push(doc.data()) });
                    // now orders have something like this [ {...}, {...}, {...} ]

                    response.send({
                        speech: `you have ${donors.length} donors, would you like to see them? (yes/no)`
                    });
                })
                .catch((err) => {
                    console.log('Error getting documents', err);

                    response.send({
                        speech: "something went wrong when reading from database"
                    })
                })

            break;

        case 'donorList':

            firestore.collection('donors').get()
                .then((querySnapshot) => {

                    var donors = [];
                    querySnapshot.forEach((doc) => { donors.push(doc.data()) });
                    // now orders have something like this [ {...}, {...}, {...} ]

                    // converting array to speech
                    var speech = `here are your donors list \n`;

                    donors.forEach((eachDonor, index) => {
                        speech += ` ${index + 1}. ${eachDonor.lastname} - ${eachDonor.city} - ${eachDonor.blood} - ${eachDonor.phone} \n`
                    })

                    response.send({
                        speech: speech
                    });
                })
                .catch((err) => {
                    console.log('Error getting documents', err);

                    response.send({
                        speech: "something went wrong when reading from database"
                    })
                })

            break;
			
			

        default:
            response.send({
                speech: "no action matched in webhook"
            })
    }
});
