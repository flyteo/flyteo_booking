import t1 from "../assets/t1.jpg";

export default function AboutUs() {
  return (
    <div className="bg-white mt-10">

      {/* ================= HERO SECTION ================= */}
      <div className="relative h-[35vh] md:h-[45vh] lg:h-[50vh] flex items-center justify-center">

        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500" />

        {/* Content */}
        <div className="relative text-center text-white px-6 max-w-4xl">
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">
            About Flyteo
          </h1>

          <p className="text-sm md:text-lg opacity-90">
            Making travel accommodation simple, affordable & reliable
          </p>
        </div>
      </div>


      {/* ================= INTRO SECTION ================= */}
      <section className="max-w-6xl mx-auto px-5 md:px-10 py-14">

        <div className="grid md:grid-cols-2 gap-10 items-center">

          {/* TEXT */}
          <div className="text-gray-700 leading-relaxed">
            <h2 className="font-heading text-3xl md:text-4xl text-palmGreen mb-5">
              Who We Are
            </h2>

            <p className="mb-4">
              <strong>Flyteo.in</strong> is a digital hotel and room booking platform
              proudly starting from <strong>Alibaug</strong>. Our goal is to make
              accommodation booking simple, transparent, and accessible for travelers.
            </p>

            <p className="mb-4">
              We connect guests with verified hotels, villas, and camping
              experiences while helping local hospitality partners grow digitally.
            </p>

            <p>
              Founded by <strong>Shivam Jadhav(FOUNDER)</strong> and{" "}
              <strong>Shubham Tivalekar(CO-FOUNDER)</strong>, Flyteo focuses on promoting
              local tourism while delivering a reliable booking experience.
            </p>
          </div>

          {/* IMAGE */}
          <div>
            <img
              src={t1}
              className="rounded-2xl shadow-xl w-full object-cover"
              alt="Travel Experience"
            />
          </div>

        </div>
      </section>


      {/* ================= MISSION & VISION ================= */}
      <section className="bg-gray-50 py-16 px-5">

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">

          {/* MISSION */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition">

            <h3 className="font-heading text-xl text-orange-500 mb-3">
              🎯 Our Mission
            </h3>

            <p className="text-gray-600">
              To simplify hotel bookings while empowering local hospitality
              businesses through digital platforms and transparent pricing.
            </p>

          </div>

          {/* VISION */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition">

            <h3 className="font-heading text-xl text-orange-500 mb-3">
              🌍 Our Vision
            </h3>

            <p className="text-gray-600">
              To expand from Alibag to travel destinations across India and
              become a trusted travel accommodation platform.
            </p>

          </div>

        </div>

      </section>


      {/* ================= TRUST SECTION ================= */}
      <section className="max-w-6xl mx-auto px-5 py-16">

        <h3 className="font-heading text-3xl text-center text-palmGreen mb-10">
          Why Travelers Trust Flyteo
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <div className="text-3xl mb-2">🏨</div>
            <p className="font-medium">Verified Properties</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <div className="text-3xl mb-2">💰</div>
            <p className="font-medium">Honest Pricing</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <div className="text-3xl mb-2">🔐</div>
            <p className="font-medium">Secure Payments</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <div className="text-3xl mb-2">📞</div>
            <p className="font-medium">Dedicated Support</p>
          </div>

        </div>

      </section>


      {/* ================= CTA SECTION ================= */}
      <section className="bg-gradient-to-r from-orange-500 to-amber-500 py-8 text-center text-white px-6">

        <h3 className="text-3xl font-heading mb-4">
          Start Your Next Journey With Flyteo
        </h3>

        <p className="mb-6 opacity-90">
          Discover hotels, villas, and camping experiences across amazing destinations.
        </p>

        <a
          href="/hotels"
          className="bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold shadow hover:scale-105 transition"
        >
          Explore Stays →
        </a>

      </section>

    </div>
  );
}
