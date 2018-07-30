

pragma solidity ^0.4.21;
pragma experimental ABIEncoderV2;

//import './AngelToken.sol';
import 'zeppelin-solidity/contracts/math/SafeMath.sol';

contract SendABox {
    using SafeMath for uint256;
    address public owner;
    address developer;
    address government;
    //uint[5] canGiveValue;
    uint public constant SZABO_PER_WEI = 10000000000000000; //  0^16 개ㅑ 0.01 ether = 1 token 

    uint256 box_idx = 0;
    //uint[] public boxlist ;
    
    //AngelToken public token; 토큰 없애고 mapping 만들어서 포인트 처리
    mapping(address => uint256) balances;

    bool private closed;
    
    //event ev_GiveABoxFromDonator(uint256 _box_idx , address indexed _sender , string _message , uint _value , uint _token);

    event ev_SendABoxEvent(uint256 indexed _box_idx , address indexed _sender , uint256 _value , uint256 _token , string _message);

    //event ev_GetABox(address indexed _getter , uint256 _boxid , uint256 _value , uint256 _takevalue);
    
    /*
    struct ABoxInfo {
     //   uint    AboxNum;
        address donator;
        uint    value;
        //string  message;
    }
*/
   // ABoxInfo[] public ABoxList;
   // address[] public ABoxListTest;
    //mapping (uint => ABoxInfo ) boxtest;

    /*
    function SendABox(AngelToken _token) public {
        //require(_token != address(0));
        //token = _token; 토큰 제거 

        //require(_token.owner != msg.sender);
        owner = msg.sender;
        canGiveValue[0] = 10000000000000000; // 0.01 ether 0이 16개 
        canGiveValue[1] = 100000000000000000; // 0.1 ether 0이 17개 
        canGiveValue[2] = 1000000000000000000; // 1 ether 0이 18개 
        canGiveValue[3] = 10000000000000000000; // 10 ether 0이 19개 
        canGiveValue[4] = 10000000000000000; // 0.01 ether 0이 16개 
   
    }
    */
    function SendABox() public {
        //require(_token != address(0));
        //token = _token; 토큰 제거 
        box_idx = 0;
        //require(_token.owner != msg.sender);
        owner = msg.sender;
        //canGiveValue[0] = 10000000000000000; // 0.01 ether 0이 16개 
        //canGiveValue[1] = 100000000000000000; // 0.1 ether 0이 17개 
        //canGiveValue[2] = 1000000000000000000; // 1 ether 0이 18개 
        //canGiveValue[3] = 10000000000000000000; // 10 ether 0이 19개 
        //canGiveValue[4] = 10000000000000000; // 0.01 ether 0이 16개 
   
    }

    modifier onlyOwner() {
        require(owner == msg.sender);
        _;
    }
    /*
    function setcanGiveValue(uint _num , uint _value) public onlyOwner returns (bool) {
        canGiveValue[_num] = _value;
    }

     function getcanGiveValue(uint _num) public onlyOwner returns (uint) {
        return canGiveValue[_num];
    }
    */
/*
    function getABoxInfo(uint num) public view returns (uint , address ) {
        return (boxtest[num].value , boxtest[num].donator);
    }

    
    function getABoxInfoStruct(uint num) public view returns (uint , address ) {

        ABoxInfo memory aaa = boxtest[num];
        return (aaa.value , aaa.donator );
    }
*/
    /*
    function getboxlistarray() public returns (uint[]) {
        return boxlist;
    }
    */
    /*
    function GetAlBox() public returns (bool) {
        msg.sender.transfer(1);
        //msg.sender.transfer(address(this).balance);
        return true;
    }
    */
    /*
    function giveABoxForMessage(string message) external payable {
        require(!closed);
        require(msg.value > 0);

        giveABox(msg.sender , message);
    }

    function giveABox(address _from , string message) payable {
        
        require(!closed);
        require(msg.value == canGiveValue[0] || msg.value == canGiveValue[1] || msg.value == canGiveValue[2] || msg.value == canGiveValue[3] || msg.value == canGiveValue[4]); 
          
        uint256 amount = msg.value;
        
        //ABoxInfo memory boxinfo = ABoxInfo(_from , amount);
        
        var _id = ABoxList.push(ABoxInfo(_from , amount)) - 1;

        uint256 tokencnt = amount.div(SZABO_PER_WEI);
       
        //token.tokenadd(_from , tokencnt); 토큰 삭제 

        //emit ev_GiveABoxFromDonator(_id , msg.sender , message , msg.value , tokencnt);
        emit ev_SendABoxEvent(_id , msg.sender , msg.value , tokencnt , message);
    }
    */
    // Gas Used 를 줄이기 위해 message 를 받지 않고 DB 처리를 하는것이어떤가?
    // message 추가 하면 최초 76442 , 61314 , 61442
    function Contract_SendABox(string message) payable {
        
        require(!closed);
        //require(msg.value == canGiveValue[0] || msg.value == canGiveValue[1] || msg.value == canGiveValue[2] || msg.value == canGiveValue[3] || msg.value == canGiveValue[4]); 
          
        uint256 amount = msg.value; //주석처리 했을때 79066 -> 79052  , 58929 -> 58943
        
        //ABoxInfo memory boxinfo = ABoxInfo(_from , amount);
        
        //var _id = ABoxList.push(ABoxInfo(msg.sender , msg.value)) - 1; //주석 처리 했을때 79052 -> 33372
        //var _id = ABoxListTest.push(msg.sender) - 1; /bal/ 구조체 안쓰고 msg.sender 만 저장 하게 했을때  79052 -> 58929
        box_idx = box_idx + 1;
 
        uint256 tokencnt = amount.div(SZABO_PER_WEI);

        //token.tokenadd(msg.sender , tokencnt);
        balances[msg.sender] = balances[msg.sender].add(tokencnt);
        //emit ev_GiveABoxFromDonator(_id , msg.sender , message , msg.value , tokencnt);
        emit ev_SendABoxEvent(box_idx , msg.sender , amount, tokencnt , message);
    }
    /*
    function takeBox(address _getaddress , uint256 _boxid , uint256 _wei) public onlyOwner returns (bool) {

        uint256 amount = _wei;

        address donator = ABoxList[_boxid].donator;
        uint256 boxvalue = ABoxList[_boxid].value;
        
        uint256 takevalue = boxvalue.sub(9);
                
        _getaddress.transfer(amount);

        emit ev_GetABox(_getaddress , _boxid , amount , takevalue);
       
    }
    */
    /*

    function getABoxInfo(uint256 _id) public view returns (address , uint256) {

        return (ABoxList[_id].donator , ABoxList[_id].value);
    }
*/
     function balanceOf(address _owner) public view returns (uint256) {
        return balances[_owner];
    }

    function nowBoxid() public view returns (uint256) {
        return box_idx;
    }
}