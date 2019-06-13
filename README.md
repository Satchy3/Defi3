### `Install`

    npm install yarn

    install ganache (tested with Windows 10)
    npm install truffle

    cd client
    yarn install
    yarn start

start ganache at http://localhost:8545
build and deploy contracts with: ./truffle migrate

### `Setup`

./src/App.js: line 10

copy and update contract address

    const contractAddress="0x8584eBAc96B0688625f04Dcd3c0305F5DD8457b6"

update ganache id_user

    const id_user=1;

Dapp interface at localhost:3000


### `Tests`

choisir fichier -> le fichier est ajoute a la liste des fichiers à epingles

pin file -> le fichier est epingle et est affiche dans la liste des fichies epingles apres avoir clique sur Rafraichir Liste Fichiers Epingles

Get Raw file: affiche le binaire du fichier

display file: affiche l'image

Verifier que la balance du compte Ganache choisi a baisse de 0,01 par image epinglee
