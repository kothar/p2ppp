import Peer, { DataConnection } from 'peerjs';

export class PeerGroup {
    private peers: Record<string, DataConnection> = {};
    private localPeer: Peer;

    constructor(readonly playerUuid: string) {
        this.localPeer = new Peer(playerUuid);
        this.localPeer.on('open', id => {
            console.log(`Local peer registered: ${id}`);
        })
    }

    connect(remotePlayer: string) {
        console.log(`Connecting to peer ${remotePlayer}`);

        const conn = this.localPeer.connect(remotePlayer);
        conn.on('open', () => {
            console.log(`Peer connection open to ${remotePlayer}`)

            // Receive messages
            conn.on('data', function (data) {
                console.log(`Received from ${remotePlayer}`, data);
            });

            // Send messages
            conn.send('Hello!');
        })
        this.peers[remotePlayer] = conn;
    }

    setPlayers(players: string[]) {
        players
            .filter(p => p !== this.playerUuid && !this.peers[p])
            .forEach(p => this.connect(p))
    }
}
