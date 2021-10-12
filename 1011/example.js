const Web3 = require('web3');
let connection = new Web3('http://127.0.0.1:8546');

//eth_accounts
connection.eth.getAccounts().then( data=>{
    //프로미스 객체를 반환한다.
    console.log(data);
})

//eth_getBalance
connection.eth.getBalance('0x02a599969D9CeBD2Abb732cBa97206aF0C92D827').then(
    data=>{
        console.log(data)
    }
)
const ABI_CODE =  JSON.parse('[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"get","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}]');
//abi파일에 있는 것을 모두 복사해서 넣어준다.

const BYTECODE = '608060405234801561001057600080fd5b506040518060400160405280600b81526020017f68656c6c6f20776f726c640000000000000000000000000000000000000000008152506000908051906020019061005c929190610062565b50610166565b82805461006e90610134565b90600052602060002090601f01602090048101928261009057600085556100d7565b82601f106100a957805160ff19168380011785556100d7565b828001600101855582156100d7579182015b828111156100d65782518255916020019190600101906100bb565b5b5090506100e491906100e8565b5090565b5b808211156101015760008160009055506001016100e9565b5090565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061014c57607f821691505b602082108114156101605761015f610105565b5b50919050565b610232806101756000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c80636d4ce63c14610030575b600080fd5b61003861004e565b6040516100459190610179565b60405180910390f35b60606000805461005d906101ca565b80601f0160208091040260200160405190810160405280929190818152602001828054610089906101ca565b80156100d65780601f106100ab576101008083540402835291602001916100d6565b820191906000526020600020905b8154815290600101906020018083116100b957829003601f168201915b5050505050905090565b600081519050919050565b600082825260208201905092915050565b60005b8381101561011a5780820151818401526020810190506100ff565b83811115610129576000848401525b50505050565b6000601f19601f8301169050919050565b600061014b826100e0565b61015581856100eb565b93506101658185602086016100fc565b61016e8161012f565b840191505092915050565b600060208201905081810360008301526101938184610140565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806101e257607f821691505b602082108114156101f6576101f561019b565b5b5091905056fea264697066735822122053a2fbe5e470630734368f319a17b518c810f8853a5a073dee01dcd60ddc910964736f6c63430008090033';
//bin파일의 내용을 모두 복사해서 넣어준다.

// const contract = new connection.eth.Contract(ABI_CODE)
// //contract 메소드는 객체를 만들어주기때문에 new를 써주어야 함

// //배포(코드를 실행) deploy

// contract.deploy({
//     data:BYTECODE
// })
// .send({
//     from:'0x02a599969D9CeBD2Abb732cBa97206aF0C92D827',
//     gas:'6712975'
//    },(error,result)=>{
//        console.log(error);
//    }).then(data=>{
//        console.log(data.options.address);
//        //결과물에 대한 키값이라고 생각하면 된다. 
//        return data.methods.get().call()
//        //call()은 프로미스 객체를 반환한다.
//    })
//    .then(result =>{
//        console.log(result)
//    })
//여러개를 인자값을 넣을 수 있는데, 객체 형태로 해주자.
//스마트 컨트랙트를 실행하면 GAS가 발생한다. 
//내가 가스르 발생시킬 주소값과  GAS로 얼마나 깎을건지를 넣어주어야 함.
//주소값은 공개키값으로
//단위가 주석값으로 


const helloContract = new connection.eth.Contract(ABI_CODE,'0x73a8318D1472B9AF0BB685DDaef9b6F561207fc6');

helloContract.methods.get().call().then(data=>{
    console.log(data);
});//call은 실행시킨다. 그 결과를 promise 객체로 반환한다. 