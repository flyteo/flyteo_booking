import api from "../axios";

export default function BlogForm({ blog, setBlog, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">

      <input
        className="w-full p-3 border rounded"
        placeholder="Title"
        value={blog.title}
        onChange={(e) =>
          setBlog({ ...blog, title: e.target.value })
        }
      />
      <input
        className="w-full p-3 border rounded"
        placeholder="Location"
        value={blog.location}
        onChange={(e) =>
          setBlog({ ...blog, location: e.target.value })
        }
      />

      <textarea
        className="w-full p-3 border rounded h-24"
        placeholder="Excerpt"
        value={blog.excerpt}
        onChange={(e) =>
          setBlog({ ...blog, excerpt: e.target.value })
        }
      />

      <textarea
        className="w-full p-3 border rounded h-40"
        placeholder="Content"
        value={blog.content}
        onChange={(e) =>
          setBlog({ ...blog, content: e.target.value })
        }
      />

     {/* COVER IMAGE UPLOAD */}
<div>
  <label className="text-sm font-medium">
    Cover Image
  </label>

  <input
    type="file"
    accept="image/*"
    className="w-full border p-2 rounded mt-1"
    onChange={async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const fd = new FormData();
      fd.append("image", file);

      try {
        const res = await api.post(
          "/upload",
          fd,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );

        setBlog({
          ...blog,
          coverImage: res.data.url
        });

      } catch (err) {
        console.error("Image upload failed");
      }
    }}
  />

  {/* PREVIEW */}
  {blog.coverImage && (
    <>
    <img
      src={blog.coverImage}
      className="mt-3 h-60 w-60 object-cover rounded shadow"
      alt="Blog Preview"
    />
    <button
    type="button"
    className="mt-2 text-red-600 text-sm"
    onClick={() =>
      setBlog({ ...blog, coverImage: "" })
    }
  >
    Remove Image
  </button>
 </> )}
  {/* {blog.coverImage && (
  
)} */}
</div>

      <input
        className="w-full p-3 border rounded"
        placeholder="Meta Title"
        value={blog.metaTitle}
        onChange={(e) =>
          setBlog({ ...blog, metaTitle: e.target.value })
        }
      />

      <textarea
        className="w-full p-3 border rounded h-20"
        placeholder="Meta Description"
        value={blog.metaDescription}
        onChange={(e) =>
          setBlog({ ...blog, metaDescription: e.target.value })
        }
      />

      <div className="flex gap-6">
        <label>
          <input
            type="checkbox"
            checked={blog.isFeatured}
            onChange={(e) =>
              setBlog({ ...blog, isFeatured: e.target.checked })
            }
          />{" "}
          Featured
        </label>

        <label>
          <input
            type="checkbox"
            checked={blog.isPublished}
            onChange={(e) =>
              setBlog({ ...blog, isPublished: e.target.checked })
            }
          />{" "}
          Published
        </label>
      </div>

      <button
        type="submit"
        className="bg-palmGreen text-white px-6 py-2 rounded"
      >
        Save Blog
      </button>
    </form>
  );
}