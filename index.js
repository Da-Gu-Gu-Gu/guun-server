const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"],
    credentials: true,
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
    console.log(meetingRooms);
  });

  socket.on("video", ({ user, signal }) => {
    console.log("afdf", user);
    io.emit(`video${user.email}`, { signal });
  });

  // status to condition,change sender to array,
  socket.on("entermeetingroom", ({ roomid, sender, signal }) => {
    const room = getRoom(roomid);
    // console.log(roomid);

    // console.log(room);
    if (room) {
      io.emit(`getMessage${room.roomId}`, {
        sender,
      });

      // console.log("work");
    } else {
      let newroom = addRooms(roomid, socket.id);
      // console.log(meetingRooms);
      let nr = getRoom(roomid);
      // console.log(nr);
      io.emit(`getMessage${nr.roomId}`, {
        sender,
      });
      // console.log(" work 2");
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    removeRoom(socket.id);
  });
});

httpServer.listen(PORT, () => console.log("server is running on 5000"));
