## Getting Started

This document is intended to get you started quickly in building a backend driven Node.js application complete with pages and content, backend logic and a PostgreSQL database for data storage.
## Prerequisites

The only prerequisite software required to have installed at this point is Git for version control and a code editor - we will use VS Code (VSC).

## Package Management

The foundation of the project development software is Node. While functional, Node depends on "packages" to add functionality to accomplish common tasks. This requires a package manager. Three common managers are NPM (Node Package Manager), YARN, and PNPM. While all do the same thing, they do it slightly differently. We will use PNPM for two reasons: 1) All packages are stored on your computer only once and then symlinks (system links) are created from the package to the project as needed, 2) performance is increased meaning that when the project builds, it does so faster.
You will need to either install or activate PNPM before using it. See https://pnpm.io/

## Install the Project Dependencies

1. Open the downloaded project folder (where this file is located) in VS Code (VSC).
2. Open the VSC terminal: Terminal > New Window.
3. Run the following command in the terminal:

    pnpm install

4. The first time it may take a few minutes, depending on the speed of your computer and the speed of your Internet connection. This command will instruct PNPM to read the package.json file and download and install the dependencies (packages) needed for the project. It will build a "node_modules" folder storing each dependency and its dependencies. It should also create a pnpm-lock.yaml file. This file should NEVER be altered by you. It is an internal file (think of it as an inventory) that PNPM uses to keep track of everything in the project.

## Start the Express Server

With the packages installed you're ready to run the initial test.
1. If the VSC terminal is still open use it. If it is closed, open it again using the same command as before.
2. Type the following command, then press Enter:

    pnpm run dev

3. If the command works, you should see the message "app listening on localhost:5500" in the console.
4. Open the package.json file.
5. Note the "Scripts" area? There is a line with the name of "dev", which tells the nodemon package to run the server.js file.
6. This is the command you just ran.
7. Open the server.js file.
8. Near the bottom you'll see two variables "Port" and "Host". The values for the variables are stored in the .env file.
9. These variables are used when the server starts on your local machine.

## Move the demo file

When you installed Git and cloned the remote repository in week 1, you should have created a simple web page.
1. Find and move that simple web page to the public folder. Be sure to note its name.
## Test in a browser

1. Go to http://localhost:5500 in a browser tab. Nothing should be visible as the server has not been setup to repond to that route.
2. Add "/filename.html" to the end of the URL (replacing filename with the name of the file you moved to the public folder).
3. You should see that page in the browser.

## Notes
A token is simply a "ticket", which is carried from one location to another. Upon arrival, the ticket is examined for authenticity. If valid, the ticket holder is admitted. In our case, the JWT is created on our server and sent to the client's browser within a cookie. The client will automatically send the cookie back to our server with every request. When the cookie arrives, the server checks the token it carries. If valid, the server allows the request to be carried out. If the token is missing or not valid, the request is denied.

Unfortunately, using a cookie as the transfer mechanism creates a potential means of attacking our server, known as a Cross Site Request Forgery attack. In short, another site steals the cookie, then sends the cookie to our server, pretending to be the browser to whom the cookie was originally sent.

Cookie? No, not that kind (I love white chocolate chip with macadamia nuts - just in case you are interested)! I know, it's a strange name for a small text file that is created by the server, sent to and stored in the browser. As with most data it consists of a number of "name - value pairs". What is unique is that when the browser visits the website that created the cookie, the cookie is automatically sent back to the server as part of every "http request" until the cookie is destroyed.

Cookies are small. The maximum size they can be is 4K (4 kilobytes). In addition, they are typically plain text and can be changed in the browser. As a result, they should NEVER be used for sensitive information!

Without getting carried away, you should know that there are several types of cookies:

Persistent Cookie
A "persistent" cookie is one which lasts beyond the current set of interactions between the browser and the server. These cookies are given a life span at the time they are created. That life span can be increased or decreased by the code on the server. The means of setting the lifespan is by using the expire value, as an option, in the res.cookie(name, 'value', {expire: 3600000 + Date.now()}) . In the provided example the cookie will expire in one hour (1000 milliseconds * 60 seconds * 60 minutes).
Session Cookie
A "session" cookie is created without an "expire" option and is destroyed when the session ends. Typically, there are three main ways of ending a session:
The browser window is closed.
The session "times out" due to inactivity. This time factor can be altered but typically is around 24 minutes.
The cookie is given an expiry value in the past or perhaps of 1 millisecond in the future. This can occur at the end of a logout procedure or at the end of a "check-out" process.
There are other cookies, but to one extent or another they are variations of the persistent cookie.

Have you ever registered with a website and when you return to the site sometime in the future, the site somehow shows your name, even when you haven't logged into the site? Chances are it is a cookie at work. Some sites use "Third Party Cookies". A third-party cookie is set by one website, but used by another website. This use is usually for advertising but can also be used for tracking your browsing habits. It is this browsing function that has caused a wide variety of new privacy laws to be passed and forced websites to notify you that they use cookies. Perhaps you've seen such notices appear on websites you visit, that show you a warning notice that you have to acknowledge for it to go away.


