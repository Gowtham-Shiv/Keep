require('dotenv').config();
const express = require('express');
const cors = require('cors');
const config = require("./config.json");
const app = express();
const mongoose = require("mongoose");
mongoose.connect(config.connnectionString);

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities.js")
const User = require("./models/user.model.js")
const Note = require("./models/note.model.js")


app.use(express.json());

app.use(
    cors({
        origin: "*",
    })
);

app.get("/", (req, res) => {
    res.json({ data: "Hello" });
})

// create acc
app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName) {
        return res.status(400).json({ error: true, message: "Fullname Required" });
    }
    if (!email) {
        return res.status(400).json({ error: true, message: "Email Required" });
    }
    if (!password) {
        return res.status(400).json({ error: true, message: "Password Required" });
    }
    const isUser = await User.findOne({ email: email });

    if (isUser) {
        return res.json({
            error: true,
            message: "User already exist"
        });
    }
    const user = new User({
        fullName,
        email,
        password,
    });

    await user.save();
    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN, {
        expiresIn: "36000m",
    });

    return res.json({
        error: false,
        user,
        accessToken,
        message: "Registration Success",
    });
});

// login
app.post("/login", async (req, res) => { 

    const { email, password } = req.body;
    if (!email) {
        return res.status(400).json({ error: true, message: "Email Required" });
    }
    if (!password) {
        return res.status(400).json({ error: true, message: "Password Required" });
    }
    const userInfo = await User.findOne({ email: email });

    if (!userInfo) {
        return res.status(400).json({ message: "User not found" });
    }

    if (userInfo.email == email && userInfo.password == password) {
        const user = { user: userInfo };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN, {
            expiresIn: "36000m",
        });
        return res.json({
            error: false,
            message: "Login Succesfull",
            email,
            accessToken,
        });
    } else {
        return res.status(400).json({
            error: true,
            message: "Invalid Login Credentials",
        });
    }
});

// get user
app.get("/get-user", authenticateToken, async (req, res) => {
    const { user } = req.user;
    const isUser = await User.findOne({ _id: user._id });

    if (!isUser) {
        return res.sendStatus(401);
    }
    return res.json({
        user: {
            fullName: isUser.fullName,
            email: isUser.email,
            "_id": isUser._id,
            createdOn: isUser.createdOn,
        },
        message: "",
    });
});

// add note
app.post("/add-note", authenticateToken, async (req, res) => {
    const { title, content, tags } = req.body;
    const { user } = req.user;

    if (!title) {
        return res.status(400).json({ error: true, message: "Title Required" });
    }
    if (!content) {
        return res.status(400).json({ error: true, message: "Content Required" });
    }

    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id,
        });

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note added successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Error",
        });
    }
});

// edit note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;
    const { user } = req.user;

    if (!title && !content && !tags) {
        return res.status(400)
            .json({ error: true, message: "No changes Provided" });
    }

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" })
        }

        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (isPinned) note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note added successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Error",
        });
    }
});

// get all notes
app.get("/get-all-notes", authenticateToken, async (req, res) => {
    const { user } = req.user;

    try {
        const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });

        return res.json({
            error: false,
            notes,
            message: "All notes retriwed",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Error",
        });
    }
});

// delete notes
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { user } = req.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id })
        if (!note) {
            return res.status(404).json({
                error: true,
                message: "Note not found"
            });
        }
        await Note.deleteOne({ _id: noteId, userId: user._id });

        return res.json({
            error: false,
            message: "Note deleted",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Error",
        });
    }
});

// Update is pinned
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const { user } = req.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" })
        }

       note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note added successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Error",
        });
    }
});

// search notes
app.get("/search-notes/", authenticateToken, async (req, res) => {
    const { user } = req.user;
    const { query } = req.query;

    if (!query) {
        return res.status(400)
            .json({ error: true, message: "Serach query is required" });
    }

    try {
        const matchingNotes = await Note.find({
            userId: user._id,
            $or: [
                { title: { $regex: new RegExp(query, "i") } },
                { content: { $regex: new RegExp(query, "i") } },
            ],
        });
        return res.json({
            error: false,
            notes: matchingNotes,
            message: "Notes matching success",
        });

    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Error",
        });
    }
});

app.listen(8000);

module.exports = app;
