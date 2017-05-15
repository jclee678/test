./geth --identity "nodeA" --rpc --rpcport "8008" --rpccorsdomain "*" --datadir "~/work/blockchain/ethereum/private/private1" --port "30303" --ipcpath "/Users/test/Library/Ethereum/geth.ipc" --ipcapi "admin,db,eth,debug,miner,net,shh,txpool,personal,web3" --rpcapi "personal,db,eth,net,web3"  --networkid 987654321 --nat "any" --mine --minerthreads 1 console

