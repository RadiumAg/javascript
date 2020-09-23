
async function pOne(){
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            console.log(111);
            resolve(111);
        }, 500);
    });
}



async function pTwo(){
    return new Promise((resolve,reject)=>{
        setTimeout(() => {
            console.log(222);
            resolve(222);
        }, 1000);
    });
}


async function main(){
    //并发
    let a = pOne();
    let b = pTwo();
   
    console.log(await a);
    //继发
    // let a = await pOne();
    // let b = await pTwo();
}
 
main();
