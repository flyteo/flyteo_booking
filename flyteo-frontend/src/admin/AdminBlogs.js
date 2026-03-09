import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../axios";
import AdminSidebar from "./AdminSidebar";

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    const res = await api.get("/blogs/admin/all");
    setBlogs(res.data);
  };

  const deleteBlog = async (id) => {
    if (!window.confirm("Delete this blog?")) return;

    await api.delete(`/blogs/${id}`);
    loadBlogs();
  };

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-heading text-palmGreen">
            Blog Management
          </h1>

          <Link
            to="/admin/blogs/add"
            className="bg-palmGreen text-white px-4 py-2 rounded"
          >
            + Add Blog
          </Link>
        </div>

        <div className="bg-white shadow rounded overflow-hidden">
          {blogs.length === 0 && (
            <p className="p-6 text-gray-500">No blogs found.</p>
          )}

          {blogs.map((b) => (
            <div
              key={b.id}
              className="flex justify-between items-center p-4 border-b"
            >
              <div>
                <p className="font-semibold">{b.title}</p>

                <div className="text-sm text-gray-500 flex gap-3 mt-1">
                  {b.isFeatured && (
                    <span className="text-yellow-600">⭐ Featured</span>
                  )}
                  {b.isPublished ? (
                    <span className="text-green-600">Published</span>
                  ) : (
                    <span className="text-red-600">Draft</span>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  to={`/admin/blogs/edit/${b.id}`}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </Link>

                <button
                  onClick={() => deleteBlog(b.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}