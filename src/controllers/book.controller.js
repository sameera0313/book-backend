import Book from '../models/book.model.js';
import Wishlist from '../models/wishlist.model.js';
import { createResponse } from '../utils/response.js';

export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().select('-__v');
    res.json(createResponse(true, 'Books retrieved successfully', books));
  } catch (error) {
    res.status(500).json(createResponse(false, 'Error retrieving books'));
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.userId;

    // Verify book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json(createResponse(false, 'Book not found'));
    }

    // Find or create wishlist for user
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, books: [] });
    }

    // Add book if not already in wishlist
    if (!wishlist.books.includes(bookId)) {
      wishlist.books.push(bookId);
      await wishlist.save();
    }

    // Populate books details
    await wishlist.populate('books', '-__v');

    res.json(createResponse(true, 'Book added to wishlist', wishlist));
  } catch (error) {
    res.status(500).json(createResponse(false, 'Error adding book to wishlist'));
  }
};

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.userId;
    const wishlist = await Wishlist.findOne({ user: userId })
      .populate('books', '-__v');

    if (!wishlist) {
      return res.json(createResponse(true, 'Wishlist is empty', { books: [] }));
    }

    res.json(createResponse(true, 'Wishlist retrieved successfully', wishlist));
  } catch (error) {
    res.status(500).json(createResponse(false, 'Error retrieving wishlist'));
  }
};

export const createBook = async (req, res) => {
  try {
    const { title, image, author, description, publishedYear, genre , forwardedTo} = req.body;
    if(!title || !image || !author || !description || !publishedYear || !genre || !forwardedTo){
      return res.status(400).json(createResponse(false, 'Missing required fields'));
    }

    // Create a new book entry
    console.log(1);
    
    const newBook = await Book.create({
      title,
      image,
      author,
      description,
      publishedYear,
      genre,
      forwardedTo
    });

    res.status(201).json(createResponse(true, 'Book created successfully', newBook));
  } catch (error) {
    console.log(error);
    
    res.status(500).json(createResponse(false, 'Error creating book', error.message));
  }
};