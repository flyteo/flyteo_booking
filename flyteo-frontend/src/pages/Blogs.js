import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios";

export default function Blogs() {

  const nav = useNavigate();

  const [featured, setFeatured] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    const res = await api.get("/blogs/bloglist");

    setFeatured(res.data.featured);
    setBlogs(res.data.blogs);
  };

  const filteredBlogs = blogs.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* PAGE TITLE */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-heading text-palmGreen">
          Travel Blogs
        </h1>

        <p className="text-gray-500 mt-2">
          Discover travel guides, hidden gems and stay
          recommendations from Flyteo
        </p>
      </div>

      {/* SEARCH */}
      <div className="max-w-md mx-auto mb-12">
        <input
          type="text"
          placeholder="Search travel guides..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-xl p-3 shadow-sm focus:ring-2 focus:ring-brandOrange"
        />
      </div>

      {/* FEATURED BLOG HERO */}
      {featured && (
        <div
          className="relative h-[420px] rounded-2xl overflow-hidden mb-14 cursor-pointer group"
          onClick={() => nav(`/blog/${featured.slug}`)}
        >
          <img
            src={featured.coverImage}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />

          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute bottom-0 p-8 text-white">

            <span className="bg-brandOrange px-3 py-1 text-xs rounded">
              Featured Guide
            </span>

            <h2 className="text-3xl md:text-4xl font-bold mt-3">
              {featured.title}
            </h2>

            <p className="mt-2 text-gray-200 max-w-xl">
              {featured.excerpt}
            </p>

            <p className="mt-3 text-sm opacity-80">
              {new Date(featured.createdAt).toDateString()}
            </p>

          </div>
        </div>
      )}

      {/* BLOG GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {filteredBlogs.map(blog => (

          <div
            key={blog.id}
            onClick={() => nav(`/blog/${blog.slug}`)}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition cursor-pointer group"
          >

            {/* IMAGE */}
            <div className="overflow-hidden rounded-t-xl">
              <img
                src={blog.coverImage}
                className="h-48 w-full object-cover group-hover:scale-105 transition duration-500"
              />
            </div>

            {/* CONTENT */}
            <div className="p-5">

              {/* LOCATION BADGE */}
              {blog.location && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                  {blog.location}
                </span>
              )}

              <h3 className="text-lg font-semibold mt-2 line-clamp-2">
                {blog.title}
              </h3>

              <p className="text-gray-500 text-sm mt-2 line-clamp-3">
                {blog.excerpt}
              </p>

              <div className="flex justify-between items-center mt-4 text-sm text-gray-400">

                <span>
                  {new Date(blog.createdAt).toDateString()}
                </span>

                <span className="text-brandOrange font-medium">
                  Read →
                </span>

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* EMPTY STATE */}
      {filteredBlogs.length === 0 && (
        <div className="text-center text-gray-400 mt-10">
          No blogs found.
        </div>
      )}

    </div>
  );
}