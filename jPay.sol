pragma solidity ^0.4.0;

contract owned {
    address public owner;

    function owned() {
        owner = msg.sender;
    }
    
    modifier onlyOwner {
        if (msg.sender != owner)
            throw;
        _;
    }

    function transferOwnership(address newOwner) private onlyOwner {
        owner = newOwner;
    }
}


contract coinRecipient {
    function receiveApproval(address _from, uint256 _value, address _token);
}


contract JPayCoin is owned {

    struct Kudo
    {
        string sender;
        string receiver;
        string message;       
        uint256 amount; 
        uint256 time;
        uint256 transactionId;
    }

    /* Public variables of the token */
    string public name;
    string public symbol;
    uint8 decimals;

    uint256 public totalSupply;
    uint256 transactionCount;
    
    string constant openP = ' { ';
    string constant closeP = ' } ';
    string constant colon = ' : ';
    string constant comma = ' , ';
    string constant quote = '"';

    mapping (string => uint256) ConsumePoint;
    mapping (string => uint256) pointToGiveByVendors;
    mapping (string => uint256) pointReceivedByVendors;
    mapping (string => int) frozenAccount;
    
    mapping (string => int) consumerAccount;
    mapping (int => string) consumerList;
    int consumerCount;
    
    mapping (string => int) vendorAccount;
    mapping (int => string) vendorList;
    int vendorCount;
    
    mapping (string => Kudo[]) rewardEarnedByConsumer;
    mapping (string => uint256) rewardEarnedByConsumerCount;
    
    mapping (string => Kudo[]) rewardGivenByVendor;
    mapping (string => uint256) rewardGivenByVendorCount;

    mapping (string => Kudo[]) rewardSpentByConsumer;
    mapping (string => uint256) rewardSpentByConsumerCount;
    
    mapping (string => Kudo[]) rewardSpentOnVendor;
    mapping (string => uint256) rewardSpentOnVendorCount;

    /* Initializes contract with initial supply tokens to the creator of the contract */
    function JPayCoin(
        uint256 initialSupply,
        string tokenName,
        string tokenSymbol
    ) {
        owner = msg.sender;                    
        name = tokenName;                                   
        symbol = tokenSymbol;                               
        decimals = 0;                                       
        totalSupply = initialSupply;

    }
    
       
    function addConsumer(string memberAddr) {
        consumerAccount[memberAddr] = 1;
        consumerList[consumerCount] = memberAddr;
        consumerCount = consumerCount + 1;
    }
    
    function addVendor(string memberAddr) {
        vendorAccount[memberAddr] = 1;
        vendorList[vendorCount] = memberAddr;
        vendorCount = vendorCount + 1;
    }
    
    function getConsumer(int index) constant returns (string) {
        return consumerList[index];
    }
    
    function getVendor(int index) constant returns (string) {
        return vendorList[index];
    }
    
    function alreadyMemberComnsumer(string loginId) constant returns (int memberAlready){

        return consumerAccount[loginId]; 
    }
    
    
    function addVendorIfAbsent(string vendorId) {
        if (vendorAccount[vendorId] == 0) {
            addVendor(vendorId);
            sendPointToVendors(vendorId, 1000000);
        }
    }   


    function sendPointToVendors(string _to, uint256 _value) onlyOwner {                     
        pointToGiveByVendors[_to] += _value;                                              
    }
    
    
    function distributePoint(uint256 _value) onlyOwner {
        
        for(int i=0;i<vendorCount;i++)
        {        
            if (frozenAccount[vendorList[i]] == 0) {
               sendPointToVendors(vendorList[i], _value);
            }           
        }
    }
    
    function getPointToGiveByVendor(string uid) constant returns (uint256)
    {
        return pointToGiveByVendors[uid];
    }
    
    function getPointReceivedByVendor(string uid) constant returns (uint256)
    {
        return pointReceivedByVendors[uid];
    }
    
    
    function getConsumerBalance(string uid) constant returns (uint256)
    {
        return ConsumePoint[uid];
    }
    
        
    function getConsumerCount() constant returns (int) {
        return consumerCount;
    }
    
    // Redeem reward points by consumer
    function redeemPoint(string vendorId, string consumerId, uint256 _value) {
        if (consumerAccount[consumerId] == 0) throw;
        if (ConsumePoint[consumerId] < _value) throw;        
        if (frozenAccount[consumerId] == 1) throw;  
        ConsumePoint[consumerId] -= _value;
        pointReceivedByVendors[vendorId] += _value;  
    }
    
     // Redeem points by Consume
    function redeemPointByConsumer(string vendorId, string consumerId, uint256 value, string comment) {
        
        uint timeNow = now;
        
        transactionCount++;
        rewardSpentByConsumer[consumerId].push(Kudo(vendorId, consumerId, comment, value, timeNow, transactionCount));
        rewardSpentByConsumerCount[consumerId]++;
        
        rewardSpentOnVendor[vendorId].push(Kudo(vendorId, consumerId, comment, value, timeNow, transactionCount));
        rewardSpentOnVendorCount[vendorId]++;
        
        redeemPoint(vendorId, consumerId, value);
    }   

    function getNumberOfRewardsSpentByConsumer(string consumerId) constant returns (uint256) {
        return rewardSpentByConsumerCount[consumerId];
    }
    
    function getOneConsumerSpentRewardMessage(string id, uint index) constant returns (string, uint256, string,  uint256, uint256) {
        
        Kudo kd = rewardSpentByConsumer[id][index];
        return (kd.sender, kd.amount, kd.message, kd.time, kd.transactionId);
    }

    function getNumberOfRewardsSpentOnVendor(string vendorId) constant returns (uint256) {
        return rewardSpentOnVendorCount[vendorId];
    }
    
    function getOneSpentRewardOnVendorMessage(string id, uint index) constant returns (string, uint256, string,  uint256, uint256) {
        
        Kudo kd = rewardSpentOnVendor[id][index];
        return (kd.receiver, kd.amount, kd.message, kd.time, kd.transactionId);
    }

//====================================================================================================


    function givePoint(string vendorId, string consumerId, uint256 _value) private {
    
        if (pointToGiveByVendors[vendorId] < _value) throw;                 
        if (ConsumePoint[consumerId] + _value < ConsumePoint[consumerId]) throw; 
        if (frozenAccount[vendorId] == 1) throw; 
        pointToGiveByVendors[vendorId] -= _value;                         
        ConsumePoint[consumerId] += _value;                               
        
    }
    
    function saveConsumerPoint(string consumerId, uint256 point) {
        
        ConsumePoint[consumerId] = point;
    }
    
    function saveVendorPoints(string vendorId, uint256 pointToGive, uint256 pointReceived) {
        
        pointToGiveByVendors[vendorId] = pointToGive;
        pointReceivedByVendors[vendorId] = pointReceived;    
    }

    // Give reward point to consumer by vendor
    function givePointByVendor(string vendorId, string consumerId, uint256 value, string comment) {

        uint timeNow = now;
        
        transactionCount++;
        rewardEarnedByConsumer[consumerId].push(Kudo(vendorId, consumerId, comment, value, timeNow, transactionCount));
        rewardEarnedByConsumerCount[consumerId]++;
        
        rewardGivenByVendor[vendorId].push(Kudo(vendorId, consumerId, comment, value, timeNow, transactionCount));
        rewardGivenByVendorCount[vendorId]++;
        
        givePoint(vendorId, consumerId, value);
    }
    
    function getNumberOfRewardsEarnedByConsumer(string consumerId) constant returns (uint256) {
        return rewardEarnedByConsumerCount[consumerId];
    }
    
    function getOneEarnedRewardMessage(string id, uint index) constant returns (string, uint256, string,  uint256, uint256) {
        
        Kudo kd = rewardEarnedByConsumer[id][index];
        return (kd.sender, kd.amount, kd.message, kd.time, kd.transactionId);
    }
    
    function getNumberOfRewardsGivenByVendor(string vendorId) constant returns (uint256) {
        return rewardGivenByVendorCount[vendorId];
    }
    
    function getOneGivenRewardMessage(string id, uint index) constant returns (string, uint256, string,  uint256, uint256) {
        
        Kudo kd = rewardGivenByVendor[id][index];
        return (kd.receiver, kd.amount, kd.message, kd.time, kd.transactionId);
    }


//====================================================================================================================
 
    function stringToBytes32(string memory source) returns (bytes32 result) {
        assembly {
            result := mload(add(source, 32))
        }
    }
    
    function bytes32ToString(bytes32 x) constant returns (string) {
        bytes memory bytesString = new bytes(32);
        uint charCount = 0;
        for (uint j = 0; j < 32; j++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];
        }
        return string(bytesStringTrimmed);
    }

    
    function strConcat(string _a, string _b) internal returns (string){
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);

        string memory ab = new string(_ba.length + _bb.length);
        bytes memory ba = bytes(ab);
        uint k = 0;
        for (uint i = 0; i < _ba.length; i++) ba[k++] = _ba[i];
        for (i = 0; i < _bb.length; i++) ba[k++] = _bb[i];

        return string(ba);
    }
    
    function uint2str(uint i) internal returns (string){
        if (i == 0) return "0";
        uint j = i;
        uint len;
        while (j != 0){
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len - 1;
        while (i != 0){
            bstr[k--] = byte(48 + i % 10);
            i /= 10;
        }
        return string(bstr);
    }
    

    /* This unnamed function is called whenever someone tries to send ether to it */
    function () {
        throw;     // Prevents accidental sending of ether
    }


    function freezeAccount(string target, int freeze) private onlyOwner {
        frozenAccount[target] = freeze;
    }

}