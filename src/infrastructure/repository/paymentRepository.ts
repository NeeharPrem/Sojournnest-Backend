import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Stripe secret key is not defined");
}

const stripe = new Stripe(stripeSecretKey);

class PaymentRepository {
    async ConfirmPayment(data: any) {
        console.log(data, "Reached payment");
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
            success_url: "http://localhost:5000/success",
            cancel_url: "http://localhost:5000/failed",
            billing_address_collection: 'required',
        });

        return session;
    }

    async PaymentSuccess(request: any) {
        const payload = request.body;
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
        console.log(`Webhook Verified: `, event);
        if (event.type == "checkout.session.completed") {
            return true;
        } else {
            return false;
        }
    }
}

export default PaymentRepository;