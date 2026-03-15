import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios";
import AdminSidebar from "./AdminSidebar";
import BlogForm from "./BlogForm";

export default function AddBlog() {
  const nav = useNavigate();

  const [blog, setBlog] = useState({
    title: "",
    location: "",
    excerpt: "",
    content: "",
    coverImage: "",
    authorName:"",
    metaTitle: "",
    metaDescription: "",
    isFeatured: false,
    isPublished: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/blogs", blog);
    nav("/admin/blogs");
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-heading mb-6">Add Blog</h1>
        <BlogForm
          blog={blog}
          setBlog={setBlog}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}