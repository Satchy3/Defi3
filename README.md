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

App.js: line 6 and 8

copy and update contract address in App.js line 8

    const contractMarketAddress="0x8584eBAc96B0688625f04Dcd3c0305F5DD8457b6"

update ganache id_user and its private key

    const id_user=0;
recupere la cle privee de pour user ganache, important pour avoir la bonne balance affichee

    const privatekeySelectUserId="049ae7d5c8ca0e06be51cde77cd1c0c4e164bc1c84e7973039c1860e3d2af9d0"

Dapp interface at localhost:3000


### `Tests`

choisir un fichier=> le fichier est ajoute à la liste des fichiers à epingler dans ipfs
pin -> fichier est pin, le hash apparait dans la liste des ficher epinglés apres avoir clique Rafraichir La liste des fichiers epingles
get raw file: affiche le binaire du fichier epingle
display file: affiche l'image du fichier
