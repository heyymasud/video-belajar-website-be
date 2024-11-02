const { kelas } = require('../models');
const Sequelize = require('sequelize');

/**
 * Fetches all classes from the database, with optional filtering and sorting.
 *
 * This function accepts the following query parameters:
 *
 * - `kategori`: The ID of the category to filter by.
 * - `sortBy`: The field to sort by. If not provided, defaults to `KelasID`.
 * - `sortOrder`: The direction of the sort. If not provided, defaults to `asc`.
 * - `search`: A search string to filter classes by name.
 *
 * @param {import('express').Request} req Express request object.
 * @param {import('express').Response} res Express response object.
 * @returns {Promise<void>}
 */
const getAllKelas = async (req, res) => {
    try {
        const { kategori, sortBy, sortOrder, search } = req.query;

        let whereCondition = {};
        let orderCondition = [];

        if (kategori) {
            whereCondition.KategoriKelasID = kategori;
        }

        if (search) {
            whereCondition.NamaKelas = { [Sequelize.Op.like]: `%${search}%` };
        }

        if (sortBy) {
            const orderDirection = sortOrder === 'desc' ? 'DESC' : 'ASC';
            orderCondition.push([sortBy, orderDirection]);
        }

        const allKelas = await kelas.findAll({
            where: whereCondition,
            order: orderCondition
        });
        if (allKelas.length === 0) {
            return res.status(200).json({ message: "No classes found." });
        }
        return res.status(200).json(allKelas);
    } catch (error) {
        console.error("Error fetching classes:", error);
        return res.status(500).json({ message: "Error fetching classes", error });
    }
};

/**
 * Fetches a class by its ID from the database.
 *
 * @param {import('express').Request} req Express request object.
 * @param {import('express').Response} res Express response object.
 * @returns {Promise<void>}
 */
const getKelasById = async (req, res) => {
    const id = req.params.id;
    try {
        const foundKelas = await kelas.findByPk(id);
        if (!foundKelas) {
            return res.status(404).json({ message: "Class not found" });
        }
        return res.status(200).json(foundKelas);
    } catch (error) {
        console.error("Error fetching class:", error);
        return res.status(500).json({ message: "Error fetching class", error });
    }
};

/**
 * Creates a newKelas in the database.
 *
 * @param {import('express').Request} req Express request object.
 * @param {import('express').Response} res Express response object.
 *
 * @returns {Promise<void>}
 *
 * This function takes the request body's NamaKelas, Deskripsi, KategoriKelasID, TutorID and Harga, and attempts to create a new class in the database.
 * If a class with the same name already exists, a 400 error is sent.
 * Otherwise, a new class is created, and a 201 success message is sent.
 * If an error occurs, a 500 error is sent.
 */
const createKelas = async (req, res) => {
    const { NamaKelas, Deskripsi, KategoriKelasID, TutorID, Harga } = req.body;

    const imageFile = req.file;

    try {
        const newKelas = await kelas.create({
            NamaKelas,
            Deskripsi,
            KategoriKelasID,
            TutorID,
            Harga,
            ImageUrl: imageFile ? `http://localhost:3000/upload/${imageFile.filename}` : null
        });

        return res.status(201).json({ message: "Class created successfully", newKelas });
    } catch (error) {
        console.error("Error creating class:", error);
        return res.status(500).json({ message: "Error creating class", error });
    }
};

/**
 * Updates a class in the database.
 *
 * @param {import('express').Request} req Express request object.
 * @param {import('express').Response} res Express response object.
 *
 * @returns {Promise<void>}
 *
 * This function takes the request body's NamaKelas, Deskripsi, KategoriKelasID, TutorID and Harga, and attempts to update a class in the database.
 * If the class is not found, a 404 error is sent.
 * Otherwise, the class is updated, and a 200 success message is sent.
 * If an error occurs, a 500 error is sent.
 */
const updateKelas = async (req, res) => {
    const id = req.params.id;
    try {
        const { NamaKelas, Deskripsi, KategoriKelasID, TutorID, Harga } = req.body;
        const [updated] = await kelas.update(
            { NamaKelas, Deskripsi, KategoriKelasID, TutorID, Harga },
            { where: { KelasID: id } }
        );

        if (updated) {
            const updatedKelas = await kelas.findByPk(id);
            return res.status(200).json({ message: "Class updated successfully", updatedKelas });
        }
        return res.status(404).json({ message: "Class not found" });
    } catch (error) {
        console.error("Error updating class:", error);
        return res.status(500).json({ message: "Error updating class", error });
    }
};

/**
 * Deletes a class by its ID from the database.
 *
 * @param {import('express').Request} req Express request object.
 * @param {import('express').Response} res Express response object.
 *
 * @returns {Promise<void>}
 *
 * This function attempts to delete a class in the database.
 * If the class is not found, a 404 error is sent.
 * Otherwise, the class is deleted, and a 200 success message is sent with the deleted class's ID.
 * If an error occurs, a 500 error is sent.
 */
const deleteKelas = async (req, res) => {
    const id = req.params.id;
    try {
        const deleted = await kelas.destroy({ where: { KelasID: id } });
        if (deleted) {
            return res.status(200).json({
                message: "Class deleted successfully",
                deletedClassId: id
            });
        }
        return res.status(404).json({ message: "Class not found" });
    } catch (error) {
        console.error("Error deleting class:", error);
        return res.status(500).json({ message: "Error deleting class", error });
    }
};

/**
 * Handles the uploading of an image file.
 *
 * @param {import('express').Request} req - Express request object containing the uploaded file.
 * @param {import('express').Response} res - Express response object used to send the response.
 *
 * @returns {Promise<void>} - A promise that resolves when the image has been uploaded or an error has occurred.
 *
 * This function checks if an image file is present in the request. If no image file is uploaded, a 400 error is sent.
 * If the image file is uploaded successfully, a 200 success message is sent along with the image URL.
 * If an error occurs during the upload process, a 500 error is sent.
 */
const uploadImage = async (req, res) => {
    const imageFile = req.file;
    if (!imageFile) {
        return res.status(400).json({ message: "No image file uploaded" });
    }

    try {
        return res.status(200).json({ message: "Image uploaded successfully", imageUrl: imageFile.filename });
    } catch (error) {
        console.error("Error uploading image:", error);
        return res.status(500).json({ message: "Error uploading image", error });
    }
};

module.exports = {
    getAllKelas,
    getKelasById,
    createKelas,
    updateKelas,
    deleteKelas,
    uploadImage
};