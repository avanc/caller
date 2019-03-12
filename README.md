Caller
======

Caller is a node.js webserver providing pages to transmit phone numbers from one browser to another.
The use case is to copy phone numbers from a desktop computer to a mobile phone for calling them.

Technique
---------
[socket.io](https://socket.io/) is used to transmit the phone numbers from one browser to another browser via the server. The server acts as relay and does not store any data permanently. [Rooms](https://socket.io/docs/rooms-and-namespaces/) are used as session ID to distinguish different users.


Privacy
-------
As mentioned before, no data is stored on the server permanently. However, to allow sending numbers to a phone which is currently inactive (e.g. screen is locked, browser not open), the number has to be stored in memory on the server for a few minutes.

In addition, any person knowing the session ID (which is part of the url) can listen to the session.

To provide additional privacy, the numbers can be encrypted on the client side. Thus, the numbers cannot be read at the server nor by any third party listening on the session. [TripleSec](https://keybase.io/triplesec) is used for encryption and decryption.
