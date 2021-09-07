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
    return Blocks//배열
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
    const time = Math.floor(Date.now()/1000);
    const merkleTREE = merkle('sha256').sync(data)
    const merkleRoot = merkleTREE.root() || '0'.repeat(64)
    const header = new BlockHeader(version,index,previousHash,time,merkleRoot)
    return new Block(header,data)
}

function createHash(data){
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

function addBlock(newBlock){
    // const newBlock = nextBlock(data)
    if(isValidBlock(newBlock,getLastBlock())){
        //addblock에는 broadcast영역이 없다.그래서 작성해야 한다.

        Blocks.push(newBlock);
        return newBlock;
    }
    return false;
}


function isValidBlock(currentBlock,previousBlock){
    if(!isValidType(currentBlock)){
        console.log(`invalid block structure ${JSON.stringify(currentBlock)}`)
        return false
    };
    if(previousBlock.header.index+1 !== currentBlock.header.index){
        console.log(`invalid index`)
    }
    if(createHash(previousBlock) !== currentBlock.header.previousHash){
        console.log(`invalid hash value`)
    }
    if(currentBlock.body.length ===0 || (merkle("sha256").sync(currentBlock.body).root() !== currentBlock.header.merkleRoot)){
        console.log(`invalid body`)
    }

    isValidBlock2()
    return true
}

function isValidType(block){
    return(
    typeof(block.header.index)==="number" &&//num
    typeof(block.body)==="object" &&//obj
    typeof(block.header.version)==="string" &&//str
    typeof(block.header.previousHash)==="string" &&//str
    typeof(block.header.timestamp)==="number" &&//num
    typeof(block.header.merkleRoot)==="string"//str
    )
}

// addBlock(["hello1"]);
// addBlock(["hello2"]);
// addBlock(["hello3"]);
console.log(Blocks)


function isValidBlock2(){
    if(JSON.stringify(Blocks[0]) !== JSON.stringify(createGenesisBlock())){
        console.log(`invalid genesisBlock`)
        console.log(JSON.stringify(Blocks[0]))
        console.log(JSON.stringify(createGenesisBlock()))
        console.log('보여줬다.')
        return false
    }
    let tempBlocks = [Blocks[0]]
    for (let i =1; i<Blocks.length; i++){
        if(isValidBlock(Blocks[i],tempBlocks[i-1])){
            tempBlocks.push(Blocks[i])
        }else {
            console.log('이것도 안됨')
            return false
        }
    }
    
    return true;
}


////추가됨
const random = require('random')
function replaceBlock(newBlocks){
    //newBlocks:내가 받은 전체 배열> 내가 받은 전체 블록들
    Blocks=newBlocks
    //1.newBlocks내용을 검증해야 함. 이미 많이 만들어놔서 갖다가 쓰면 됨.
    //2.검증을 싱크의 속도가 다르기때문에 왠만하면  검증을 여러번 할 수 있게 해야함.(회시수를 랜덤으로)
    //3.Blocks = newBlocks
    //4.broadcast하기,,,,마지막껏만 일단 봐라. 

    if(isValidBlock(newBlocks) && newBlocks.length > Blocks &&random.boolean()){//안전하라고 이중 체크하는 것임
        console.log(`Blocks배열을 newBlocks로 교체하기`)
        const nw =require('./non_network')
        Blocks = newBlocks
        nw.broadcast(nw.responseLastMsg())
        return Blocks
    } else{
        console.log(`메세지로부터 받은 블록배열이 맞지 않습니다.`)
    }
}

function mineBlock(blockData){
    const newBlock = nextBlock(blockData)
    if(addBlock(newBlock)){
        const nw = require('./non_network')
        nw.broadcast(nw.responseLastMsg())
        return  newBlock
    }else{
        return null
    }
}
module.exports={
    mineBlock,getBlock,getLastBlock,addBlock,getVersion,createHash,replaceBlock
}
