import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios";

export default function HomeBlogs() {
  const nav = useNavigate();

  const [blogs, setBlogs] = useState([]);
//   const [featured, setFeatured] = useState(null);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    const res = await api.get("/blogs/bloglist");

    // setFeatured(res.data.featured);
    setBlogs(res.data.blogs.slice(0, 6)); // show 6 blogs
  };

  return (
    <section className="max-w-7xl mx-auto px-4 mt-16">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-heading text-palmGreen">
          Travel Guides
        </h2>

        <button
          onClick={() => nav("/blogs")}
          className="text-brandOrange font-medium"
        >
          View all →
        </button>
      </div>

      {/* FEATURED BLOG */}
      {/* {featured && (
        <div
          className="mb-10  rounded-xl overflow-hidden cursor-pointer group relative"
          onClick={() => nav(`/blog/${featured.slug}`)}
        >
          <img
            src={featured.coverImage}
            className="h-[360px] w-full object-cover group-hover:scale-105 transition"
          />

          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute bottom-0 p-6 text-white">

            <span className="text-xs bg-brandOrange px-2 py-1 rounded">
              Featured Guide
            </span>

            <h3 className="text-2xl font-bold mt-3">
              {featured.title}
            </h3>

            <p className="mt-2 text-gray-200 max-w-lg">
              {featured.excerpt}
            </p>

          </div>
        </div>
      )} */}

      {/* BLOG GRID */}
      <div className="grid md:grid-cols-3 gap-6">

        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white rounded-xl shadow hover:shadow-xl transition cursor-pointer group"
            onClick={() => nav(`/blog/${blog.slug}`)}
          >

            <div className="overflow-hidden rounded-t-xl">
              <img
                src={blog.coverImage}
                className="h-48 w-full object-cover group-hover:scale-105 transition"
              />
            </div>

            <div className="p-4">

              {blog.location && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {blog.location}
                </span>
              )}

              <h4 className="font-semibold mt-2 line-clamp-2">
                {blog.title}
              </h4>

              <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                {blog.excerpt}
              </p>

              <p className="text-xs text-gray-400 mt-3">
                {new Date(blog.createdAt).toDateString()}
              </p>

            </div>

          </div>
        ))}

      </div>

    </section>
  );
}