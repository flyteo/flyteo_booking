import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axios";
import AdminSidebar from "./AdminSidebar";
import BlogForm from "./BlogForm";

export default function EditBlog() {
  const { id } = useParams();
  const nav = useNavigate();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    loadBlog();
  }, []);

  const loadBlog = async () => {
    const res = await api.get("/blogs/admin/all");
    const found = res.data.find(b => b.id === Number(id));
    setBlog(found);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.put(`/blogs/${id}`, blog);
    nav("/admin/blogs");
  };

  if (!blog) return <div className="p-10">Loading...</div>;

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-heading mb-6">Edit Blog</h1>
        <BlogForm
          blog={blog}
          setBlog={setBlog}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}