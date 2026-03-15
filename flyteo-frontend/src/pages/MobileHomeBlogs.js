import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios";

export default function MobileHomeBlogs() {

  const nav = useNavigate();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    const res = await api.get("/blogs/bloglist");
    setBlogs(res.data.blogs.slice(0, 5));
  };

  return (
    <section className="mt-12 px-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-heading text-palmGreen">
          Travel Guides
        </h2>

        <button
          onClick={() => nav("/blogs")}
          className="text-sm text-brandOrange"
        >
          View all →
        </button>
      </div>

      {/* HORIZONTAL SCROLL */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">

        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="min-w-[240px] bg-white rounded-xl shadow cursor-pointer"
            onClick={() => nav(`/blog/${blog.slug}`)}
          >

            <img
              src={blog.coverImage}
              className="h-32 w-full object-cover rounded-t-xl"
            />

            <div className="p-3">

              {blog.location && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {blog.location}
                </span>
              )}

              <h4 className="text-sm font-semibold mt-2 line-clamp-2">
                {blog.title}
              </h4>

            </div>

          </div>
        ))}

      </div>

    </section>
  );
}