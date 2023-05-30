## Peer to Peer Planning Poker

### [Live site](https://p2ppp.kothar.net)

P2PPP is a proof-of-concept planning poker app using peer-to-peer
[WebRTC data channels][dc] to coordinate voting among players at a
table.

The application is implemented using [Next.js][1] 13, [PeerJS][2],
[Fauna][3] (DB) and is deployed on [Vercel][4].

For another example of a Planning Poker implementation by a colleague
of mine, see [vote.poker][vp] ([code][vpc]).

[dc]: https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Using_data_channels

[1]: https://nextjs.org/

[2]: https://peerjs.com/

[3]: https://fauna.com/

[4]: https://vercel.com/

[vp]: https://vote.poker

[vpc]: https://github.com/chrisemerson/vote.poker

## Getting Started

First, install the project dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

*Fauna is temporarily required to allow peers to discover each other*

Sign up for a Fauna DB account and create a collection with the 
following properties:
```json5
{
  name: "players",
  history_days: 0,
  ttl_days: 1
}
```

Create the following indices:
```json5
{
  name: "player",
  unique: true,
  serialized: true,
  source: "players",
  terms: [
    {
      field: ["data", "tableUuid"]
    },
    {
      field: ["data", "playerUuid"]
    }
  ],
  values: [
    {
      field: ["data", "playerUuid"]
    },
    {
      field: ["data", "playerName"]
    },
    {
      field: ["ref"]
    }
  ]
}
```

```json5
{
  name: "table",
  unique: false,
  serialized: true,
  source: "players",
  terms: [
    {
      field: ["data", "tableUuid"]
    }
  ],
  values: [
    {
      field: ["data", "playerUuid"]
    },
    {
      field: ["data", "playerName"]
    }
  ]
}
```

Create a `.env.local` file in your working directory containing a 
Fauna DB key:
```bash
FAUNADB_SECRET=<key with read/write access to your DB table>
```

Next, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser
to see the result.

