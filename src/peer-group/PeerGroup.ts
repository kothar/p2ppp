import Peer, { DataConnection } from 'peerjs';
import { isStateUpdate, State, StateUpdate } from '@/state/state';

function formatPeerId(tableUuid: string, playerUuid: string) {
    return `${tableUuid}_${playerUuid}`;
}

export class PeerGroup {
    private peers: Record<string, DataConnection | 'pending'> = {};
    private localPeer: Promise<Peer>;
    private state: State | undefined;
    public onUpdate: ((update: StateUpdate) => void) | undefined;

    constructor(readonly tableUuid: string, readonly playerUuid: string) {
        this.localPeer = new Promise((resolve, reject) => {
            const peer = new Peer(formatPeerId(tableUuid, playerUuid), {
                debug: 2
            })
                .on('open', id => {
                    console.log(`Local peer registered: ${id}`);
                    resolve(peer);
                })
                .on('error', e => {
                    console.log(`Local peer error: ${e.message}`);

                    // Rejects if error before initial connection established
                    reject(e);
                })
                .on('connection', conn => {
                    console.log(`Peer connection request from ${conn.peer}`);

                    conn.on('open', () => {
                        this.register(conn);
                    });
                })
                .on('close', () => {
                    console.log('Local peer connection closed');
                });
        })
    }

    async close() {
        try {
            let localPeer = await this.localPeer;
            Object.values(this.peers).map(peer => peer !== 'pending' && peer.close());
            localPeer.destroy();
        } catch (e: any) {
            console.error(`Unable to close PeerGroup connections: ${e.message ?? 'unknown error'}`);
        }
    }

    setPlayers(players: string[]) {
        players
            .filter(p => p !== this.playerUuid && !this.peers[formatPeerId(this.tableUuid, p)])
            .forEach(p => this.connect(p).catch(console.error));
    }

    setState(state: State) {
        this.state = state;
    }

    sendMessage(update: StateUpdate) {
        Object.entries(this.peers).forEach(([id, peer]) => {
            if (peer === 'pending') {
                console.log(`Unable to deliver update to peer ${id}: connection pending`);
            } else {
                peer.send(update);
            }
        });
    }

    async connect(remotePlayer: string) {
        const localPeer = await this.localPeer;
        const peerId = formatPeerId(this.tableUuid, remotePlayer);
        console.log(`Connecting to peer ${peerId}`);

        this.peers[peerId] = 'pending';
        const conn = localPeer
            .connect(peerId)
            .on('open', () => {
                this.register(conn);
            });
    }

    private register(conn: DataConnection) {
        this.peers[conn.peer] = conn;

        // Send current state
        this.state && conn.send(this.state);

        // Receive messages
        conn
            .on('data', (data) => {
                console.log(`Received from ${conn.peer}`, data);
                if (isStateUpdate(data) && data.tableUuid === this.tableUuid) {
                    this.onUpdate && this.onUpdate(data);
                }
            })
            .on('error', e => {
                console.error(e.message);
                conn.close();
            })
            .on('close', () => {
                // Remove peer from active connections
                delete this.peers[conn.peer];
                console.log(`Connection to peer ${conn.peer} closed`);
            });

        console.log(`Peer ${conn.peer} registered`);
    }
}
