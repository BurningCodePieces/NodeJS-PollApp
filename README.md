# NodeJS-PollApp

Simple PollApp created with NodeJS. Statelessness is provided by using JSON Web Tokens. Users can answer both in online and offline modes. When user answers in offline mode, the poll data is cached in local database - IndexedDB. Whenever the connection to the web is restored, user can send the data to the real database on server (MongoDB). Logged user can can also see the poll results (CanvasJS chart).
