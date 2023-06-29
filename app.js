import express from "express"
import dotenv from "dotenv"
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import { database } from "./config/dBconnect.js";
import categoryRoutes from "./routes/categoryRoute.js";
import commentRoutes from "./routes/commentRoute.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import { Stripe } from "stripe"
import User from "./model/userModel.js"



dotenv.config();
database();

const app = express();


//webhook
// server.js
//
// Use this sample code to handle webhook events in your integration.
//
// 1) Paste this code into a new file (server.js)
//
// 2) Install dependencies
//   npm install stripe
//   npm install express
//
// 3) Run the server on http://localhost:4242
//   node server.js

// The library needs to be configured with your account's secret key.
// Ensure the key is kept out of any version control system you might be using.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = "whsec_18835a2568dea2d60674f842df18a8a7eeeae81b8381f6e2f9c538195139a4db";

app.post('/webhook', express.raw({type: 'application/json'}), async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    //console.log("event");
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  if(event.type === "checkout.session.completed"){
    const session = event.data.object;
    console.log(session);

    const { userId } = session.metadata;
    const totalAmount = session.amount_total;
    const payment_status = session.payment_status;
    const paymentMethod = session.payment_method_types[0];
    const currency = session.currency;
    const subscriptionDate = new Date(session.created * 1000);
    const transationId = session.object.id;

    // console.log({
    //   userId,
    //   totalAmount,
    //   payment_status,
    //   paymentMethod,
    //   currency,
    //   datePaid,
    // });

    const subscribeUser = await User.findByIdAndUpdate(
      JSON.parse(userId),
      {
        subscription: {
          totalAmount: totalAmount / 100,
          payment_status,
          paymentMethod,
          currency,
          transationId,
          subscriptionDate,
        },
      },
      {
        new: true,
      }
    );
    console.log(subscribeUser);
  }

  // switch (event.type) {
  //   case 'payment_intent.succeeded':
  //     const paymentIntentSucceeded = event.data.object;
  //     // Then define and call a function to handle the event payment_intent.succeeded
  //     break;
  //   // ... handle other event types
  //   default:
  //     console.log(`Unhandled event type ${event.type}`);
  // }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
}
);



app.use(express.json());

const PORT = process.env.PORT || 8080;

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/comment",commentRoutes);

app.get("/success", async (req, res) => {
    res.send("<h1>Thanks your payment has been received</h1>");
  });

app.use(globalErrorHandler);

app.listen(PORT, console.log(`App started at ${PORT}`));

//for wrong route
// app.use("*", (req, res) => {
//   res.status(404).json({
//     message: `${req.originalUrl} not found`,
//   });
// });