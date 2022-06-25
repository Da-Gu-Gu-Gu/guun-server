const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());

app.use(cors());
const PORT = process.env.PORT || 5000;

//route
const UserRoute = require("./routes/user");
app.use("/api/user", UserRoute);

mongoose
  .connect(process.env.MONGOSE)
  .then(() => console.log("good"))
  .catch((err) => console.log(err));

let meetingRooms = [];

const addRooms = (roomId, socketId) => {
  !meetingRooms.some((x) => x.roomId === roomId) &&
    meetingRooms.push({ roomId, socketId });
};

const removeRoom = (socketId) => {
  meetingRooms = meetingRooms.filter((x) => x.socketId !== socketId);
};

const getRoom = (roomId) => {
  return meetingRooms.find((x) => x.roomId === roomId);
};

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("addRoom", (roomId) => {
    addRooms(roomId, socket.id);
  });

  socket.on("entermeetingroom", ({ roomid, sender, text }) => {
    const room = getRoom(roomid);
    console.log(roomid);

    console.log(room);
    if (room) {
      io.emit(`getMessage${room.roomId}`, {
        sender,
        text,
        roomid,
      });
      console.log("work");
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    removeRoom(socket.id);
  });
});

app.listen(PORT, () => console.log("server is running on 5000"));
