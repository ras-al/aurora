const admin = require("firebase-admin");
const {onRequest} = require("firebase-functions/v2/https");
const {defineSecret} = require("firebase-functions/params");
const Razorpay = require("razorpay");
const cors = require("cors")({origin: true});
const crypto = require("crypto");

// Define the secrets that our functions will need.
const razorpayKeyId = defineSecret("RAZORPAY_KEY_ID");
const razorpayKeySecret = defineSecret("RAZORPAY_KEY_SECRET");

admin.initializeApp();
const db = admin.firestore();

exports.createOrder = onRequest({secrets: [razorpayKeyId, razorpayKeySecret], invoker: "public"}, (req, res) => {
  // Manually wrap the function with the cors handler for robust CORS support
  cors(req, res, async () => {
    const razorpay = new Razorpay({
      key_id: razorpayKeyId.value(),
      key_secret: razorpayKeySecret.value(),
    });

    try {
      const {amount, currency = "INR"} = req.body;
      if (!amount) {
        return res.status(400).send("Amount is required.");
      }
      const options = {
        amount: amount * 100,
        currency,
        receipt: `receipt_${Date.now()}`,
      };
      const order = await razorpay.orders.create(options);
      res.status(200).json(order);
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      res.status(500).send("Failed to create order.");
    }
  });
});

exports.verifyPayment = onRequest({secrets: [razorpayKeyId, razorpayKeySecret], invoker: "public"}, (req, res) => {
  // Manually wrap the function with the cors handler for robust CORS support
  cors(req, res, async () => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        registrationData,
      } = req.body;
      const {
        uid, fee, isIEEE, memberId, fullName, phone, college,
        isTKMCE, referralCode, // <-- Receive the new data
      } = registrationData;

      if (!uid) {
        return res.status(401).send("User is not authenticated.");
      }

      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
          .createHmac("sha256", razorpayKeySecret.value())
          .update(body.toString())
          .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).send("Payment verification failed.");
      }

      const userDocRef = db.collection("users").doc(uid);
      const ticketId = `AUR-${uid.substring(0, 6)}-${Date.now().toString().slice(-6)}`;
      await userDocRef.update({
        name: fullName,
        phone: phone,
        college: college,
        isIEEE: isIEEE,
        memberId: isIEEE ? memberId : "",
        auroraTicketId: ticketId,
        auroraRegistrationDate: new Date(),
        auroraFee: fee,
        paymentId: razorpay_payment_id,
        isTKMCE: isTKMCE || false,
        referralCode: referralCode || "",
      });

      res.status(200).json({success: true, ticketId: ticketId});
    } catch (error) {
      console.error("Error verifying payment:", error);
      res.status(500).send("Payment verification failed.");
    }
  });
});
