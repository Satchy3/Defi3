pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract epinglage{

    event Epingler(
        //address indexed _from,
        //bytes32 indexed _id,
        //bytes32 documentHash,
        string message,
        string identifiant
    );

    function payerStockage(string memory id) public payable returns (uint){

            require(msg.value>1);
            emit Epingler("epingle et paye",id);
            return 1;
    }


}
