const fs = require('fs');//filesystem
const merkle = require('merkle');
const CryptoJs = require('crypto-js');
const SHA256 = require('crypto-js/sha256');
let index=0;
function createGenesisBlock(aaaaa){
    //1.header만들기(5개의 인자를 만들기)
    const version = getVersion()
    const time = parseInt(Date.now()/1000)
    const previousHash =  aaaaa || '0'.repeat(64)
    //body의 내용으로 merkleroot를 만드는 것임. 그래서 먼저 body를 만듦
    const body = ['hello block']
    const tree = merkle('sha256').sync(body)
    const root = tree.root() || '0'.repeat(64)
    const header = new BlockHeader(version,index,previousHash,time,root)
    return new Block(header,body)
}

function getVersion(){
    const package = fs.readFileSync("../package.json");
    return JSON.parse(package).version;
};

class BlockHeader {
    constructor(version,index,previousHash,timestamp,merkleRoot){//header를 만들 인잣값들
        this.version = version//
        this.index = index
        this.previousHash = previousHash
        this.timestamp = timestamp 
        this.merkleRoot = merkleRoot

    }

}

class Block{
    constructor(header,body){
        this.header = header
        this.body = body
    }
}

const block=createGenesisBlock();

let Blocks= [createGenesisBlock()]

function getBlock(){
    return Blocks
}

function getLastBlock(){
    return Blocks[Blocks.length-1]
}

function nextBlock(data){
    //header
    const prevBlock = getLastBlock()
    const version = getVersion()
    const index = prevBlock.header.index + 1
    const previousHash = createHash(prevBlock) 
    const time = parseInt(Date.now()/1000);
    const merkleTREE = merkle('sha256').sync(data)
    const merkleRoot = merkleTREE.root() || '0'.repeat(64)
    /*이전 해쉬값의
    SHA256(versiton+index+previousHash+timestamp+merkleRoot)*/

    const header = new BlockHeader(version,index,previousHash,time,merkleRoot)
    return new Block(header,data)
}

function createHash(data){
    //header
    const {
        version,
        index,
        previoushash,
        time,
        merkleRoot
    } = data.header
    const blockString = version+index+previoushash+time+merkleRoot
    const Hash = CryptoJs.SHA256(blockString).toString()
    return Hash
}

function addBlock(data){
    //header+body
    //검증을 위한 미리 공간을 확보해 놓은 것
    // 함수 하나에는 함수 하나의 기능만 할 수 있게끔
    const newBlock = nextBlock(data)
    if(isValidBlock(newBlock,getLastBlock())){
        
        Blocks.push(newBlock);
        return true;
    }
    return false;
}
 

function isValidBlock(currentBlock,previousBlock){//1.타입, 인덱스값이 유효한지
//인덱스값은 지금 현재 블럭의 인덱스값이 예전 블럭의 인덱스의 +1이어야 한다.
    //검증1.타입(배열인지 객체인지 스트링인지...)
    if(!isValidType(currentBlock)){
        console.log(`invalid block structure ${JSON.stringify(currentBlock)}`)
        return false//false되면 바로 빠져나가기에 elseif로 굳이 안써도 된다. 
    };
    if(previousBlock.header.index+1 !== currentBlock.header.index){
        console.log(`invalid index`)
    }
    //previous Hash체크
    //해당 블럭의 header의 내용을 글자로 합쳐서 sha256 활용하여 암호화한 결과물 
    //제네시스 블럭 기준>2번째 블럭
    if(createHash(previousBlock) !== currentBlock.header.previousHash){
        console.log(`invalid hash value`)
    }
    //body check
    //데이터의 내용들을 쪼개서 변한적이 있는가 없는가를 
    //거래가 이루어지면 어떻게 블럭체인 코드가 변하는지 궁금함.
    //body내용만 다르게 넣을 수 있지 않는지 궁금함.

    //current.header.markleRoot =>body[배열]
    //current.body->merkleTree root -> result !== current.header.merkleRoot

    //body의 내용또한 없으면 안된다.
    //current.body.length !==0 || (currentBlock.body 가지고 만든 merkleRoot !== currentBlock.header.merkleRoot)
    //current.body.length !==0 || (merkle("sha256").sync(currentBlock.body).root() !== currentBlock.header.merkleRoot)
    if(currentBlock.body.length ===0 || (merkle("sha256").sync(currentBlock.body).root() !== currentBlock.header.merkleRoot)){
        console.log(`invalid body`)
    }

    //1. wpsptltm qmffjrdl dbgygkswl epdlxjrk qkRnlswjrdl dqjtsmswl.
    //2.ㅠㅣㅐ찬ahems
    //1.제네시스 블럭이 유효한지 데이터가 바뀐 적이 없는지
    //2.blocks의 모든 배열을 검사할 것
    isValidBlock2()
    return true
}

function isValidType(block){
    //내가 검사할 블럭
    return(
    typeof(block.header.index)==="number" &&//num
    typeof(block.body)==="object" &&//obj
    typeof(block.header.version)==="string" &&//str
    typeof(block.header.previousHash)==="string" &&//str
    typeof(block.header.timestamp)==="number" &&//num
    typeof(block.header.merkleRoot)==="string"//str
    )
}
// 검증
// 1.타입
// 2.데이터가 잘 갔는지
// 3.데이터에 대한 검증
addBlock(["hello1"]);
addBlock(["hello2"]);
addBlock(["hello3"]);
console.log(Blocks)


function isValidBlock2(Blocks){
    //genesis블럭은 하드코딩으로 되어 있다. 그렇기 때문에 genesisblock은 
    console.log('제네시스블럭')
    console.log(JSON.stringify(Blocks[0]))
    console.log('제네시스블럭잘못됬는지')
    console.log(JSON.stringify(createGenesisBlock()))
    console.log('---------------')
    if(JSON.stringify(Blocks[0]) !== JSON.stringify(createGenesisBlock())){
        //{}!=={} 객체와 객체는 같지 않다!
        console.log(`invalid genesisBlock`)
        return false
    }
    let tempBlocks = [Blocks[0]]//이미 검사가 끝났고, 하드코딩이 되어있기 때문에
    for (let i =1; i<Blocks.length; i++){
        if(isValidNewBlock(Blocks[i],Blocks[i-1])){
            tempBlocks.push(Blocks[i])
        }else {
            console.log('이것도 안됨')
            return false
        }
    }
    
    return true;
}

module.exports={
    getBlock,getLastBlock,addBlock,getVersion
}