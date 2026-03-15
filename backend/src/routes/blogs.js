import express from "express";
import prisma from "../prisma.js";
import auth, { adminOnly } from "../middlewares/auth.js";
import slugify from "slugify";

const router = express.Router();

router.post("/", auth, adminOnly, async (req, res) => {
  try {
    const {
      title,
      location,
      excerpt,
      content,
      coverImage,
      authorName,
      metaTitle,
      metaDescription,
      isFeatured,
      isPublished
    } = req.body;

    const slug = slugify(title, { lower: true, strict: true });

    const blog = await prisma.blog.create({
      data: {
        title,
        location,
        slug,
        excerpt,
        content,
        coverImage,
        authorName,
        metaTitle,
        metaDescription,
        isFeatured: Boolean(isFeatured),
        isPublished: Boolean(isPublished)
      }
    });

    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to create blog" });
  }
});

router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const {
      title,
      location,
      excerpt,
      content,
      coverImage,
      authorName,
      metaTitle,
      metaDescription,
      isFeatured,
      isPublished
    } = req.body;

    const slug = slugify(title, { lower: true, strict: true });

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        title,
        location,
        slug,
        excerpt,
        content,
        coverImage,
        authorName,
        metaTitle,
        metaDescription,
        isFeatured: Boolean(isFeatured),
        isPublished: Boolean(isPublished)
      }
    });

    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Blog update failed" });
  }
});

router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    await prisma.blog.delete({
      where: { id: Number(req.params.id) }
    });

    res.json({ msg: "Blog deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Blog delete failed" });
  }
});

router.get("/admin/all", auth, adminOnly, async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: "desc" }
    });

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch blogs" });
  }
});

router.get("/", async (req, res) => {
  try {
    const blogs = await prisma.blog.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" }
    });

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch blogs" });
  }
});
// GET /api/blogs/bloglist
router.get("/bloglist", async (req, res) => {
  try {
    const featured = await prisma.blog.findFirst({
      where: {
        isFeatured: true,
        isPublished: true
      },
      orderBy: { createdAt: "desc" }
    });

    const blogs = await prisma.blog.findMany({
      where: {
        isPublished: true
      },
      orderBy: { createdAt: "desc" }
    });

    res.json({ featured, blogs });

  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch blogs" });
  }
});
// router.get("/featured", async (req, res) => {
//   try {
//     const blogs = await prisma.blog.findMany({
//       where: {
//         isFeatured: true,
//         isPublished: true
//       },
//       orderBy: { createdAt: "desc" }
//     });

//     res.json(blogs);
//   } catch (err) {
//     res.status(500).json({ msg: "Failed to fetch featured blogs" });
//   }
// });

router.get("/:slug", async (req, res) => {
  try {
    const blog = await prisma.blog.findUnique({
      where: { slug: req.params.slug }
    });

    if (!blog || !blog.isPublished) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    res.json(blog);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch blog" });
  }
});
router.get("/:slug/details", async (req, res) => {
  try {
    const blog = await prisma.blog.findUnique({
      where: { slug: req.params.slug }
    });

    if (!blog) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    let hotels = [];
    let villas = [];
    let campings = [];

    if (blog.location) {

      hotels = await prisma.hotel.findMany({
        where: {
          location: { contains: blog.location }
        },
        include:{
          hotelimage:true,
          room:true
        },
        take: 4
      });

      villas = await prisma.villa.findMany({
        where: {
          location: {contains: blog.location}
        },
        include:{
          villaimage:true,
        },
        take: 4
      });

      campings = await prisma.camping.findMany({
        where: {
          location: {contains: blog.location}
        },
        include:{
          campingimage:true,
          campingpricing:true
        },
        take: 4
      });

    }

    res.json({
      blog,
      hotels,
      villas,
      campings
    });

  } catch (err) {
    console.error("BLOG DETAILS ERROR:", err);
    res.status(500).json({ msg: "Failed to fetch blog details" });
  }
});

export default router;