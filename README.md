# matrix-diskstation-bot

Send Synology DiskStation alerts to your [Matrix](https://matrix.org/) room(s).

## Running / Building

This assumes you have at least **NodeJS 12 or higher**.

Run `npm install` to get the dependencies.

To build it: `npm run build`.

To run it: `npm run start:dev`

To check the lint: `npm run lint`

### Configuration

This template uses a package called `config` to manage configuration. The default configuration is offered
as `config/default.yaml`. Copy/paste this to `config/development.yaml` and `config/production.yaml` and edit
them accordingly for your environment. These are listed in `.gitignore`.

## DiskStation Docker Setup

IMO, the easiest way to run this on your DiskStation is using Docker. The DiskStation has a built-in Docker
GUI. Pull the image from https://hub.docker.com/r/kb1rdweb/matrix-diskstation-bot. Once it's downloaded,
double-click on it and it will open a "Create container" GUI. I would recommend a 50MB limit for RAM usage.
Now, in click on `Advanced Settings`. Under "Port Settings," remove the `8080/tcp` port since this is all
local. Now, under "Volume," add a config file that has a mount path of `/usr/src/app/config/production.yaml`.
Once you have configured it, you should start the container. Double-click on the container (under the main
Docker window and under the "Container" tab on the left). This will open a window. Click on the "Terminal"
tab. This should show you the bot running. Click the dropdown next to "Create" and press "Launch with
Command." Use `ip address` as your command. This will show you the container's IP address and you can derive
a URL from this. Ex, if your IP is 172.17.0.2, the URL is `http://172.17.0.2`. This ensures that only the
DiskStation can access the push endpoint for maximum security.

## DiskStation Setup

First, make sure you've set up the config file to your liking.

This uses the Synology DiskStation SMS push system, but pushes to Matrix instead. IMO, The DiskStation SMS
setup is a bit awkward, though. Open the control panel on your DiskStation and open "Notification". Next,
move over to the SMS tab at the top and click "Add SMS provider."

You can name this anything you want. The URL should point to wherever you're running this server with an
optional path component (which will be ignored.) A valid URL could be `http://127.0.0.1`, though you **should
never use HTTP over the open internet.** Set the HTTP method to `POST` and hit next.

On the next screen, the dialog title should be "Edit HTTP Request Header." Hit next.

On the next screen, the dialog title should be "Edit HTTP Request Body." If it says "Select the corresponding
category for each parameter," you selected `GET` instead of `POST`. Otherwise, you should use the "Add"
button to add 4 parameters: `user`, `pass`, `text`, and `dummy-number`. (`dummy-number` can be named anything
since it's ignored) The key and value should be made the same. Hit next.

On the final screen, you should now see "Select the corresponding category for each parameter." You should
also see four dropdowns (`user`, `pass`, `text`, and whatever the third parameter you chose was). Now, use
the dropdown to select `Username` next to `user`, `Password` next to `pass`, `Message Content` next to
`text`, and `Phone number` next to the final parameter. Now click apply.

With any luck, you should now be able to choose your SMS provider from the dropdown. For the username and
password, use the `user` and `pass` under the `listen` section of your config file. Enter any phone number in
the primary phone number field. Now click apply

Once the bot's been started, you should be able to invite it to a room (assuming your MXID is listed in the
config file). Use the "Send a test SMS message" button in the same panel on the DiskStation to test it.

## Making sure you get the right messages

By default, the DiskStation will not send many alerts via SMS. Click on the "Advanced" tab under
"Notifications" and check the SMS box for each category you would like to receive alerts in.

## Help!

Come visit us in [#matrix-it-bots:kb1rd.net](https://matrix.to/#/#matrix-it-bots:kb1rd.net) on Matrix if you're
having trouble with the bots or you'd just like to chat.

## Credits

Credit to TravisR's [matrix-bot-sdk-bot-template](https://github.com/turt2live/matrix-bot-sdk-bot-template) for a super easy-to-use template.
