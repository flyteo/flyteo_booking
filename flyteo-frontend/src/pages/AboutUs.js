export default function AboutUs() {
  return (
    <div className="bg-white min-h-screen mt-16">

      {/* ================= HERO SECTION ================= */}
      <div className="relative h-[45vh] md:h-[60vh]">
        {/* <img
          src="https://www.cnn.com/travel/article/us-beautiful-hotels"
          alt="Flyteo Travel"
          className="w-full h-full object-cover"
        /> */}
        <div className="absolute inset-0 bg-brandOrange" />

        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="text-white max-w-3xl">
            <h1 className="font-heading text-3xl md:text-5xl mb-4">
              About Flyteo
            </h1>
            <p className="text-base md:text-lg opacity-90">
              Making travel accommodation simple, affordable & reliable
            </p>
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="container mx-auto px-4 md:px-8 py-12">

        {/* INTRO */}
        <div className="max-w-4xl mx-auto text-gray-700 leading-relaxed">
          <h2 className="font-heading text-2xl md:text-3xl text-palmGreen mb-4">
            Who We Are
          </h2>

          <p className="mb-4">
            <strong>Flyteo.in</strong> is a digital hotel and room booking platform
            proudly starting from <strong>Alibag</strong>, designed to make travel
            accommodation simple, affordable, and reliable. We connect travelers
            with verified hotels, resorts, homestays, and lodging partners,
            ensuring a smooth and transparent booking experience.
          </p>

          <p className="mb-4">
            Founded by <strong>Shivam Jadhav</strong> and{" "}
            <strong>Shubham Tivalekar</strong>, Flyteo was created with a strong
            focus on promoting local hospitality businesses in Alibag and nearby
            coastal destinations. Our aim is to help travelers discover
            comfortable stays while supporting hotels with better visibility and
            digital growth.
          </p>

          <p>
            At Flyteo, we believe that quality stays and honest pricing build
            long-term trust. Our platform emphasizes ease of use, secure
            payments, and clear communication between guests and hotel partners.
            Whether it’s a weekend getaway or a longer stay, Flyteo is committed
            to making your booking experience stress-free.
          </p>
        </div>

        {/* ================= MISSION & VISION ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-14 max-w-5xl mx-auto">

          {/* MISSION */}
          <div className="bg-palmGreen rounded-2xl p-6 shadow">
            <h3 className="font-heading text-xl text-brandOrange mb-3">
              🎯 Our Mission
            </h3>
            <p className="text-black-400">
              To simplify hotel bookings while empowering local hotels through
              digital solutions.
            </p>
          </div>

          {/* VISION */}
          <div className="bg-palmGreen rounded-2xl p-6 shadow">
            <h3 className="font-heading text-xl text-brandOrange mb-3">
              🌍 Our Vision
            </h3>
            <p className="text-black-400">
              To grow from Alibag to destinations across India, becoming a
              trusted name in travel and accommodation services.
            </p>
          </div>
        </div>

        {/* ================= TRUST STRIP ================= */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8 text-center max-w-5xl mx-auto">
          <h3 className="font-heading text-2xl text-palmGreen mb-6">
            Why Travelers Trust Flyteo
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-gray-700">
            <div>
              <div className="text-3xl mb-2">🏨</div>
              Verified Properties
            </div>
            <div>
              <div className="text-3xl mb-2">💰</div>
              Honest Pricing
            </div>
            <div>
              <div className="text-3xl mb-2">🔐</div>
              Secure Payments
            </div>
            <div>
              <div className="text-3xl mb-2">📞</div>
              Dedicated Support
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
