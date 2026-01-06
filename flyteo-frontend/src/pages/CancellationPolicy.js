export default function CancellationPolicy() {
  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 text-gray-700">
      <h1 className="text-3xl font-heading text-palmGreen mb-6">
        Cancellation Policy – Flyteo.in
      </h1>

      <p className="mb-6">
        At <strong>Flyteo.in</strong>, we value transparency and customer
        satisfaction. Please review the cancellation rules carefully before
        booking hotels, rooms, villas, camping, or adventure experiences.
      </p>

      {/* HOTELS */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">
        🏨 Hotels, Rooms & Villas – Cancellation Policy
      </h2>

      <h3 className="font-semibold mb-2">
        If the customer has paid the full amount:
      </h3>

      <ul className="list-disc ml-6 space-y-2">
        <li>
          <strong>100% Refund</strong> – Cancellation made up to{" "}
          <strong>30 days</strong> before check-in.
        </li>
        <li>
          <strong>90% Refund</strong> – Cancellation made up to{" "}
          <strong>25 days</strong> before check-in.
        </li>
        <li>
          <strong>50% Refund</strong> – Cancellation made{" "}
          <strong>20 days</strong> before check-in.
        </li>
        <li>
          <strong>30% Refund</strong> – Cancellation made between{" "}
          <strong>19 to 11 days</strong> before check-in.
        </li>
      </ul>

      <div className="bg-red-50 border border-red-200 p-4 rounded mt-4">
        <p className="font-semibold text-red-600 mb-1">❌ No Refund</p>
        <ul className="list-disc ml-6 space-y-1">
          <li>Cancellation made 10 days to 0 days before check-in.</li>
          <li>Less than 24 hours before check-in.</li>
          <li>No-show (guest does not arrive on check-in date).</li>
        </ul>
      </div>

      <p className="mt-4">
        <strong>If the customer has paid only an advance amount:</strong>
      </p>
      <ul className="list-disc ml-6 space-y-1 mt-2">
        <li>Advance payment is non-refundable, regardless of cancellation date.</li>
        <li>
          Refund rules apply only to customers who have paid the full amount.
        </li>
      </ul>

      {/* CAMPING */}
      <h2 className="text-2xl font-semibold mt-10 mb-4">
        🏕️ Camping & Adventure – Cancellation Policy
      </h2>

      <h3 className="font-semibold mb-2">
        If the customer has paid the full amount:
      </h3>

      <ul className="list-disc ml-6 space-y-2">
        <li>
          <strong>100% Refund</strong> – Cancellation made up to{" "}
          <strong>30 days</strong> before the activity date.
        </li>
        <li>
          <strong>90% Refund</strong> – Cancellation made up to{" "}
          <strong>25 days</strong> before the activity date.
        </li>
        <li>
          <strong>50% Refund</strong> – Cancellation made{" "}
          <strong>20 days</strong> before the activity date.
        </li>
        <li>
          <strong>30% Refund</strong> – Cancellation made between{" "}
          <strong>19 to 11 days</strong> before the activity date.
        </li>
      </ul>

      <div className="bg-red-50 border border-red-200 p-4 rounded mt-4">
        <p className="font-semibold text-red-600 mb-1">❌ No Refund</p>
        <ul className="list-disc ml-6 space-y-1">
          <li>Cancellation made 10 days to 0 days before activity date.</li>
          <li>Less than 24 hours before the activity.</li>
          <li>No-show (participant does not arrive on activity date).</li>
        </ul>
      </div>

      <p className="mt-4">
        <strong>If the customer has paid only an advance amount:</strong>
      </p>
      <ul className="list-disc ml-6 space-y-1 mt-2">
        <li>Advance amount is strictly non-refundable.</li>
        <li>
          Refund eligibility applies only if full payment was made.
        </li>
      </ul>

      {/* CONTACT */}
      <h2 className="text-2xl font-semibold mt-10 mb-4">
        📞 Contact for Cancellations
      </h2>

      <p className="mb-2">For all cancellation requests, contact:</p>
      <p className="font-semibold">Flyteo.in – Support Team</p>
      <p>📧 Email: flyteotravels@gmail.com</p>
      <p>📞 Phone / WhatsApp: 8975995125</p>

      {/* NOTE */}
      <div className="bg-sand p-4 rounded mt-8">
        <p className="font-semibold mb-1">🔔 Important Note</p>
        <ul className="list-disc ml-6 space-y-1">
          <li>
            Some properties or activity partners may have stricter
            non-refundable policies.
          </li>
          <li>
            Such details will be clearly mentioned at the time of booking.
          </li>
          <li>
            Flyteo.in is not responsible for partner-specific policies.
          </li>
        </ul>
      </div>
    </div>
  );
}
