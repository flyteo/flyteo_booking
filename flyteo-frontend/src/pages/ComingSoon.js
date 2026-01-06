import { Link } from "react-router-dom";

export default function ComingSoon() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">

        {/* ICON */}
        <div className="text-5xl mb-4">🚧</div>

        {/* TITLE */}
        <h1 className="font-heading text-2xl md:text-3xl text-palmGreen mb-3">
          Coming Soon
        </h1>

        {/* MESSAGE */}
        <p className="text-gray-600 mb-4">
          Currently, <strong>registration, login, and booking</strong> services
          are temporarily unavailable.
        </p>

        <p className="text-gray-600 mb-6">
          Our system is under final preparation and will be launching very soon.
          Thank you for your patience.
        </p>

        {/* CONTACT INFO */}
        <div className="bg-sand rounded-xl p-4 mb-6">
          <p className="text-gray-700 font-medium">
            For any booking inquiries, contact us:
          </p>
          <a
            href="tel:7894563521"
            className="text-palmGreen font-bold text-lg block mt-1"
          >
            📞 7894563521
          </a>
        </div>

        {/* ACTION */}
        <Link
          to="/"
          className="inline-block w-full bg-palmGreen text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
