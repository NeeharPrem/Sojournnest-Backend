import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Stripe secret key is not defined");
}

const stripe = new Stripe(stripeSecretKey);

class PaymentRepository {
    async ConfirmPayment(data: any) {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: "Fee",
                        },
                        unit_amount: data.totalAmount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `http://localhost:5000/success/${data.hostId}`,
            cancel_url: "http://localhost:5000/failed",
            billing_address_collection: 'required',
        });

        return session;
    }

    async PaymentSuccess(request: any) {
        const payload = request.body;
        const paymentIntentId= payload?.data?.object?.payment_intent
        const payloadString = JSON.stringify(payload, null, 2);
        const sig = request.headers["stripe-signature"];
        if (typeof sig !== "string") {
            return false;
        }
        const endpointSecret =
            "whsec_38f3a628abf8e8ef524a17fe40221ffd034fcc871fba497b4aa9400222869b07";
        const header = stripe.webhooks.generateTestHeaderString({
            payload: payloadString,
            secret: endpointSecret,
        });

        let event;

        event = stripe.webhooks.constructEvent(
            payloadString,
            header,
            endpointSecret
        );

        if (paymentIntentId){
            const paymentIntentResponse = await stripe.paymentIntents.retrieve(paymentIntentId);
            console.log(paymentIntentResponse,"looo")
            const paymentIntent = paymentIntentResponse
            if (paymentIntentResponse.latest_charge) {
                const chargeId = paymentIntentResponse.latest_charge;
                console.log(chargeId,'from')
                request.app.locals.chargeId = chargeId;
            } else {
                console.log('No latest charge found for this PaymentIntent.');
                return null;
            }
        }
        if (event.type == "checkout.session.completed") {
            return true;
        } else {
            return false;
        }
    }
    
    async createRefund(chargeId: string, refundAmount: number) {
        try {
            const refund = await stripe.refunds.create({
                charge: chargeId,
                amount: refundAmount,
            });
            return refund;
        } catch (error) {
            console.error(error);
        }
    }


    async retrieveRefund(refundId: string) {
        try {
            const refund = await stripe.refunds.retrieve(refundId);
            console.log(refund);
            return refund;
        } catch (error) {
            console.error(error);
        }
    }

    async cancelRefund(refundId: string) {
        try {
            const refund = await stripe.refunds.cancel(refundId);
            console.log(refund);
            return refund;
        } catch (error) {
            console.error(error);
        }
    }


}

export default PaymentRepository;