import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../axios";

export default function BlogDetails() {
  const { slug } = useParams();

  const [blog, setBlog] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [villas, setVillas] = useState([]);
  const [campings, setCampings] = useState([]);

  useEffect(() => {
    loadBlog();
  }, [slug]);

  const loadBlog = async () => {
    try {
      const res = await api.get(`/blogs/${slug}/details`);

      setBlog(res.data.blog);
      setHotels(res.data.hotels || []);
      setVillas(res.data.villas || []);
      setCampings(res.data.campings || []);
    } catch (err) {
      console.error(err);
    }
  };

  if (!blog) {
    return (
      <div className="p-20 text-center text-lg">
        Loading Blog...
      </div>
    );
  }

  return (
    <div className="bg-white">

      {/* HERO SECTION */}

      <div className="relative h-[420px] w-full overflow-hidden">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40 flex items-end p-10">
          <div className="text-white max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold">
              {blog.title}
            </h1>

            <p className="mt-3 text-sm opacity-90">
              {blog.location} • {blog.authorName} •{" "}
              {new Date(blog.createdAt).toDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* BLOG CONTENT */}

      <div className="max-w-4xl mx-auto px-4 mt-12">
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>

      {/* HOTELS */}

      {hotels.length > 0 && (
        <PropertySection
          title={`Hotels in ${blog.location}`}
          items={hotels}
          type="hotel"
          explore={`/hotels`}
        />
      )}

      {/* VILLAS */}
<div className="max-w-4xl mx-auto px-4 mt-12">
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.excerpt }}
        />
      </div>
      {villas.length > 0 && (
        <PropertySection
          title={`Luxury Villas in ${blog.location}`}
          items={villas}
          type="villa"
          explore={`/villas`}
        />
      )}

      {/* CAMPING */}

      {campings.length > 0 && (
        <PropertySection
          title={`Camping in ${blog.location}`}
          items={campings}
          type="camping"
          // explore={`/camping?location=${blog.location}`}
          explore={`/campings`}
        />
      )}

      {/* META DETAILS */}

      <div className="max-w-4xl mx-auto px-4 mt-16 mb-20 border-t pt-8 text-sm text-gray-600">
        {blog.metaTitle && (
          <p>
            <b>Meta Title:</b> {blog.metaTitle}
          </p>
        )}

        {blog.metaDescription && (
          <p className="mt-2">
            <b>Meta Description:</b> {blog.metaDescription}
          </p>
        )}
      </div>
    </div>
  );
}

function PropertySection({ title, items, type, explore }) {
  return (
    <div className="max-w-6xl mx-auto px-4 mt-16">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">
          {title}
        </h2>

        <Link
          to={explore}
          className="text-palmGreen font-semibold"
        >
          Explore →
        </Link>
      </div>

      <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible pb-2">
        {items.map((item) => (
          <PropertyCard
            key={item.id}
            item={item}
            type={type}
          />
        ))}
      </div>
    </div>
  );
}

function PropertyCard({ item, type }) {

  const image =
    item.hotelimage?.[0]?.url ||
    item.villaimage?.[0]?.url ||
    item.campingimage?.[0]?.url ||
    "/placeholder.jpg";
    const getPrice = () => {

  // VILLA
  if (item.basePrice) return item.basePrice;

  // HOTEL → get lowest room price
  if (item.room?.length > 0) {
    const prices = item.room?.map(r => r.price);
    return Math.min(...prices);
  }

  // CAMPING → get lowest adult price
  if (item.campingpricing?.length > 0) {
    const prices = item.campingpricing?.map(p => p.adultPrice);
    return Math.min(...prices);
  }

  return 0;
};

  return (
    <div className="bg-white min-w-[260px] md:min-w-0 rounded-xl shadow hover:shadow-lg transition overflow-hidden">

      <img
        src={image}
        alt={item.name}
        className="h-48 w-full object-cover"
      />

      <div className="p-4">

        <h3 className="font-semibold text-lg">
          {item.name}
        </h3>

        <p className="text-gray-500 text-sm">
          {item.location}
        </p>

        <div className="flex justify-between items-center mt-3">

          <p className="font-bold text-palmGreen">
            ₹{getPrice()}
             <span className="text-xs text-gray-500">/night</span>
          </p>

          <Link
            to={`/${type}s/${item.id}`}
            className="text-sm text-brandOrange"
          >
            View →
          </Link>

        </div>

      </div>
    </div>
  );
}