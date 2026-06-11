const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Data store (temporary)
let enrollments = [];

// API Route
app.post("/api/enroll", (req, res) => {
    const { name, phone, course } = req.body;

    if (!name || !phone) {
        return res.json({
            ok: false,
            message: "Name aur phone required hain."
        });
    }

    const student = {
        id: Date.now(),
        name,
        phone,
        course,
        createdAt: new Date()
    };

    enrollments.push(student);

    console.log("New Enrollment:", student);

    res.json({
        ok: true,
        message: "Free trial successfully booked!"
    });
});

// Admin Route
app.get("/api/enrollments", (req, res) => {
    res.json(enrollments);
});

// Frontend Files
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});