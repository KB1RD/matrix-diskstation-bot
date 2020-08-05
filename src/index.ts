import {
    MatrixEvent,
    LogLevel,
    LogService,
    MatrixClient,
    RichConsoleLogger,
    SimpleFsStorageProvider
} from "matrix-bot-sdk";
import * as path from "path";
import config from "./config";
import * as http from "http";

// First things first: let's make the logs a bit prettier.
LogService.setLogger(new RichConsoleLogger());

// For now let's also make sure to log everything (for debugging)
LogService.setLevel(LogLevel.DEBUG);

// Print something so we know the bot is working
LogService.info("index", "Bot starting...");

// Prepare the storage system for the bot
const storage = new SimpleFsStorageProvider(path.join(config.dataPath, "bot.json"));

// Create the client
const client = new MatrixClient(config.homeserverUrl, config.accessToken, storage);

client.on("room.invite", (roomId: string, inviteEvent: MatrixEvent<any>) => {
    if (!config.acceptedInviteUsers.includes(inviteEvent.sender)) {
        // TODO: Reject invite
        LogService.info(
            "index",
            `Invited by user ${inviteEvent.sender} to join ${roomId}, but that user is not in the config 'acceptedInviteUsers'. Ignoring...`
        );
        return;
    }
    LogService.info(
        "index",
        `Invited by user ${inviteEvent.sender} to join ${roomId}. Joining...`
    );
    return client.joinRoom(roomId);
});

// Called when a new message is received
const postMessage = async function (text: string) {
    LogService.info("index", `Got message ${text}`);

    // List out all rooms
    const rooms = await client.getJoinedRooms()
    await Promise.all(rooms.map(async function (roomId) {
        try {
            // Try to send message; Don't break everything if one fails.
            await client.sendMessage(roomId, {
                body: text,
                msgtype: "m.notice"
            });
        } catch (e) {
            LogService.info("warn", `Error sending to room ${roomId}`, e);
        }
    }));
};

// This is the startup closure where we give ourselves an async context
(async function () {
    // await commands.start();
    LogService.info("index", "Starting sync...");

    // Set up a fake SMS server
    http.createServer(function (req, res) {
        if (req.method === "POST") {
            let body = "";
            req.on("data", function (chunk: string) {
                body += chunk;
            });
            req.on("end", function () {
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end(body);

                // Try parsing the JSON body
                try {
                    const body_obj = JSON.parse(body);
                    if (body_obj) {
                        if (
                            body_obj.user === config.listen.user &&
                            body_obj.pass === config.listen.pass &&
                            typeof body_obj.text === "string"
                        ) {
                            return postMessage(body_obj.text);
                        }
                    }
                    LogService.warn('Received invalid request', body);
                } catch(e) {
                    LogService.warn('Received invalid request', e);
                }
            });
        }
    }).listen(config.listen.port, config.listen.addr);

    await client.start(); // This blocks until the bot is killed
})();
