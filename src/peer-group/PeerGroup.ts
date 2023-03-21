import { Player } from '@/state/player';
import Peer, { DataConnection } from 'peerjs';

export class PeerGroup {
    private peers: Record<string, DataConnection> = {};
    private localPeer: Peer;

    constructor(readonly player: Player, readonly players: Record<string, Player>) {
        this.localPeer = new Peer(player.uuid);
        this.localPeer.on('open', id => {
            console.log('Local peer registered');
        })
        Object.values(players)
            .filter(p => p.uuid !== player.uuid)
            .forEach(p => this.connect(p))
    }

    connect(remotePlayer: Player) {
        const conn = this.localPeer.connect(remotePlayer.uuid);
        conn.on('open', () => {
            console.log(`Peer connection open to ${remotePlayer.uuid}`)

            // Receive messages
            conn.on('data', function (data) {
                console.log('Received', data);
            });

            // Send messages
            conn.send('Hello!');
        })
        this.peers[remotePlayer.uuid] = conn;
    }
}
