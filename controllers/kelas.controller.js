const { kelas } = require('../models');
const Sequelize = require('sequelize');

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