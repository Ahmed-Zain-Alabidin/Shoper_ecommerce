const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

// Utility to upload buffer to Cloudinary
const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "ecommerce/products" },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      },
    );
    const { Readable } = require("stream");
    Readable.from(buffer).pipe(stream);
  });
};

const createProduct = async (req, res, next) => {
  try {
    const { name, description, category, currency } = req.body;
    console.log(
      "📦 [createProduct] req.body.stock (RAW):",
      req.body.stock,
      "Type:",
      typeof req.body.stock,
    );
    const price = parseFloat(req.body.price);
    const originalPrice = req.body.originalPrice
      ? parseFloat(req.body.originalPrice)
      : null;
    const stock = parseInt(req.body.stock, 10);
    console.log(
      "📦 [createProduct] stock (PARSED):",
      stock,
      "Type:",
      typeof stock,
    );
    const seller = req.user._id;

    if (req.user.role !== "seller" && req.user.role !== "admin") {
      return res.status(403).json({
        status: "Error",
        message: "Not authorized to create products",
      });
    }

    let images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await streamUpload(file.buffer);
        images.push(result.secure_url);
      }
    }

    const product = await Product.create({
      name,
      description,
      price,
      originalPrice,
      currency,
      category,
      seller,
      stock,
      images,
    });

    console.log(
      "📦 [createProduct] product.stock (SAVED):",
      product.stock,
      "Type:",
      typeof product.stock,
    );

    res.status(201).json({
      status: "Success",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const { name, category, minPrice, maxPrice, sort, page, limit } = req.query;

    const query = {};

    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let mongooseQuery = Product.find(query).populate("category", "name slug");

    // Sorting
    if (sort) {
      if (sort === "newest") {
        mongooseQuery = mongooseQuery.sort("-createdAt");
      } else if (sort === "rating") {
        mongooseQuery = mongooseQuery.sort("-ratings.average");
      } else if (sort === "price") {
        mongooseQuery = mongooseQuery.sort("price");
      } else if (sort === "-price") {
        mongooseQuery = mongooseQuery.sort("-price");
      } else {
        mongooseQuery = mongooseQuery.sort(sort.split(",").join(" "));
      }
    } else {
      mongooseQuery = mongooseQuery.sort("-createdAt");
    }

    // Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const startIndex = (pageNum - 1) * limitNum;
    const total = await Product.countDocuments(query);

    mongooseQuery = mongooseQuery.skip(startIndex).limit(limitNum);

    const products = await mongooseQuery;

    res.status(200).json({
      status: "Success",
      count: products.length,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
      },
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name slug")
      .populate("seller", "name email");

    if (!product) {
      return res
        .status(404)
        .json({ status: "Error", message: "Product not found" });
    }

    res.status(200).json({
      status: "Success",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ status: "Error", message: "Product not found" });
    }

    if (
      product.seller.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        status: "Error",
        message: "Not authorized to update this product",
      });
    }

    let images = [];
    if (req.body.existingImages) {
      images = Array.isArray(req.body.existingImages)
        ? req.body.existingImages
        : [req.body.existingImages];
    } else if (req.body.images && !req.files) {
      images = Array.isArray(req.body.images)
        ? req.body.images
        : [req.body.images];
    } else if (
      req.body.images === undefined &&
      req.files === undefined &&
      req.body.existingImages === undefined
    ) {
      // If none of these are present, maybe the client didn't send images field at all (PATCH). Keep existing.
      images = product.images;
    }

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await streamUpload(file.buffer);
        images.push(result.secure_url);
      }
    }

    // Always set req.body.images so Mongoose updates it
    req.body.images = images;

    if (typeof req.body.price !== "undefined") {
      const parsedPrice = parseFloat(req.body.price);
      req.body.price = Number.isNaN(parsedPrice) ? req.body.price : parsedPrice;
    }
    if (typeof req.body.originalPrice !== "undefined") {
      if (req.body.originalPrice === "" || req.body.originalPrice === "null") {
        req.body.originalPrice = null;
      } else {
        const parsedOriginalPrice = parseFloat(req.body.originalPrice);
        req.body.originalPrice = Number.isNaN(parsedOriginalPrice)
          ? req.body.originalPrice
          : parsedOriginalPrice;
      }
    }
    if (typeof req.body.stock !== "undefined") {
      console.log(
        "📦 [updateProduct] req.body.stock (RAW):",
        req.body.stock,
        "Type:",
        typeof req.body.stock,
      );
      const parsedStock = parseInt(req.body.stock, 10);
      req.body.stock = Number.isNaN(parsedStock) ? req.body.stock : parsedStock;
      console.log(
        "📦 [updateProduct] req.body.stock (AFTER PARSE):",
        req.body.stock,
        "Type:",
        typeof req.body.stock,
      );
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    console.log(
      "📦 [updateProduct] product.stock (SAVED):",
      product.stock,
      "Type:",
      typeof product.stock,
    );

    res.status(200).json({
      status: "Success",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ status: "Error", message: "Product not found" });
    }

    // Make sure user is product seller or admin
    if (
      product.seller.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        status: "Error",
        message: "Not authorized to delete this product",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      status: "Success",
      message: "Product removed",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
